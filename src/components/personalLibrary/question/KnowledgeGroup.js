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
import CustomizedMultipleSelect from "../../common/CustomizedMultipleSelect";
import { debounce } from 'lodash';

class KnowledgeGroup extends Component {
  constructor(props) {
    super(props);
    this.searchInput = React.createRef();
  }

  state = {
    currentFolder: null,
    questionList: [],
    linkedQuestionList: [],
    currentQuestion: null,
    allKnowledgeGroups: [],

    searchInput: "",

    file: "",
    error: "",
    msg: "",
  };

  focusSearch = () => {
    this.searchInput.current.focus()
  }

  handleInputChange = (src) => (e) => {
    let val = e.target.value;
    switch (src) {
      case "search":
        this.setState({
          searchInput: val,
        }, () => {
          this.filterQuestion(this.state.searchInput)
        })
        break;
    }
  }

  handleSelectChange = (source, value) => {
    if (source == "knowledgeGroups") {
      this.setState(prevState => ({
        ...prevState,
        testCriteria: {
          ...prevState.testCriteria,
          knowledgeGroups: value,
        }
      }))
    }
    if (source == "specialKnowledges") {
      this.setState(prevState => ({
        ...prevState,
        testCriteria: {
          ...prevState.testCriteria,
          specialKnowledges: value,
        }
      }))
    }
    if (source == "gradeLevelId") {
      this.setState(prevState => ({
        ...prevState,
        testCriteria: {
          ...prevState.testCriteria,
          gradeLevelId: value,
        }
      }))
    }
  }

  normalizeString = (str) => {
    str = str.toLowerCase();
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return str;
  }

  filterQuestion = debounce((rawString = "") => {
    rawString = this.normalizeString(rawString);
    let questionList = this.state.questionList.filter(el => {
      if (this.normalizeString(el.questionCode).includes(rawString)) {
        return el;
      }
      let found = false;
      el.content.ops && el.content.ops.map(el => {
        if ((el.insert && typeof el.insert === 'string' && this.normalizeString(el.insert).includes(rawString)) || (el.insert && el.insert.formula && this.normalizeString(el.insert.formula).includes(rawString))) {
          found = true;
        }
      })
      if (found) {
        return el;
      }
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
      linkedQuestionList
    }, () => {
      this.waitUpdate = false;
    });
  }, 200);

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
      });
    });
    axios.get(serverUrl + "api/folder/getAllKnowledgeGroupsId/" + this.props.user.uid).then(res => {
      const allKnowledgeGroups = res.data;
      const allKnowledgeGroupFolders = this.props.folder.folders.filter((el, i) => {
        let found = false;
        allKnowledgeGroups.map((subEl, k) => {
          if (el.folderId == subEl) {
            found = true;
          }
        })
        if (found) {
          return el;
        }
      })

      this.setState(prevState => ({
        ...prevState,
        allKnowledgeGroups: allKnowledgeGroupFolders,
      }))
    })
  }

  render() {
    return (
      <div id="knowledgeGroup" className="knowledgeGroup row">
        <ModalQuestion currentFolder={this.state.currentFolder}
          updateQuestionList={this.updateQuestionList} />
        <ModalEditQuestion currentQuestion={this.state.currentQuestion}
          updateQuestionList={this.updateQuestionList} />
        <div className="col s12 container min-height-60 knowledgeGroup-header">
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
        <div className="row col s12" style={{ borderTop: "1px solid #e0e0e0", borderBottom: "1px solid #e0e0e0", margin: "20px 0 0 0" }}>
          <div className="col s2 flex-row" >
            <i className="material-icons" style={{ padding: "15px 15px 15px 0", cursor:"pointer" }} onClick={() => { this.focusSearch() }}>search</i>
            <span style={{ cursor:"pointer" }} onClick={() => { this.focusSearch() }}>Tìm kiếm</span>
          </div>
          <div className="col s10">
            <input ref={this.searchInput} type="text" style={{ borderBottom: "none" }} value={this.state.searchInput} onChange={this.handleInputChange("search")} />
          </div>
        </div>
        <div className="row col s12 flex-row" style={{ margin: "0", backgroundColor: "white", borderBottom: "1px solid #e0e0e0" }}>
          <div className="col s1">
            {/* <i className="material-icons" style={{ padding: "15px" }}>search</i> */}
            <span className="font-montserrat" style={{ color: "#086bd1", fontSize: "16px", paddingLeft: "2px" }}>Bộ lọc</span>
          </div>
          <div className="col s2">
            <CustomizedMultipleSelect
              selectLabel={""}
              inputLabel={"Mức khó"}
              customStyle={{ maxWidth: "10vw" }}
              source="knowledgeGroups"
              handleParentSelect={this.handleSelectChange}
              items={this.state.allKnowledgeGroups.map((el, i) => {
                return { value: el.folderId, text: el.folderName }
              })} />
          </div>
          <div className="col s2">
            <CustomizedMultipleSelect
              selectLabel={""}
              inputLabel={"Thuộc tính"}
              customStyle={{ maxWidth: "10vw" }}
              source="knowledgeGroups"
              handleParentSelect={this.handleSelectChange}
              items={this.state.allKnowledgeGroups.map((el, i) => {
                return { value: el.folderId, text: el.folderName }
              })} />
          </div>
          <div className="col s2">
            <CustomizedMultipleSelect
              selectLabel={""}
              inputLabel={"Form"}
              customStyle={{ maxWidth: "10vw" }}
              source="knowledgeGroups"
              handleParentSelect={this.handleSelectChange}
              items={this.state.allKnowledgeGroups.map((el, i) => {
                return { value: el.folderId, text: el.folderName }
              })} />
          </div>
          <div className="col s2">
            <CustomizedMultipleSelect
              selectLabel={""}
              inputLabel={"Trình độ"}
              customStyle={{ maxWidth: "10vw" }}
              source="knowledgeGroups"
              handleParentSelect={this.handleSelectChange}
              items={this.state.allKnowledgeGroups.map((el, i) => {
                return { value: el.folderId, text: el.folderName }
              })} />
          </div>
          <div className="col s3">
            <CustomizedMultipleSelect
              selectLabel={""}
              inputLabel={"Kiến thức đặc thù"}
              customStyle={{ minWidth: "12vw", maxWidth: "15vw" }}
              source="knowledgeGroups"
              handleParentSelect={this.handleSelectChange}
              items={this.state.allKnowledgeGroups.map((el, i) => {
                return { value: el.folderId, text: el.folderName }
              })} />
          </div>
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
