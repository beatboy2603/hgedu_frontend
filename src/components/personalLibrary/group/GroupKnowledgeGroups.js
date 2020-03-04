import React, { Component } from 'react'
import axios from "axios";
import { serverUrl } from "../../common/common"
import { withRouter} from "react-router-dom";
import {connect} from "react-redux";

class GroupKnowledgeGroups extends Component {

    state = {
        currentFolder: null,

        searchInput: "",
    };

    componentDidUpdate() {
        let folderId = this.props.match.params.folderId;
        if (folderId == 0 && !this.waitUpdate) {
            this.waitUpdate = true;
            //   axios.get(serverUrl + "api/question/" + this.props.user.uid).then(res => {
            //     let questionList = res.data.map(question => {
            //       // question.content = question.content.slice(0, question.content.length - 2) + "]";
            //       question.content = JSON.parse(question.content);
            //       return question;
            //     });
            //     let linkedQuestionList = questionList.map((el, i) => {
            //       if (el.questionTypeId == 3) {
            //         let childQuestions = questionList.filter(
            //           (child, i) => el.questionId == child.questionParentId
            //         );
            //         el.childQuestions = childQuestions;
            //         let meanDifficulty = 0;
            //         childQuestions.map((child, i) => {
            //           meanDifficulty += child.difficultyId;
            //         });
            //         meanDifficulty = meanDifficulty / childQuestions.length;
            //         el.difficultyId = Math.round(meanDifficulty);
            //       }
            //       if (el.questionParentId == 0) {
            //         return el;
            //       }
            //     });

            // linkedQuestionList = linkedQuestionList.filter(el => el);

            this.setState(prevState => ({
                ...prevState,
                //   questionList,
                //   linkedQuestionList,
                currentFolder: {
                    ...prevState.currentFolder,
                    folderId: 0
                }
            }), () => {
                this.waitUpdate = false;
            }
            );
            //   });
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
                                    currentFolder
                                }, () => {
                                    this.waitUpdate = false;
                                    // axios.get(serverUrl + "api/question/" + this.props.user.uid + "/" + folderId).then(res => {
                                    //     let questionList = res.data.map(question => {
                                    //         // question.content = question.content.slice(0, question.content.length - 2) + "]";
                                    //         question.content = JSON.parse(question.content);
                                    //         return question;
                                    //     });
                                    //     let linkedQuestionList = questionList.map((el, i) => {
                                    //         if (el.questionTypeId == 3) {
                                    //             let childQuestions = questionList.filter(
                                    //                 (child, i) =>
                                    //                     el.questionId == child.questionParentId
                                    //             );
                                    //             el.childQuestions = childQuestions;
                                    //             let meanDifficulty = 0;
                                    //             childQuestions.map((child, i) => {
                                    //                 meanDifficulty += child.difficultyId;
                                    //             });
                                    //             meanDifficulty =
                                    //                 meanDifficulty / childQuestions.length;
                                    //             el.difficultyId = Math.round(meanDifficulty);
                                    //         }
                                    //         if (el.questionParentId == 0) {
                                    //             return el;
                                    //         }
                                    //     });

                                    //     linkedQuestionList = linkedQuestionList.filter(
                                    //         el => el
                                    //     );
                                    //     this.setState(prevState => ({
                                    //         ...prevState,
                                    //         questionList,
                                    //         linkedQuestionList
                                    //     }));
                                    // });
                                }
                                );
                            } else {
                                this.waitUpdate = false;
                            }
                        }
                    });
                }
                if (!found) {
                    this.props.history.push("/personalLibrary/knowledgeGroup/0");
                }
            }
        }
    }

    componentDidMount() {
        let folderId = this.props.match.params.folderId;
        axios.get(serverUrl + "api/folder/" + folderId).then(res => {
            if (res.data) {
                this.setState({
                    currentFolder: res.data
                });
            } else {
                this.props.history.push("/personalLibrary/groupList");
            }
        });
    }

    render() {
        return (
            <div id="group" className="group row">
                <div className="col s4 container min-height-60 knowledgeGroup-header">
                    {this.state.currentFolder &&
                        this.state.currentFolder.folderId != 0 ? (
                            <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ paddingLeft: "10px" }}>
                                {this.state.currentFolder.folderName}
                                <i className="material-icons grey-text text-darken-3">more_vert</i>
                                {/* <Dropdown trigger={
                                    <i className="material-icons grey-text text-darken-3">
                                        more_vert
                  </i>
                                }>
                                </Dropdown> */}
                            </h5>
                        ) : (
                            <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ paddingLeft: "10px" }}>Nhóm</h5>
                        )}

                    <p className="grey-text text-darken-3" style={{ position: "relative", top: "-15px", paddingLeft: "10px" }}>{"?"}{" "}nhóm</p>
                </div>
                <div className="col s8 container ">
                    {/* <Advertisement imgSrc={HorizontalAd1} /> */}
                </div>
                <div className="row col s12" style={{ borderTop: "1px solid grey", borderBottom: "1px solid grey", marginTop: "20px" }}>
                    <div className="col s2 flex-row" >
                        <i className="material-icons" style={{ padding: "15px" }}>search</i>
                        <span>Tìm kiếm</span>
                    </div>
                    <div className="col s10">
                        <input type="text" style={{ borderBottom: "none" }} />
                    </div>
                </div>
                <div className="col s12 no-padding center">
                    {/* <SimpleTable /> */}

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    folder: state.folder,
    abbreviation: state.abbreviation,
})

export default connect(mapStateToProps)(withRouter(GroupKnowledgeGroups));