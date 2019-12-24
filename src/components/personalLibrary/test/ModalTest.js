import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Collapsible, CollapsibleItem } from 'react-materialize';
import CustomizedSlider from '../../common/CustomizedSlider';
import Divider from '@material-ui/core/Divider';
import CustomizedModalTreeView from './CustomizedModalTreeView';
import CustomizedModalTable from './CustomizedModalTable';
import axios from 'axios';
import { serverUrl } from '../../common/common';

class ModalTest extends Component {

    state = {
        folders: [],
        questionFolders: [],
        testFolders: [],
        currentFolder: null, //current folder of tree in personalLibrary
        currentModalFolder: null, //current folder of tree in modal
        modalQuestionList: [],
        modalLinkedQuestionList: [],

        allKnowledgeGroups: [],

        //common
        testDetail: {
            testCode: "",
            teacherId: 0,
            folderId: 0,
            title: "",
            noOfTests: "",
            noOfPermutations: "",
        },

        //custom
        testQuestionList: [],
        testQuality: {
            noOfQuestions: 0,
            testCoverage: "-",
            meanDifficulty: 0,
            typeRatio: "-:-",
            difficultyDistribution: "-:-:-:-",
        },
        customValid: false,

        //auto

        testCriteria: {
            difficultiesAuto: ["0", "0", "0", "0"],
            meanDifficulty: 0,
            noOfQuestions: 0,
            questionTypes: ["0", "0"],
        },
        difficultyWidth: ["0%", "0%", "0%", "0%"],
        meanDifficultyColor: "#9e9e9e",
        questionTypeWidth: ["0%", "0%"],
    }

    //C1: not recommended?
    // componentWillReceiveProps({ currentFolder }) {
    //     this.setState({ currentFolder })
    // }

    //C2:
    static getDerivedStateFromProps(props, state) {
        if (props.currentFolder !== state.currentFolder) {
            return { currentFolder: props.currentFolder };
        }
        return null;
    }

    handleInputChange = (source, e) => {
        const value = e.target.value;
        if (source == "testCode") {
            this.setState(prevState => ({
                testDetail: {
                    ...prevState.testDetail,
                    testCode: value,
                }
            }))
        }
        if (source == "title") {
            this.setState(prevState => ({
                testDetail: {
                    ...prevState.testDetail,
                    title: value,
                }
            }))
        }
        if (source == "noOfTests") {
            this.setState(prevState => ({
                testDetail: {
                    ...prevState.testDetail,
                    noOfTests: value,
                }
            }))
        }
        if (source == "noOfPermutations") {
            this.setState(prevState => ({
                testDetail: {
                    ...prevState.testDetail,
                    noOfPermutations: value,
                }
            }))
        }
        if (source == "difficulty1") {
            let difficultiesAuto = this.state.testCriteria.difficultiesAuto.map((el, i) => {
                if (i == 0) {
                    el = value;
                }
                return el;
            })
            this.setState(prevState => ({
                ...prevState,
                testCriteria: {
                    ...prevState.testCriteria,
                    difficultiesAuto,
                }
            }), () => { this.updateTestCriteria() })
        }
        if (source == "difficulty2") {
            let difficultiesAuto = this.state.testCriteria.difficultiesAuto.map((el, i) => {
                if (i == 1) {
                    el = value;
                }
                return el;
            })
            this.setState(prevState => ({
                ...prevState,
                testCriteria: {
                    ...prevState.testCriteria,
                    difficultiesAuto,
                }
            }), () => { this.updateTestCriteria() })
        }
        if (source == "difficulty3") {
            let difficultiesAuto = this.state.testCriteria.difficultiesAuto.map((el, i) => {
                if (i == 2) {
                    el = value;
                }
                return el;
            })
            this.setState(prevState => ({
                ...prevState,
                testCriteria: {
                    ...prevState.testCriteria,
                    difficultiesAuto,
                }
            }), () => { this.updateTestCriteria() })
        }
        if (source == "difficulty4") {
            let difficultiesAuto = this.state.testCriteria.difficultiesAuto.map((el, i) => {
                if (i == 3) {
                    el = value;
                }
                return el;
            })
            this.setState(prevState => ({
                ...prevState,
                testCriteria: {
                    ...prevState.testCriteria,
                    difficultiesAuto,
                }
            }), () => { this.updateTestCriteria() })
        }
        if (source == "questionType1") {
            let questionTypes = this.state.testCriteria.questionTypes.map((el, i) => {
                if (i == 0) {
                    el = value;
                }
                return el;
            })
            this.setState(prevState => ({
                ...prevState,
                testCriteria: {
                    ...prevState.testCriteria,
                    questionTypes,
                }
            }), () => { this.updateQuestionTypes(1) })
        }
        if (source == "questionType2") {
            let questionTypes = this.state.testCriteria.questionTypes.map((el, i) => {
                if (i == 1) {
                    el = value;
                }
                return el;
            })
            this.setState(prevState => ({
                ...prevState,
                testCriteria: {
                    ...prevState.testCriteria,
                    questionTypes,
                }
            }), () => { this.updateQuestionTypes(2) })
        }
    }

    //for Auto
    updateTestCriteria = () => {
        let error = false;
        let difficultiesAuto = this.state.testCriteria.difficultiesAuto.map((el, i) => {
            let parsedInt = parseInt(el);

            if ((parsedInt != 0 && !parsedInt) || parsedInt < 0 || parsedInt > 99) {
                error = true;
            }
            return parsedInt;
        })
        if (error) {
            return;
        }
        let noOfQuestions = 0;
        let meanDifficulty = 0;
        difficultiesAuto.map((el, i) => {
            noOfQuestions += el;
            meanDifficulty += (i + 1) * el;
        })
        if (noOfQuestions != 0) {
            meanDifficulty = meanDifficulty / noOfQuestions;
            meanDifficulty = meanDifficulty.toFixed(2);
        } else {
            meanDifficulty = 0;
        }
        let difficultyWidth = this.state.difficultyWidth.map((el, i) => {
            if (noOfQuestions == 0) {
                return "0%";
            } else {
                return (this.state.testCriteria.difficultiesAuto[i] / noOfQuestions) * 100 + "%";
            }
        })
        let meanDifficultyColor = "#9e9e9e"
        if (meanDifficulty >= 1 && meanDifficulty <= 1.75) {
            meanDifficultyColor = "#28d55c";
        } else if (meanDifficulty <= 2.5) {
            meanDifficultyColor = "#eb992d";
        } else if (meanDifficulty <= 3.25) {
            meanDifficultyColor = "#832adb";
        } else if (meanDifficulty <= 4) {
            meanDifficultyColor = "#f61c6e";
        }
        this.setState(prevState => ({
            ...prevState,
            testCriteria: {
                ...prevState.testCriteria,
                noOfQuestions,
                meanDifficulty,
                questionTypes: ["0", "0"],
            },
            difficultyWidth,
            meanDifficultyColor
        }), () => {
            this.updateQuestionTypes(1);
        })
    }

    updateQuestionTypes = (type) => {
        let error = false;
        let questionTypes = this.state.testCriteria.questionTypes.map((el, i) => {
            let parsedInt = parseInt(el);

            if ((parsedInt != 0 && !parsedInt) || parsedInt < 0 || parsedInt > this.state.testCriteria.noOfQuestions) {
                error = true;
            }
            return parsedInt;
        })
        if (error) {
            return;
        }
        let type1 = 0; let type2 = 0;
        if (this.state.testCriteria.noOfQuestions != 0) {
            if (type == 1) {
                type1 = questionTypes[0];
                type2 = this.state.testCriteria.noOfQuestions - type1;
            } else {
                type2 = questionTypes[1];
                type1 = this.state.testCriteria.noOfQuestions - type2;
            }
        } else {
            return;
        }
        let questionTypeWidth = [(type1 / this.state.testCriteria.noOfQuestions) * 100 + "%", (type2 / this.state.testCriteria.noOfQuestions) * 100 + "%"]

        this.setState(prevState => ({
            ...prevState,
            testCriteria: {
                ...prevState.testCriteria,
                questionTypes: [type1 + "", type2 + ""],
            },
            questionTypeWidth,
        }))
    }

    addQuestionToTest = (question) => {
        let testQuestionList = this.state.testQuestionList.filter((el, i) => {
            return el.questionId != question.questionId
        })
        if (testQuestionList.length == this.state.testQuestionList.length) {
            this.setState(prevState => ({
                ...prevState,
                testQuestionList: [...prevState.testQuestionList, question],
            }), () => {
                this.updateTestQuality();
            })
        } else {
            this.setState(prevState => ({
                ...prevState,
                testQuestionList,
            }), () => {
                this.updateTestQuality();
            });
        }

    }

    //for Custom
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
        this.state.testQuestionList.map((el, i) => {
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

    checkCustomValid = () => {
        let customValid = true;
        if (!this.state.testDetail.testCode || !this.state.testDetail.testCode.trim()) {
            customValid = false;
        }
        if (!this.state.testDetail.title || !this.state.testDetail.title.trim()) {
            customValid = false;
        }
        if (this.state.testQuestionList.length <= 0) {
            customValid = false;
        }
        if (this.props.folder && this.props.folder.folders) {
            let hasSameTestCode = false;
            this.props.folder.folders.map((subEl, j) => {
                if ((this.state.testDetail.testCode.trim() == subEl.folderName && this.state.currentFolder.folderId == subEl.parentFolderId) || (subEl.folderTypeId == 3 && this.state.testDetail.testCode.trim() == subEl.folderName)) {
                    hasSameTestCode = true;
                }
            })
            if (hasSameTestCode) {
                customValid = false;
            }
        }
        this.setState({
            customValid
        })
        return customValid;
    }

    addCustomTest = () => {
        let testFolder = {
            teacherId: this.props.user.uid,
            folderName: this.state.testDetail.testCode,
            folderTypeId: 3,
            parentFolderId: this.state.currentFolder.folderId,
            subGroupId: 2,
        }
        //folderId lay sau khi axios add testFolder
        let test = this.state.testDetail;
        test.teacherId = this.props.user.uid;
        test.permutatedFrom = -1;
        test.isPublic = 0;
        console.log("testFolder", testFolder);
        console.log("test", test);
        console.log("testQuestionList", this.state.testQuestionList);
        let childQuestions = [];
        this.state.testQuestionList.map((el, i) => {
            if (el.childQuestions) {
                el.childQuestions.map((subEl, k) => {
                    childQuestions.push(subEl);
                })
            }
        });
        let testQuestionList = [...this.state.testQuestionList, ...childQuestions];
        testQuestionList = testQuestionList.map((el, i) => {
            el.testQuestionIdentity = {
                testId: 0,
                questionId: el.questionId,
            }
            return el;
        });
        let testContentPlaceholder = {
            testFolder,
            test,
            testQuestionList
        }
        console.log(testContentPlaceholder);
        axios.post(serverUrl + "api/test/addTest", testContentPlaceholder).then(res => {
            console.log(res);
            if (this.props.updateTreeFolder) {
                this.props.updateTreeFolder();
            }
        })
    }

    waitUpdate = false;

    setCurrentModalFolder = (e, folder, source) => {
        // e.stopPropagation();
        // this.waitUpdate = true;
        this.setState({
            currentModalFolder: folder,
        }, () => {
            if (source == "question") {
                if (this.state.currentModalFolder && this.state.currentModalFolder.folderId) {
                    // if (this.props.folder.folders) {
                    // this.waitUpdate = true;
                    // this.props.folder.folders.map((el, index) => {
                    //     if (el.folderId == this.state.currentFolder.folderId) {
                    // let currentFolder = el;
                    // if (currentFolder !== this.state.currentFolder) {
                    //     this.setState({
                    //         currentFolder,
                    //     }, () => {

                    axios.get(serverUrl + "api/question/" + this.props.user.uid + "/" + this.state.currentModalFolder.folderId).then(res => {
                        let modalQuestionList = res.data.map(question => {
                            question.content = JSON.parse(question.content);
                            return question;
                        });
                        let modalLinkedQuestionList = modalQuestionList.map((el, i) => {
                            if (el.questionTypeId == 3) {
                                let childQuestions = modalQuestionList.filter((child, i) => el.questionId == child.questionParentId);
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

                        modalLinkedQuestionList = modalLinkedQuestionList.filter(el => el);
                        this.setState(prevState => ({
                            ...prevState,
                            modalQuestionList,
                            modalLinkedQuestionList,
                        }))
                    })
                    // })
                    // } else {
                    //     this.waitUpdate = false;
                    // }
                    //     }
                    // })
                    // }
                }
            }
        })
    }

    componentDidMount() {
        setTimeout(() => {
            if (this.props.folder.folders) {
                console.log("modaltest nani")
                let questionFolders = this.props.folder.folders.filter((el, i) => {
                    return el.subGroupId == 1;
                })
                let testFolders = this.props.folder.folders.filter((el, i) => {
                    return el.subGroupId == 2;
                })
                this.setState({
                    folders: this.props.folder.folders,
                    questionFolders,
                    testFolders,
                })
            }
        }, 1000);
        axios.get(serverUrl + "api/folder/getAllKnowledgeGroupsId/" + this.props.user.uid).then(res => {
            const allKnowledgeGroups = res.data;
            this.setState(prevState => ({
                ...prevState,
                allKnowledgeGroups,
            }))
        })
    }

    resetState = () => {
        this.setState(prevState => ({
            ...prevState,
            currentModalFolder: null, //current folder of tree in modal
            modalQuestionList: [],
            modalLinkedQuestionList: [],

            //common
            testDetail: {
                testCode: "",
                teacherId: 0,
                folderId: 0,
                title: "",
                noOfTests: "",
                noOfPermutations: "",
            },

            //custom
            testQuestionList: [],
            testQuality: {
                noOfQuestions: 0,
                testCoverage: "-",
                meanDifficulty: 0,
                typeRatio: "-:-",
                difficultyDistribution: "-:-:-:-",
            },
            customValid: false,

            //auto

            testCriteria: {
                difficultiesAuto: ["0", "0", "0", "0"],
                meanDifficulty: 0,
                noOfQuestions: 0,
                questionTypes: ["0", "0"],
            },
            difficultyWidth: ["0%", "0%", "0%", "0%"],
            meanDifficultyColor: "#9e9e9e",
            questionTypeWidth: ["0%", "0%"],
        }))
    }

    render() {
        return (
            <div>
                <button onClick={() => { console.log(this.state) }}>click me</button>
                <div style={{ zIndex: "100" }}>
                    {/* <a href="#addTest" className="btn-floating btn-large blue modal-trigger">
                        <i className="material-icons" onClick={() => { console.log(this.state) }}>add</i>
                    </a> */}
                    {/* Modal to pick Auto and Custom generation */}
                    <Modal id="addTest" options={{ preventScrolling: true }} style={{ width: "60vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>

                            <h5 className="center">Chọn phương pháp xây dựng bộ đề</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>

                            <div className="row" >
                                <div className="row col s6 container">
                                    <div href="#autoGen" className="modal-action modal-close col s11 grey lighten-4 valign-wrapper modal-trigger" style={{ height: "30vh", borderRadius: "10px" }}>
                                        <i className="material-icons medium blue-text text-darken-3" style={{ margin: "20px" }}>near_me</i>
                                        <div className="flex-column" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                                            <h6 className="blue-text text-darken-3 font-montserrat">Tự động</h6>
                                            <p style={{ fontSize: "12px" }}>Tự động soạn đề trên cơ sở theo tiêu chí, yêu cầu của bạn như: độ khó, độ bao quát, tỉ lệ phân phối kiến thức, ...</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="row col s6 container center">
                                    <div className="col s1"></div>
                                    <div href="#customGen" className="modal-action modal-close col s11 grey lighten-4 valign-wrapper modal-trigger" style={{ height: "30vh", borderRadius: "10px" }}>
                                        <i className="material-icons medium blue-text text-darken-3" style={{ margin: "20px" }}>touch_app</i>
                                        <div className="flex-column" style={{ paddingTop: "20px", paddingBottom: "20px" }}>
                                            <h6 className="blue-text text-darken-3 font-montserrat">Thủ công</h6>
                                            <p style={{ fontSize: "12px" }}>Tự chọn câu hỏi theo ý của bạn,
                                            tiêu chuẩn của đề thi sẽ được tính tự động liên tục mỗi khi thêm câu hỏi</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                        </div>
                    </Modal>


                    {/* Modal to for Custom generation */}
                    <Modal id="customGen" options={{ preventScrolling: true }} style={{ width: "70vw", height: "80vh", maxHeight: "80vh", overflow: "hidden" }} actions={[]}
                        onClick={() => { this.checkCustomValid() }}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Thêm đề thi bằng phương pháp thủ công</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>

                            <div className="row">
                                <form className="row col s12">
                                    <div className="col s12">
                                        <p className="blue-text lighten-3">Thông tin cơ bản</p>
                                    </div>
                                    <div className="col s12">
                                        Mã đề thi<span className='red-text'>*</span>:
                                        <div className="input-field inline" style={{ width: '10vw', margin: '0 0 0 5vw' }}>
                                            <input id='testCode' type="text" className="validate" value={this.state.testDetail.testCode} onChange={(e) => { this.handleInputChange("testCode", e) }} />
                                        </div>
                                    </div>
                                    <div className="col s12">
                                        Tên đề thi<span className='red-text'>*</span>:
                                        <div className="input-field inline" style={{ width: '30vw', margin: '0 0 0 5vw' }}>
                                            <input id='testName' type="text" className="validate" value={this.state.testDetail.title} onChange={(e) => { this.handleInputChange("title", e) }} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <div className="row">
                                {/* <div className="col s3">
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
                                </div> */}
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

                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>

                            <div className="row">
                                <div className='col s12'>
                                    <p className="blue-text lighten-3">Soạn câu hỏi</p>
                                </div>
                                {/* <Collapsible className="z-depth-0" style={{ border: "none" }}>
                                    <CollapsibleItem header="Danh sách câu hỏi" icon={<i className="material-icons">code</i>}> */}
                                <div className="row" style={{ marginBottom: "0" }}>
                                    <div className="row col s3">
                                        <p className="blue-text lighten-3">Thư viện câu hỏi</p>
                                        <CustomizedModalTreeView folders={this.state.questionFolders} setCurrentFolder={this.setCurrentModalFolder} source={"question"} />
                                    </div>

                                    <div className="row col s9" style={{ height: "100%", borderLeft: "2px solid #BDBDBD" }}>
                                        <div className='col s12'>
                                            <h5 className="blue-text text-darken-3 font-montserrat">{this.state.currentModalFolder && this.state.currentModalFolder.folderName}</h5>
                                            <CustomizedModalTable
                                                headCells={[
                                                    { id: 'padding', numeric: false, disablePadding: false, label: '' },
                                                    { id: 'questionCode', numeric: false, disablePadding: false, label: 'Mã câu' },
                                                    { id: 'content', numeric: false, disablePadding: false, label: 'Câu hỏi' },
                                                ]}
                                                rows={this.state.modalLinkedQuestionList}
                                                addQuestionToTest={this.addQuestionToTest}
                                                testQuestionList={this.state.testQuestionList} />
                                        </div>
                                    </div>
                                </div>
                                {/* </CollapsibleItem>
                                    <CollapsibleItem header="Loại trừ câu hỏi trong đề thi khác" icon={<i className="material-icons">code</i>}>
                                        <table>
                                            <thead className="blue-text text-darken-3 font-montserrat">
                                                <tr>
                                                    <th>Đề thi</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <th>
                                                        <a href="#testFilter" className="black-text lighten-1 modal-trigger">+ Thêm đề loại trừ</a>
                                                    </th>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </CollapsibleItem>
                                </Collapsible> */}
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            {this.state.customValid &&
                                <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }} onClick={() => { this.addCustomTest() }}>Hoàn tất</a>
                            }
                            <a href="#addTest" className="modal-action modal-close black-text lighten-1 modal-trigger" style={{ margin: "0 1.5vw", float: "right" }}>Quay lại</a>
                        </div>
                    </Modal>


                    {/* Modal to for Auto generation */}
                    <Modal id="autoGen" options={{ preventScrolling: true }} style={{ width: "70vw", height: "80vh", maxHeight: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Thêm đề thi bằng phương pháp tự động</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>

                            <div className="row">
                                <form className="row col s12">
                                    <div className="col s12">
                                        <p className="blue-text lighten-3">Thông tin cơ bản</p>
                                    </div>
                                    <div className="col s12">
                                        Mã đề thi<span className='red-text'>*</span>:
                                        <div className="input-field inline" style={{ width: '10vw', margin: '0 0 0 5vw' }}>
                                            <input id='testCode' type="text" className="validate" value={this.state.testDetail.testCode} onChange={(e) => { this.handleInputChange("testCode", e) }} />
                                        </div>
                                    </div>
                                    <div className="col s12">
                                        Tên đề thi<span className='red-text'>*</span>:
                                        <div className="input-field inline" style={{ width: '30vw', margin: '0 0 0 5vw' }}>
                                            <input id='testName' type="text" className="validate" value={this.state.testDetail.title} onChange={(e) => { this.handleInputChange("title", e) }} />
                                        </div>
                                    </div>
                                    <div className="col s12">
                                        Số lượng đề:
                                        <div className="input-field inline" style={{ width: '10vw', margin: '0 0 0 5vw' }}>
                                            <input id='noOfTests' type="number" className="validate" value={this.state.testDetail.noOfTests} onChange={(e) => { this.handleInputChange("noOfTests", e) }} />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <div className="row">
                                <div className="col s12">
                                    <p className="blue-text lighten-3">Soạn câu hỏi</p>
                                </div>
                                <div className="col s12">
                                    <Collapsible className="z-depth-0" style={{ border: "none" }}>
                                        <CollapsibleItem header="Tiêu chí đề" icon={<i className="material-icons">code</i>}>
                                            <div className="row">
                                                <div className="col s12">
                                                    <h3 className="blue-text darken-4 font-montserrat center">{this.state.testCriteria && this.state.testCriteria.noOfQuestions}</h3>
                                                    <p className="center">Tổng số câu hỏi</p>
                                                </div>
                                                <div className="col s12">
                                                    <p className="blue-text lighten-3">Phân phối mức khó</p>
                                                </div>
                                                <div className="col s12">
                                                    <h3 className="font-montserrat center" style={{ color: this.state.meanDifficultyColor }}>{this.state.testCriteria && this.state.testCriteria.meanDifficulty}</h3>
                                                    <p className="center">Độ khó trung bình</p>
                                                </div>
                                                <div className="col s12 z-depth-1" style={{ width: "100%", height: "10px", borderRadius: "5px", border: "1px solid grey", padding: "0" }}>
                                                    <div style={{ width: this.state.difficultyWidth[0], height: "10px", backgroundColor: "#28d55c", borderRadius: "5px", display: "inline-block", position: "relative", top: "-5px" }}></div>
                                                    <div style={{ width: this.state.difficultyWidth[1], height: "10px", backgroundColor: "#eb992d", borderRadius: "5px", display: "inline-block", position: "relative", top: "-5px" }}></div>
                                                    <div style={{ width: this.state.difficultyWidth[2], height: "10px", backgroundColor: "#832adb", borderRadius: "5px", display: "inline-block", position: "relative", top: "-5px" }}></div>
                                                    <div style={{ width: this.state.difficultyWidth[3], height: "10px", backgroundColor: "#f61c6e", borderRadius: "5px", display: "inline-block", position: "relative", top: "-5px" }}></div>
                                                </div>
                                                <div className="col s3 center">
                                                    <div className="input-field inline" style={{ width: '100px', margin: "15px 0 0 0" }}>
                                                        <input type="number" className="validate font-montserrat" style={{ fontSize: "50px", color: "#28d55c", textAlign: "center" }} onChange={(e) => this.handleInputChange("difficulty1", e)} value={this.state.testCriteria.difficultiesAuto[0]} min="0" max="99" step="1" />
                                                        <span class="helper-text" data-error="*Số nguyên 0-99"></span>
                                                    </div>
                                                    <br />
                                                    <span>Nhận biết</span>
                                                </div>
                                                <div className="col s3 center">
                                                    <div className="input-field inline" style={{ width: '100px', margin: "15px 0 0 0" }}>

                                                        <input type="number" className="validate font-montserrat" style={{ fontSize: "50px", color: "#eb992d", textAlign: "center" }} onChange={(e) => this.handleInputChange("difficulty2", e)} value={this.state.testCriteria.difficultiesAuto[1]} min="0" max="99" step="1" />
                                                        <span class="helper-text" data-error="*Số nguyên 0-99"></span>
                                                    </div>
                                                    <br />
                                                    <span>Thông hiểu</span>
                                                </div>
                                                <div className="col s3 center">
                                                    <div className="input-field inline" style={{ width: '100px', margin: "15px 0 0 0" }}>

                                                        <input type="number" className="validate font-montserrat" style={{ fontSize: "50px", color: "#832adb", textAlign: "center" }} onChange={(e) => this.handleInputChange("difficulty3", e)} value={this.state.testCriteria.difficultiesAuto[2]} min="0" max="99" step="1" />
                                                        <span class="helper-text" data-error="*Số nguyên 0-99"></span>
                                                    </div>
                                                    <br />
                                                    <span>Vận dụng</span>
                                                </div>
                                                <div className="col s3 center">
                                                    <div className="input-field inline" style={{ width: '100px', margin: "15px 0 0 0" }}>

                                                        <input type="number" className="validate font-montserrat" style={{ fontSize: "50px", color: "#f61c6e", textAlign: "center" }} onChange={(e) => this.handleInputChange("difficulty4", e)} value={this.state.testCriteria.difficultiesAuto[3]} min="0" max="99" step="1" />
                                                        <span class="helper-text" data-error="*Số nguyên 0-99"></span>
                                                    </div>
                                                    <br />
                                                    <span>Vận dụng cao</span>
                                                </div>
                                                <div className="col s12">
                                                    <p className="blue-text lighten-3">Thuộc tính</p>
                                                </div>
                                                <div className="col s12 z-depth-1" style={{ width: "100%", height: "10px", borderRadius: "5px", border: "1px solid grey", padding: "0" }}>
                                                    <div style={{ width: this.state.questionTypeWidth[0], height: "10px", backgroundColor: "#0de6c2", borderRadius: "5px", display: "inline-block", position: "relative", top: "-5px" }}></div>
                                                    <div style={{ width: this.state.questionTypeWidth[1], height: "10px", backgroundColor: "#efe11e", borderRadius: "5px", display: "inline-block", position: "relative", top: "-5px" }}></div>
                                                </div>
                                                <div className="col s3"></div>
                                                <div className="col s3 center">
                                                    <div className="input-field inline" style={{ width: '100px', margin: "15px 0 0 0" }}>

                                                        <input type="number" className="validate font-montserrat" style={{ fontSize: "50px", color: "#0de6c2", textAlign: "center" }} onChange={(e) => this.handleInputChange("questionType1", e)} value={this.state.testCriteria.questionTypes[0]} min="0" max={this.state.testCriteria.noOfQuestions} step="1" />
                                                        <span class="helper-text" data-error={"*Số nguyên 0-" + this.state.testCriteria.noOfQuestions}></span>
                                                    </div>
                                                    <br />
                                                    <span>Lý thuyết</span>
                                                </div>
                                                <div className="col s3 center">
                                                    <div className="input-field inline" style={{ width: '100px', margin: "15px 0 0 0" }}>

                                                        <input type="number" className="validate font-montserrat" style={{ fontSize: "50px", color: "#efe11e", textAlign: "center" }} onChange={(e) => this.handleInputChange("questionType2", e)} value={this.state.testCriteria.questionTypes[1]} min="0" max={this.state.testCriteria.noOfQuestions} step="1" />
                                                        <span class="helper-text" data-error={"*Số nguyên 0-" + this.state.testCriteria.noOfQuestions}></span>
                                                    </div>
                                                    <br />
                                                    <span>Bài tập</span>
                                                </div>
                                                <div className="col s3"></div>
                                            </div>
                                        </CollapsibleItem>
                                        <CollapsibleItem header="Nhóm câu hỏi tự chọn" icon={<i className="material-icons">code</i>}>
                                            <table>
                                                <thead className="blue-text text-darken-3 font-montserrat">
                                                    <tr>
                                                        <th>Nhóm</th>
                                                        <th>Số lượng</th>
                                                        <th>Phân chia trên một đề</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            <a href="#certainListPick" className="black-text lighten-1 modal-trigger">+ Thêm nhóm chia</a>
                                                        </th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </CollapsibleItem>
                                        {/* <CollapsibleItem header="Loại trừ câu hỏi trong đề thi khác" icon={<i className="material-icons">code</i>}>
                                            <table>
                                                <thead className="blue-text text-darken-3 font-montserrat">
                                                    <tr>
                                                        <th>Đề thi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            <a href="#testFilter" className="black-text lighten-1 modal-trigger">+ Thêm đề loại trừ</a>
                                                        </th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </CollapsibleItem> */}
                                    </Collapsible>
                                </div>
                            </div>
                            {/* <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <div className="row">
                                <form className="row col s12">
                                    <div className="col s12">
                                        <p className="blue-text lighten-3">Số đề cùng tiêu chí/Biến thể</p>
                                    </div>
                                    <div className="col s12">
                                        Số lượng đề:
                                        <div className="input-field inline" style={{ width: '10vw', margin: '0 0 0 5vw' }}>
                                            <input id='noOfTests' type="number" className="validate" value={this.state.testDetail.noOfTests} onChange={(e) => { this.handleInputChange("noOfTests", e) }} />
                                        </div>
                                    </div>
                                    <div className="col s12">
                                        Số biến thể:
                                        <div className="input-field inline" style={{ width: '10vw', margin: '0 0 0 5vw' }}>
                                            <input id='noOfPermutations' type="number" className="validate" value={this.state.testDetail.noOfPermutations} onChange={(e) => { this.handleInputChange("noOfPermutations", e) }} />
                                        </div>
                                    </div>
                                    
                                </form>
                            </div> */}
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }}>Hoàn tất</a>
                            <a href="#addTest" className="modal-action modal-close black-text lighten-1 modal-trigger" style={{ margin: "0 1.5vw", float: "right" }}>Quay lại</a>
                        </div>
                    </Modal>


                    <Modal id="certainListPick" options={{ preventScrolling: true }} style={{ width: "70vw", height: "80vh", maxHeight: "80vh", overflow: "hidden" }} actions={[]}
                        onClick={() => { this.checkCustomValid() }}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Nhóm câu hỏi tự chọn</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                            <div className="row">
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

                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>

                            <div className="row">
                                <div className="row" style={{ marginBottom: "0" }}>
                                    <div className="row col s3">
                                        <p className="blue-text lighten-3">Thư viện câu hỏi</p>
                                        <CustomizedModalTreeView folders={this.state.questionFolders} setCurrentFolder={this.setCurrentModalFolder} source={"question"} />
                                    </div>

                                    <div className="row col s9" style={{ height: "100%", borderLeft: "2px solid #BDBDBD" }}>
                                        <div className='col s12'>
                                            <h5 className="blue-text text-darken-3 font-montserrat">{this.state.currentModalFolder && this.state.currentModalFolder.folderName}</h5>
                                            <CustomizedModalTable
                                                headCells={[
                                                    { id: 'padding', numeric: false, disablePadding: false, label: '' },
                                                    { id: 'questionCode', numeric: false, disablePadding: false, label: 'Mã câu' },
                                                    { id: 'content', numeric: false, disablePadding: false, label: 'Câu hỏi' },
                                                ]}
                                                rows={this.state.modalLinkedQuestionList}
                                                addQuestionToTest={this.addQuestionToTest}
                                                testQuestionList={this.state.testQuestionList} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            {this.state.customValid &&
                                <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }} onClick={() => { this.addCustomTest() }}>Hoàn tất</a>
                            }
                            <a href="#addTest" className="modal-action modal-close black-text lighten-1 modal-trigger" style={{ margin: "0 1.5vw", float: "right" }}>Quay lại</a>
                        </div>
                    </Modal>
                </div>
            </div >
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
    folder: state.folder,
})

export default connect(mapStateToProps)(withRouter(ModalTest));
