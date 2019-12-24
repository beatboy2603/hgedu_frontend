import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import CustomizedTable from "./CustomizedTable";
import axios from "axios";
import { Dropdown } from "react-materialize";
import ModalQuestion from "./ModalQuestion";
import ModalEditQuestion from "./ModalEditQuestion";
import { serverUrl } from "../../common/common";
import Advertisement from "../../common/Advertisement";
import HorizontalAd1 from "../../../resources/horizontalAd1.png";
import ImportButton from "./ImportButton";

class KnowledgeGroup extends Component {
  state = {
    currentFolder: null,
    questionList: [],
    linkedQuestionList: [],
    currentQuestion: null,

    file: "",
    error: "",
    msg: "",
  };

  onFileChange = event => {
    console.log("change")
    this.setState({
      file: event.target.files[0]
    }, () => { this.importFile(event) });
  };

  importFile = event => {
    event.preventDefault();
    this.setState({ error: "", msg: "" });
    console.log("import");
    if (!this.state.file) {
      this.setState({ error: "Please upload a file." });
      return;
    }

    if (this.state.file.size >= 2000000) {
      this.setState({ error: "File size exceeds limit of 2MB." });
      return;
    }

    let data = new FormData();
    data.append("file", this.state.file);
    data.append("name", this.state.file.name);

    fetch(serverUrl + "testimportexport/upload", {
      method: "POST",
      body: data
    })
      .then(response => {
        this.setState({ error: "", msg: "Sucessfully uploaded file" });
        console.log("Upload file OK");
      })
      .catch(err => {
        this.setState({ error: err });
      });
    axios.get(serverUrl + "testimportexport/import/" + this.state.currentFolder.folderId + "/" + this.props.user.uid).then(res => {
      console.log("import OK");
    });
  };

  waitUpdate = false;

  setCurrentQuestion = question => {
    this.setState({
      currentQuestion: question
    });
  };

  updateQuestionList = () => {
    let folderId = this.state.currentFolder.folderId;
    if (folderId && !this.waitUpdate) {
      let found = false;
      if (this.props.folder.folders) {
        this.props.folder.folders.map((folder, index) => {
          if (folder.folderId == folderId) {
            found = true;
            let currentFolder = folder;
            this.waitUpdate = true;
            this.setState({
              currentFolder
            }, () => {
              this.waitUpdate = false;
              console.log("updateQList4");
              axios.get(serverUrl + "api/question/" + this.props.user.uid + "/" + folderId).then(res => {
                let questionList = res.data.map(question => {
                  // question.content = question.content.slice(0, question.content.length - 2) + "]";
                  question.content = JSON.parse(question.content);
                  return question;
                });
                let linkedQuestionList = questionList.map((el, i) => {
                  if (el.questionTypeId == 3) {
                    let childQuestions = questionList.filter(
                      (child, i) => el.questionId == child.questionParentId
                    );
                    el.childQuestions = childQuestions;
                    let meanDifficulty = 0;
                    childQuestions.map((child, i) => {
                      meanDifficulty += child.difficultyId;
                    });
                    meanDifficulty = meanDifficulty / childQuestions.length;
                    el.difficultyId = Math.round(meanDifficulty);
                  }
                  if (el.questionParentId == 0) {
                    return el;
                  }
                });

                linkedQuestionList = linkedQuestionList.filter(el => el);
                this.setState(prevState => ({
                  ...prevState,
                  questionList,
                  linkedQuestionList
                }));
              });
            }
            );
          }
        });
      }
      if (!found) {
        this.props.history.push("/personalLibrary/knowledgeGroup/0");
      }
    }
  };

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
            let childQuestions = questionList.filter(
              (child, i) => el.questionId == child.questionParentId
            );
            el.childQuestions = childQuestions;
            let meanDifficulty = 0;
            childQuestions.map((child, i) => {
              meanDifficulty += child.difficultyId;
            });
            meanDifficulty = meanDifficulty / childQuestions.length;
            el.difficultyId = Math.round(meanDifficulty);
          }
          if (el.questionParentId == 0) {
            return el;
          }
        });

        linkedQuestionList = linkedQuestionList.filter(el => el);

        this.setState(prevState => ({
          ...prevState,
          questionList,
          linkedQuestionList,
          currentFolder: {
            ...prevState.currentFolder,
            folderId: 0
          }
        }), () => {
          this.waitUpdate = false;
        }
        );
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
                  currentFolder
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
                        let childQuestions = questionList.filter(
                          (child, i) =>
                            el.questionId == child.questionParentId
                        );
                        el.childQuestions = childQuestions;
                        let meanDifficulty = 0;
                        childQuestions.map((child, i) => {
                          meanDifficulty += child.difficultyId;
                        });
                        meanDifficulty =
                          meanDifficulty / childQuestions.length;
                        el.difficultyId = Math.round(meanDifficulty);
                      }
                      if (el.questionParentId == 0) {
                        return el;
                      }
                    });

                    linkedQuestionList = linkedQuestionList.filter(
                      el => el
                    );
                    this.setState(prevState => ({
                      ...prevState,
                      questionList,
                      linkedQuestionList
                    }));
                  });
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
        this.props.history.push("/personalLibrary/knowledgeGroup/0");
      }
    });
    axios.get(serverUrl + "api/question/" + this.props.user.uid + "/" + folderId).then(res => {
      let questionList = res.data.map(question => {
        // question.content = question.content.slice(0, question.content.length - 2) + "]";
        question.content = JSON.parse(question.content);
        return question;
      });

      let linkedQuestionList = questionList.map((el, i) => {
        if (el.questionTypeId == 3) {
          let childQuestions = questionList.filter(
            (child, i) => el.questionId == child.questionParentId
          );
          el.childQuestions = childQuestions;
          let meanDifficulty = 0;
          childQuestions.map((child, i) => {
            meanDifficulty += child.difficultyId;
          });
          meanDifficulty = meanDifficulty / childQuestions.length;
          el.difficultyId = meanDifficulty;
        }
        if (el.questionParentId == 0) {
          return el;
        }
      });

      linkedQuestionList = linkedQuestionList.filter(el => el);

      this.setState({
        questionList,
        linkedQuestionList
      }, () => {
        this.waitUpdate = false;
      }
      );
    });
  }

  render() {
    return (
      <div id="knowledgeGroup" className="knowledgeGroup row">
        <ModalQuestion currentFolder={this.state.currentFolder}
          updateQuestionList={this.updateQuestionList} />
        <ModalEditQuestion currentQuestion={this.state.currentQuestion}
          updateQuestionList={this.updateQuestionList} />
        <div className="col s4 container min-height-60 knowledgeGroup-header">
          {this.state.currentFolder &&
            this.state.currentFolder.folderId != 0 ? (
              <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ paddingLeft: "10px" }}>
                {this.state.currentFolder.folderName}
                <Dropdown trigger={
                  <i className="material-icons grey-text text-darken-3">
                    more_vert
                  </i>
                }>
                  <span onClick={() => { document.getElementById("buttonImport").click() }}>Import</span>
                  {/* <ImportButton folderId={this.state.currentFolder.folderId} teacherId={this.props.user.uid} /> */}
                </Dropdown>
                <input onChange={this.onFileChange} id="buttonImport" type="file" style={{ display: "none" }} accept=".xlsx"></input>
                {/* <Button variant="outlined" color="primary" onClick={() => { document.getElementById("buttonImport").click() }}>
                  Import
        </Button> */}
              </h5>
            ) : (
              <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ paddingLeft: "10px" }}>
                Thư viện câu hỏi
            </h5>
            )}

          <p className="grey-text text-darken-3" style={{ position: "relative", top: "-15px", paddingLeft: "10px" }}>
            {this.state.linkedQuestionList &&
              this.state.linkedQuestionList.length}{" "}
            câu hỏi
          </p>
        </div>
        <div className="col s8 container ">
          <Advertisement imgSrc={HorizontalAd1} />
        </div>
        <div className="col s12 no-padding center">
          {/* <SimpleTable /> */}
          <CustomizedTable
            headCells={[
              { id: "questionCode", numeric: false, disablePadding: false, label: "Mã câu" },
              { id: "content", numeric: false, disablePadding: false, label: "Câu hỏi" },
              { id: "difficultyId", numeric: false, disablePadding: false, label: "Mức khó" },
              { id: "gradeLevelId", numeric: false, disablePadding: false, label: "Trình độ" },
              { id: "questionTypeId", numeric: false, disablePadding: false, label: "Thuộc tính" },
            ]}
            rows={this.state.linkedQuestionList}
            setCurrentQuestion={this.setCurrentQuestion}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  folder: state.folder
});

export default connect(mapStateToProps)(withRouter(KnowledgeGroup));
