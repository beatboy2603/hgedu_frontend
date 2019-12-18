import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Modal, Collapsible, CollapsibleItem } from 'react-materialize';
import CustomizedSlider from '../../common/CustomizedSlider';
import Divider from '@material-ui/core/Divider';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedTable from './CustomizedTable';
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

        testDetail: {
            testCode: "",
            teacherId: 0,
            folderId: 0,
            title: "",
            noOfTests: "",
            noOfPermutations: "",
        },
        testQuestionList: [],
        testQuality: {
            noOfQuestions: 0,
            testCoverage: "-",
            meanDifficulty: 0,
            typeRatio: "-:-",
            difficultyDistribution: "-:-:-:-",
        },
        customValid: false,
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
                if ((this.state.testDetail.testCode.trim() == subEl.folderName && this.state.currentFolder.folderId==subEl.parentFolderId)||(subEl.folderTypeId==3&&this.state.testDetail.testCode.trim() == subEl.folderName)) {
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

    addCustomTest = ()=>{
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
        this.state.testQuestionList.map((el, i)=>{
            if(el.childQuestions){
                el.childQuestions.map((subEl, k)=>{
                    childQuestions.push(subEl);
                })
            }
        });
        let testQuestionList = [...this.state.testQuestionList, ...childQuestions];
        testQuestionList = testQuestionList.map((el, i)=>{
            el.testQuestionIdentity = {
                testId: 0,
                questionId: el.questionId,
            }
            return el;
        });
        let testContentPlaceholder ={
            testFolder,
            test,
            testQuestionList
        }
        console.log(testContentPlaceholder);
        axios.post(serverUrl+"api/test/addTest", testContentPlaceholder).then(res=>{
            console.log(res);
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
                console.log("nani")
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
                questionDetail: {
                    ...prevState.questionDetail,
                    folderId: res.data.folderId,
                }
            }))
        })
    }

    render() {
        return (
            <div>
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
                    <Modal id="customGen" options={{ preventScrolling: true }} style={{ width: "60vw", height: "80vh", maxHeight: "80vh", overflow: "hidden" }} actions={[]}
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
                                <div className='col s12'>
                                    <p className="blue-text lighten-3">Chất lượng đề</p>
                                </div>
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
                                <Collapsible className="z-depth-0" style={{ border: "none" }}>
                                    <CollapsibleItem header="Danh sách câu hỏi" icon={<i className="material-icons">code</i>}>
                                        <div className="row" style={{ marginBottom: "0" }}>
                                            <div className="row col s4">
                                                <p className="blue-text lighten-3">Thư viện câu hỏi</p>
                                                <CustomizedTreeView folders={this.state.questionFolders} setCurrentFolder={this.setCurrentModalFolder} source={"question"} />
                                            </div>

                                            <div className="row col s8" style={{ height: "100%", borderLeft: "2px solid #BDBDBD" }}>
                                                <div className='col s12'>
                                                    <h5 className="blue-text text-darken-3 font-montserrat">{this.state.currentModalFolder && this.state.currentModalFolder.folderName}</h5>
                                                    <CustomizedTable
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
                                    </CollapsibleItem>
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
                                </Collapsible>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            {this.state.customValid &&
                                <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }} onClick={()=>{this.addCustomTest()}}>Hoàn tất</a>
                            }
                            <a href="#addTest" className="modal-action modal-close black-text lighten-1 modal-trigger" style={{ margin: "0 1.5vw", float: "right" }}>Quay lại</a>
                        </div>
                    </Modal>


                    {/* Modal to for Auto generation */}
                    <Modal id="autoGen" options={{ preventScrolling: true }} style={{ width: "60vw", height: "80vh", overflow: "hidden" }} actions={[]}>
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
                                            <input id='testCode' type="text" className="validate" />
                                        </div>
                                    </div>
                                    <div className="col s12">
                                        Tên đề thi<span className='red-text'>*</span>:
                                        <div className="input-field inline" style={{ width: '30vw', margin: '0 0 0 5vw' }}>
                                            <input id='testName' type="text" className="validate" />
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
                                    <h3 className="blue-text darken-4 font-montserrat center">0</h3>
                                    <p className="center">Tổng số câu hỏi</p>
                                </div>

                                <div className="col s12">
                                    <Collapsible className="z-depth-0" style={{ border: "none" }}>
                                        <CollapsibleItem header="Phân phối nhóm chia theo mảng kiến thức" icon={<i className="material-icons">code</i>}>
                                            <table>
                                                <thead className="blue-text text-darken-3 font-montserrat">
                                                    <tr>
                                                        <th>Mảng kiến thức</th>
                                                        <th>Mức khó</th>
                                                        <th>Thuộc tính</th>
                                                        <th>Kiến thức đặc thù</th>
                                                        <th>Số câu hỏi</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            <a href="#knowledgeGroupFilter" className="black-text lighten-1 modal-trigger">+ Thêm mảng kiến thức</a>
                                                        </th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </CollapsibleItem>
                                        <CollapsibleItem header="Phân phối nhóm chia ngoài mảng kiến thức" icon={<i className="material-icons">code</i>}>
                                            <table>
                                                <thead className="blue-text text-darken-3 font-montserrat">
                                                    <tr>
                                                        <th>Nhóm</th>
                                                        <th>Số lượng</th>
                                                        <th>Ghi chú</th>
                                                        <th>Phân chia trên một đề</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <th>
                                                            <a href="#nonKnowledgeGroupFilter" className="black-text lighten-1 modal-trigger">+ Thêm nhóm chia (tối đa 5)</a>
                                                        </th>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </CollapsibleItem>
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
                                    </Collapsible>
                                </div>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <div className="row">
                                <form className="row col s12">
                                    <div className="col s12">
                                        <p className="blue-text lighten-3">Số đề cùng tiêu chí/Biến thể</p>
                                    </div>
                                    <div className="col s12">
                                        Số lượng đề:
                                        <div className="input-field inline" style={{ width: '5vw', margin: '0 0 0 5vw' }}>
                                            <input id='noOfTests' type="text" className="validate" />
                                        </div>
                                    </div>
                                    <div className="col s12">
                                        Số biến thể:
                                        <div className="input-field inline" style={{ width: '5vw', margin: '0 0 0 5vw' }}>
                                            <input id='noOfPermutations' type="text" className="validate" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }}>Hoàn tất</a>
                            <a href="#addTest" className="modal-action modal-close black-text lighten-1 modal-trigger" style={{ margin: "0 1.5vw", float: "right" }}>Quay lại</a>
                        </div>
                    </Modal>

                    <Modal id="knowledgeGroupFilter" options={{ preventScrolling: true }} style={{ width: "40vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Chọn mảng kiến thức</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                            <div className="row">
                                <div className='col s12'>
                                    <p className="blue-text lighten-3">Thư viện câu hỏi</p>
                                </div>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            <a href="#knowledgeGroupCustomize" className="modal-action modal-close blue-text lighten-1 modal-trigger" style={{ margin: "0 1.5vw", float: "right" }}>Tiếp theo</a>
                        </div>
                    </Modal>
                    <Modal id="knowledgeGroupCustomize" options={{ preventScrolling: true }} style={{ width: "60vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Cấu hình nhóm chia mảng kiến thức</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                            <div className="row" style={{ marginBottom: "0" }}>
                                <div className="row col s4" style={{ height: "100%", borderRight: "2px solid #BDBDBD" }}>
                                    <div className="col s12 valign-wrapper">
                                        <i className="material-icons blue-text text-darken-3 small" style={{ margin: "10px" }}>description</i>
                                        <h5 className="blue-text text-darken-3">Phản ứng hóa học</h5>
                                    </div>
                                    <div className="col s12" style={{ marginTop: "10px", marginBottom: "10px" }}>
                                        <h3 className="blue-text text-darken-2 font-montserrat center">32</h3>
                                        <p className="center">Tổng số câu hỏi</p>
                                    </div>
                                    <div className="col s12" style={{ marginTop: "10px", marginBottom: "10px" }}>
                                        <h3 className="green-text text-darken-2 font-montserrat center">1:1</h3>
                                        <p className="center">Lý thuyết:Bài tập</p>
                                    </div>
                                    <div className="col s12" style={{ marginTop: "10px", marginBottom: "10px" }}>
                                        <h3 className="orange-text text-darken-2 font-montserrat center">64%</h3>
                                        <p className="center">Độ toàn diện</p>
                                    </div>
                                </div>
                                <div className="row col s8">
                                    <div className="col s1"></div>
                                    <div className='col s10'>
                                        <p className="blue-text lighten-3">Độ khó</p>
                                        <CustomizedSlider />
                                    </div>
                                    <div className="col s1"></div>
                                    <div className="line col s12" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                                    <div className="col s1"></div>
                                    <div className='col s10'>
                                        <p className="blue-text lighten-3">Thuộc tính</p>
                                    </div>
                                    <div className="col s1"></div>
                                    <div className="line col s12" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                                    <div className="col s1"></div>
                                    <div className='col s10'>
                                        <p className="blue-text lighten-3">Kiến thức đặc thù</p>
                                    </div>
                                    <div className="col s1"></div>
                                </div>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }}>Tạo mảng</a>
                            <a href="#knowledgeGroupFilter" className="modal-action modal-close black-text lighten-1 modal-trigger" style={{ margin: "0 1.5vw", float: "right" }}>Quay lại</a>
                        </div>
                    </Modal>
                    <Modal id="nonKnowledgeGroupFilter" options={{ preventScrolling: true }} style={{ width: "60vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Cấu hình nhóm chia ngoài mảng kiến thức</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                            <div className="row">
                                <div className="col s12">
                                    <p className="blue-text lighten-3">Bộ lọc</p>
                                </div>
                                <div className="row col s10">
                                    <div className="col s3">
                                        <p>Thuộc tính:</p>
                                    </div>
                                    <div className="col s3">
                                        <p>Độ khó:</p>
                                    </div>
                                    <div className="col s6">
                                        <p>Kiến thức đặc thù:</p>
                                    </div>
                                </div>
                                <div className="col s2">
                                    <h3 className="blue-text text-darken-2 font-montserrat center">25</h3>
                                    <p className="center">Tổng số câu hỏi</p>
                                </div>
                                <div className="col s12">
                                    <p className="blue-text lighten-3">Chọn câu hỏi</p>
                                </div>
                            </div>
                            <div className="row" style={{ marginBottom: "0" }}>
                                <div className="row col s4" style={{ height: "100%", borderRight: "2px solid #BDBDBD" }}>
                                    <p className="blue-text lighten-3">Thư viện câu hỏi</p>
                                </div>
                                <div className="row col s8" style={{ height: "100%", borderLeft: "2px solid #BDBDBD" }}>
                                    <div className='col s12'>
                                        <h5 className="blue-text text-darken-3 font-montserrat">Phản ứng hóa học</h5>
                                        <table>
                                            <thead className="blue-text text-darken-3 font-montserrat">
                                                <tr>
                                                    <th></th>
                                                    <th>Mã câu</th>
                                                    <th>Câu hỏi</th>
                                                </tr>
                                            </thead>
                                        </table>
                                    </div>

                                </div>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                            <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }}>Tạo nhóm chia</a>
                        </div>
                    </Modal>
                    <Modal id="testFilter" options={{ preventScrolling: true }} style={{ width: "40vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                        <div style={{ paddingTop: "52.5vh" }}></div>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            <h5 className="center">Chọn đề cần loại trừ</h5>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>
                            <div className="row">
                                <div className='col s12'>
                                    <p className="blue-text lighten-3">Thư viện đề thi</p>
                                </div>
                            </div>
                            <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                            <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
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
