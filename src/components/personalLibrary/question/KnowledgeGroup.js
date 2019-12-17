import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomizedTable from './CustomizedTable';
import axios from 'axios';
import { Dropdown } from 'react-materialize';
import ModalQuestion from './ModalQuestion';
import ModalEditQuestion from './ModalEditQuestion';
import { serverUrl } from '../../common/common'
import Advertisement from '../../common/Advertisement';
import HorizontalAd1 from '../../../resources/horizontalAd1.png';


class KnowledgeGroup extends Component {

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

    updateQuestionList = () => {
        let folderId = this.state.currentFolder.folderId;
        console.log("updateQList1")
        if (folderId && !this.waitUpdate) {
            console.log("updateQList2")
            let found = false;
            if (this.props.folder.folders) {
                console.log("updateQList3")
                this.props.folder.folders.map((folder, index) => {
                    if (folder.folderId == folderId) {
                        found = true;
                        let currentFolder = folder;
                        this.waitUpdate = true;
                        this.setState({
                            currentFolder,
                        }, () => {
                            this.waitUpdate = false;
                            console.log("updateQList4")
                            axios.get(serverUrl + "api/question/" + this.props.user.uid + "/" + folderId).then(res => {
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
                                        el.difficultyId = Math.round(meanDifficulty);
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

                    }
                })
            }
            if (!found) {
                console.log("wut");
                this.props.history.push("/personalLibrary/knowledgeGroup/0");
            }
        }
    }

    componentDidUpdate() {
        let folderId = this.props.match.params.folderId;
        if (folderId == 0 && !this.waitUpdate) {
            this.waitUpdate = true;
            axios.get(serverUrl + "api/question/" + this.props.user.uid).then(res => {
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
                        el.difficultyId = Math.round(meanDifficulty);
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
                    currentFolder: {
                        ...prevState.currentFolder,
                        folderId: 0,
                    }
                }), () => {
                    this.waitUpdate = false;
                })
            });
        } else {
            if (folderId && this.state.currentFolder && folderId !== this.state.currentFolder.folderId && !this.waitUpdate) {
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
                                                el.difficultyId = Math.round(meanDifficulty);
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
                    console.log("wut");
                    this.props.history.push("/personalLibrary/knowledgeGroup/0");
                }
            }
        }
    }

    componentDidMount() {
        let folderId = this.props.match.params.folderId;
        console.log("test", folderId);
        // if (folderId != 0) {
        // let found = false;
        // if (this.props.folder.folders) {
        //     found = true;
        //     this.waitUpdate = true;
        axios.get(serverUrl + "api/folder/" + folderId).then(res => {
            if (res.data) {
                this.setState({
                    currentFolder: res.data,
                })
            } else {
                this.props.history.push("/personalLibrary/knowledgeGroup/0");
            }
        })
        axios.get(serverUrl + "api/question/" + this.props.user.uid + "/" + folderId).then(res => {
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
            }, () => {
                this.waitUpdate = false;
            })
        });
        // }
        // if (!found) {
        //     console.log("wut");
        //     this.props.history.push("/personalLibrary/knowledgeGroup/0");
        // }
        // } else {
        //     this.waitUpdate = true;
        //     axios.get(serverUrl + "api/question/" + this.props.user.uid).then(res => {
        //         let questionList = res.data.map(question => {
        //             // question.content = question.content.slice(0, question.content.length - 2) + "]";
        //             question.content = JSON.parse(question.content);
        //             return question;
        //         });

        //         let linkedQuestionList = questionList.map((el, i) => {
        //             if (el.questionTypeId == 3) {
        //                 let childQuestions = questionList.filter((child, i) => el.questionId == child.questionParentId);
        //                 el.childQuestions = childQuestions;
        //                 let meanDifficulty = 0;
        //                 childQuestions.map((child, i) => {
        //                     meanDifficulty += child.difficultyId;
        //                 })
        //                 meanDifficulty = meanDifficulty / childQuestions.length;
        //                 el.difficultyId = meanDifficulty;
        //             }
        //             if (el.questionParentId == 0) {
        //                 return el;
        //             }
        //         })

        //         linkedQuestionList = linkedQuestionList.filter(el => el);

        //         this.setState({
        //             questionList,
        //             linkedQuestionList,
        //         }, ()=>{
        //             this.waitUpdate =false;
        //         })
        //     });
        // }
    }

    render() {
        return (
            <div id="knowledgeGroup" className="knowledgeGroup row">
                <button onClick={() => { console.log(this.state) }}>Click me</button>
                <ModalQuestion currentFolder={this.state.currentFolder} updateQuestionList={this.updateQuestionList} />
                <ModalEditQuestion currentQuestion={this.state.currentQuestion} updateQuestionList={this.updateQuestionList} />
                <div className="col s4 container min-height-60 knowledgeGroup-header" >

                    {this.state.currentFolder && this.state.currentFolder.folderId != 0 ? (
                        <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ paddingLeft: "10px" }}>
                            {this.state.currentFolder.folderName}
                            <Dropdown
                                trigger={<i className="material-icons grey-text text-darken-3">more_vert</i>}
                            >
                                <span onClick={() => { alert("Import") }}>Import</span>
                            </Dropdown>
                        </h5>
                    ) : (
                            <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ paddingLeft: "10px" }}>Thư viện câu hỏi</h5>
                        )}


                    <p className='grey-text text-darken-3' style={{ position: "relative", top: "-15px", paddingLeft: "10px" }}>
                        {/* {this.state.questionList.length} câu hỏi */}
                        {this.state.linkedQuestionList && this.state.linkedQuestionList.length} câu hỏi
                    </p>
                </div>
                <div className="col s8 container ">
                    <Advertisement imgSrc={HorizontalAd1} />
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

export default connect(mapStateToProps)(withRouter(KnowledgeGroup));