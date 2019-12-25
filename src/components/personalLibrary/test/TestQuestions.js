import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomizedTable from './CustomizedTable';
import axios from 'axios';
import { Dropdown } from 'react-materialize';
import ModalTest from './ModalTest';
import { serverUrl } from '../../common/common'
import Advertisement from '../../common/Advertisement'
import HorizontalAd1 from '../../../resources/horizontalAd1.png'
import ExportButton from './ExportButton'


class TestQuestions extends Component {

    state = {
        currentFolder: null,
        questionList: [],
        linkedQuestionList: [],
        currentQuestion: null,
        testQuality: {
            noOfQuestions: 0,
            testCoverage: "-",
            meanDifficulty: 0,
            typeRatio: "-:-",
            difficultyDistribution: "-:-:-:-",
        },
        allKnowledgeGroups: [],
    }

    updateTestQuality = () => {
        let testQuality = {
            noOfQuestions: 0,
            testCoverage: "-",
            meanDifficulty: 0,
            typeRatio: "-:-",
            difficultyDistribution: "-:-:-:-",
        }
        let knowledgeGroups = [];
        let questionType1 = 0;
        let difficulties = [0, 0, 0, 0];
        this.state.linkedQuestionList.map((el, i) => {
            if (el.childQuestions) {
                el.childQuestions.map((subEl, j) => {
                    testQuality.noOfQuestions += 1;
                    testQuality.meanDifficulty += subEl.difficultyId;
                    if (knowledgeGroups.indexOf(subEl.folderId) == -1) {
                        knowledgeGroups.push(subEl.folderId);
                    }
                    if (subEl.questionTypeId == 1) {
                        questionType1 += 1;
                    }
                    if (subEl.difficultyId == 1) {
                        difficulties[0] += 1;
                    }
                    if (subEl.difficultyId == 2) {
                        difficulties[1] += 1;
                    }
                    if (subEl.difficultyId == 3) {
                        difficulties[2] += 1;
                    }
                    if (subEl.difficultyId == 4) {
                        difficulties[3] += 1;
                    }
                })
            } else {
                testQuality.noOfQuestions += 1;
                testQuality.meanDifficulty += el.difficultyId;
                if (knowledgeGroups.indexOf(el.folderId) == -1) {
                    knowledgeGroups.push(el.folderId);
                }
                if (el.questionTypeId == 1) {
                    questionType1 += 1;
                }
                if (el.difficultyId == 1) {
                    difficulties[0] += 1;
                }
                if (el.difficultyId == 2) {
                    difficulties[1] += 1;
                }
                if (el.difficultyId == 3) {
                    difficulties[2] += 1;
                }
                if (el.difficultyId == 4) {
                    difficulties[3] += 1;
                }
            }
        })
        if (testQuality.noOfQuestions != 0) {
            testQuality.meanDifficulty = testQuality.meanDifficulty / testQuality.noOfQuestions;
            testQuality.meanDifficulty = testQuality.meanDifficulty.toFixed(2);
        } else {
            testQuality.meanDifficulty = 0;
        }
        testQuality.testCoverage = ((knowledgeGroups.length / this.state.allKnowledgeGroups.length) * 100).toFixed(2) + "%";
        testQuality.typeRatio = questionType1 + ":" + (testQuality.noOfQuestions - questionType1);
        testQuality.difficultyDistribution = difficulties[0] + ":" + difficulties[1] + ":" + difficulties[2] + ":" + difficulties[3];
        this.setState(prevState => ({
            ...prevState,
            testQuality,
        }));
    }

    waitUpdate = false;

    setCurrentQuestion = (question) => {
        this.setState({
            currentQuestion: question
        })
    }

    componentDidUpdate() {
        let folderId = this.props.match.params.folderId;
        if (this.state.currentFolder && folderId !== this.state.currentFolder.folderId && !this.waitUpdate) {
            let found = false;
            if (this.props.folder.folders) {
                this.waitUpdate = true;
                this.props.folder.folders.map((folder, index) => {
                    if (folder.folderId == folderId) {
                        found = true;
                        let currentFolder = folder;
                        if (currentFolder !== this.state.currentFolder) {
                            this.setState({
                                currentFolder,
                            }, () => {
                                this.waitUpdate = false;
                                axios.get(serverUrl + "api/test/" + folderId).then(res => {
                                    console.log("testContent",res)
                                    let questionList = res.data.map(question => {
                                        // question.content = question.content.slice(0, question.content.length - 2) + "]";
                                        question.content = JSON.parse(question.content);
                                        return question;
                                    });
                        
                                    let linkedQuestionList = questionList.map((el, i) => {
                                        if (el.questionTypeId == 3) {
                                            let childQuestions = questionList.filter((child, i) => el.questionId == child.questionParentId);
                                            el.childQuestions = childQuestions;
                                            let meanDifficulty = 0;
                                            childQuestions.map((child, i) => {
                                                meanDifficulty += child.difficultyId;
                                            })
                                            meanDifficulty = meanDifficulty / childQuestions.length;
                                            el.difficultyId = meanDifficulty;
                                        }
                                        if (el.questionParentId == 0) {
                                            return el;
                                        }
                                    })
                        
                                    linkedQuestionList = linkedQuestionList.filter(el => el);
                        
                                    this.setState({
                                        questionList,
                                        linkedQuestionList,
                                    }, ()=>{this.updateTestQuality()})
                                });
                            })
                        } else {
                            this.waitUpdate = false;
                        }
                    }
                })
            }
            if (!found) {
                this.props.history.push("/personalLibrary/testList");
            }
        }
    }

    componentDidMount() {
        // let { setQuestionFolderId } = this.props;
        // // this.setState({
        // //     currentFolder,
        // // })
        // setQuestionFolderId(this.props.match.params.folderId);
        axios.get(serverUrl + "api/folder/getAllKnowledgeGroupsId/" + this.props.user.uid).then(res => {
            const allKnowledgeGroups = res.data;
            this.setState(prevState => ({
                ...prevState,
                allKnowledgeGroups,
                questionDetail: {
                    ...prevState.questionDetail,
                    folderId: res.data.folderId,
                }
            }))
        })

        let folderId = this.props.match.params.folderId;
        axios.get(serverUrl + "api/folder/" + folderId).then(res => {
            if (res.data) {
                this.setState({
                    currentFolder: res.data,
                })
            } else {
                this.props.history.push("/personalLibrary/testList");
            }
        })
        axios.get(serverUrl + "api/test/" + folderId).then(res => {
            console.log("testContent",res)
            let questionList = res.data.map(question => {
                // question.content = question.content.slice(0, question.content.length - 2) + "]";
                question.content = JSON.parse(question.content);
                return question;
            });

            let linkedQuestionList = questionList.map((el, i) => {
                if (el.questionTypeId == 3) {
                    let childQuestions = questionList.filter((child, i) => el.questionId == child.questionParentId);
                    el.childQuestions = childQuestions;
                    let meanDifficulty = 0;
                    childQuestions.map((child, i) => {
                        meanDifficulty += child.difficultyId;
                    })
                    meanDifficulty = meanDifficulty / childQuestions.length;
                    el.difficultyId = meanDifficulty;
                }
                if (el.questionParentId == 0) {
                    return el;
                }
            })

            linkedQuestionList = linkedQuestionList.filter(el => el);

            this.setState({
                questionList,
                linkedQuestionList,
            }, ()=>{this.updateTestQuality()})
        });
    }

    render() {
        return (
            <div id="knowledgeGroup" className="knowledgeGroup row">
                {/* <ModalTest/> */}
                <div className="col s4 container min-height-60 knowledgeGroup-header" >
                    <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ paddingLeft: "10px" }}>{this.state.currentFolder && this.state.currentFolder.folderName}
                        <Dropdown
                            trigger={<i className="material-icons grey-text text-darken-3">more_vert</i>}
                        >
                            {this.state.currentFolder&&
                            <ExportButton url={serverUrl + "testimportexport/download/" + this.state.currentFolder.folderId}/>}
                        </Dropdown>
                    </h5>
                    <p className='grey-text text-darken-3' style={{ position: "relative", top: "-15px", paddingLeft: "10px" }}>{this.state.questionList.length} câu hỏi</p>
                </div>
                <div className="col s8">
                    <Advertisement imgSrc={HorizontalAd1} />
                </div>
                <div className="row col s12">
                <div className='col s12'>
                                    <p className="blue-text lighten-3">Chất lượng đề</p>
                                </div>
                                <div className="col s4">
                                    <h3 className="blue-text text-darken-2 font-montserrat center">{this.state.testQuality.noOfQuestions}</h3>
                                    <p className="center">Tổng số câu hỏi</p>
                                </div>
                                <div className="col s4">
                                    <h3 className="orange-text text-darken-2 font-montserrat center">{this.state.testQuality.testCoverage}</h3>
                                    <p className="center">Độ toàn diện</p>
                                </div>
                                <div className="col s4">
                                    <h3 className="purple-text text-darken-2 font-montserrat center">{this.state.testQuality.meanDifficulty}</h3>
                                    <p className="center">Độ khó trung bình</p>
                                </div>
                                <div className="col s6">
                                    <h3 className="green-text text-darken-2 font-montserrat center">{this.state.testQuality.typeRatio}</h3>
                                    <p className="center">Lý thuyết:Bài tập</p>
                                </div>
                                <div className="col s6">
                                    <h3 className="pink-text text-darken-2 font-montserrat center">{this.state.testQuality.difficultyDistribution}</h3>
                                    <p className="center">Phân phối mức khó</p>
                                </div>
                </div>
                <div className="col s12 no-padding center">
                    {/* <SimpleTable /> */}
                    <CustomizedTable
                        headCells={[
                            { id: 'questionCode', numeric: false, disablePadding: false, label: 'Mã câu' },
                            { id: 'content', numeric: false, disablePadding: false, label: 'Câu hỏi' },
                            { id: 'difficultyId', numeric: false, disablePadding: false, label: 'Mức khó' },
                            { id: 'gradeLevelId', numeric: false, disablePadding: false, label: 'Trình độ' },
                            { id: 'questionTypeId', numeric: false, disablePadding: false, label: 'Thuộc tính' },
                        ]}
                        rows={this.state.linkedQuestionList}
                        setCurrentQuestion={this.setCurrentQuestion} />
                </div>


            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    folder: state.folder,
})

export default connect(mapStateToProps)(withRouter(TestQuestions));