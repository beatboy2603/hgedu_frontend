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
                                axios.get(serverUrl + "api/question/" + this.props.user.uid + "/" + folderId).then(res => {
                                    let questionList = res.data.map(question => {
                                        question.content = question.content.slice(0, question.content.length - 2) + "]";
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
                                    this.setState(prevState => ({
                                        ...prevState,
                                        questionList,
                                        linkedQuestionList,
                                    }))
                                })
                            })
                        } else {
                            this.waitUpdate = false;
                        }
                    }
                })
            }
            if (!found) {
                this.props.history.push("/personalLibrary");
            }
        }
    }

    componentDidMount() {
        // let { setQuestionFolderId } = this.props;
        // // this.setState({
        // //     currentFolder,
        // // })
        // setQuestionFolderId(this.props.match.params.folderId);

        let folderId = this.props.match.params.folderId;
        axios.get(serverUrl + "api/folder/" + folderId).then(res => {
            if (res.data) {
                this.setState({
                    currentFolder: res.data,
                })
            } else {
                this.props.history.push("/personalLibrary");
            }
        })
        axios.get(serverUrl + "api/question/" + this.props.user.uid + "/" + folderId).then(res => {
            let questionList = res.data.map(question => {
                question.content = question.content.slice(0, question.content.length - 2) + "]";
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
            })
        });
    }

    render() {
        return (
            <div id="knowledgeGroup" className="knowledgeGroup row">
                <button onClick={() => { console.log(this.state) }}>Click me</button>
                {/* <ModalTest/> */}
                <div className="col s4 container min-height-60 knowledgeGroup-header" >
                    <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ paddingLeft: "10px" }}>{this.state.currentFolder && this.state.currentFolder.folderName}
                        <Dropdown
                            trigger={<i className="material-icons grey-text text-darken-3">more_vert</i>}
                        >
                            
                        </Dropdown>
                        
                    </h5>
                    <ExportButton />
                    <p className='grey-text text-darken-3' style={{ position: "relative", top: "-15px", paddingLeft: "10px" }}>{this.state.questionList.length} câu hỏi</p>
                </div>
                <div className="col s8">
                    <Advertisement imgSrc={HorizontalAd1} />
                </div>
                <div className="row col s12">
                    <div className="col s3">
                        <h3 className="blue-text text-darken-2 font-montserrat center">0</h3>
                        <p className="center">Tổng số câu hỏi</p>
                    </div>
                    <div className="col s3">
                        <h3 className="green-text text-darken-2 font-montserrat center">-:-</h3>
                        <p className="center">Lý thuyết:Bài tập</p>
                    </div>
                    <div className="col s3">
                        <h3 className="purple-text text-darken-2 font-montserrat center">-</h3>
                        <p className="center">Độ khó trung bình</p>
                    </div>
                    <div className="col s3">
                        <h3 className="orange-text text-darken-2 font-montserrat center">-</h3>
                        <p className="center">Độ toàn diện</p>
                    </div>
                    <div className="col s6">
                        <h3 className="pink-text text-darken-2 font-montserrat center">-:-:-:-</h3>
                        <p className="center">Phân phối mức khó</p>
                    </div>
                    <div className="col s6">
                        <h3 className="teal-text text-darken-2 font-montserrat center">-</h3>
                        <p className="center">Kiến thức đặc thù</p>
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