import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomizedTreeView from '../common/CustomizedTreeView';
import SimpleTable from '../common/TempTable';
import { serverUrl } from "../common/common";
import axios from 'axios';
import { Modal, Button } from 'react-materialize';
import KnowledgeGroup from './question/KnowledgeGroup';
import PersonalLibraryFiller from './PersonalLibraryFiller';
import Quill from 'quill';
import ReactQuill from 'react-quill';
import SwitchUI from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import { makeStyles } from '@material-ui/core/styles';
import Toggle from "../common/Toggle";
import katex from 'katex';
import 'katex/dist/katex.min.css';
import Editor from "../common/Editor";
import { debounce } from 'lodash';
import ModalTest from './test/ModalTest';
window.katex = katex;


// const useStyles = makeStyles(theme => ({
//     test: {
//         width: '1000px',
//     },
// }));

class PersonalLibrary extends Component {
    question = null;
    answer = null;
    explaination = null;
    state = {
        folders: null,
        questionDetail: {
            questionCode: null,
            questionSeries: false,
            folderId: null,
            question: null,
            description: null,
            difficulty: null,
            gradeLevel: null,
            type: null,
            knowledgeGroup: null,
            specialKnowledge: null,
            explaination: null,
            questionKatex: null,
            questionImages: null,
        },
        answer1: {
            content: null,
            images: null,
            isCorrect: false,
            answerKatex: null,
            linkedAnswers: null
        },
        answer2: {
            content: null,
            images: null,
            isCorrect: false,
            answerKatex: null,
            linkedAnswers: null
        },
        answer3: {
            content: null,
            images: null,
            isCorrect: false,
            answerKatex: null,
            linkedAnswers: null
        },
        answer4: {
            content: null,
            images: null,
            isCorrect: false,
            answerKatex: null,
            linkedAnswers: null
        },
        currentFolderId: null,
        currentFolderTypeId: null,
        addFolderName: null,
        test: false,
    }

    handleToggleChange = (e) => {
        this.setState({
            questionDetail: {
                questionSeries: e.target.checked,
            },
        })
    }

    handleInputChange = (source) => (e) => {
        if (source == "folderName") {
            this.setState({
                addFolderName: e.target.value,
            })
        }
        if (source == "questionCode") {
            this.setState({
                questionDetail: {
                    questionCode: e.target.value,
                }
            })
        }
    }

    setCurrentFolderId = (folderId, folderTypeId) => {
        this.setState({
            currentFolderId: folderId,
            currentFolderTypeId: folderTypeId,
        })
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        if (this.state.addFolderName !== null && this.state.addFolderName !== "") {
            document.getElementById("buttonAddFolder").click();
        }
    }

    addFolder = (type) => {
        if (this.state.addFolderName !== null && this.state.addFolderName !== "") {
            let config = {
                api: "AddFolder",
                data: {
                    teacherId: null,
                    folderName: this.state.addFolderName,
                    folderTypeId: type,
                    parentFolderId: this.state.currentFolderId,
                }
            }
            // axiosPost(config).then(res => {
            //     var config = {
            //         api: "GetFoldersForNav",
            //         data: {},
            //     };
            //     axiosPost(config).then(res => {
            //         let folders = Object.values(JSON.parse(res.data.data))
            //         this.setState({
            //             folders: folders,
            //             addFolderName: "",
            //         })
            //     }).catch(function (error) {
            //         // handle error
            //         console.log(error);
            //     })
            // }).catch(function (error) {
            //     // handle error
            //     console.log(error);
            // })
        }
    }

    addQuestion = () => {
        this.setState(prevState => ({
            ...prevState,
            questionDetail: {
                ...prevState.questionDetail,
                question: this.question,
                explaination: this.explaination,
            }
        }))
        this.setQuestionFolderId();
        console.log(this.state);
    }

    setQuestionFolderId = (folderId) => {
        this.setState(prevState => ({
            questionDetail: {
                ...prevState.questionDetail,
                folderId
            }
        }))
    }

    componentDidMount() {
        var currentFolderId = this.props.match.params.folderId;
        this.setState({
            currentFolderId,
            folderId: currentFolderId,
        })
        var config = {
            api: "GetFoldersForNav",
            data: {},
        };

        axios.get(serverUrl+"api/folder/getFoldersForNav").then(res => {
            let folders = Object.values(res.data);
            this.setState({
                folders: folders,
            })
        }).catch(function (error) {
            // handle error
            console.log(error);
        })

        
    }

    handleQuillChange = (content, source) => {
        if (source == "question") {
            // this.setState(prevState => ({
            //     ...prevState,
            //     questionDetail: {
            //         ...prevState.questionDetail,
            //         question: content,
            //     }
            // }))
            this.question = content;
        }
        if (source == "answer") {
            this.answer = content;
        }
        if (source == "explaination") {
            this.explaination = content;
        }
        console.log(this.state);
    }

    render() {
        const lineSpacing = {
            marginTop: "25px",
        }

        return (
            <div className="personalLibrary row">
                {/* folder navigation bar and modals*/}
                <div className="row col s3 z-depth-2 grey lighten-4 personalLibrary-nav">
                    {/* filler */}
                    <div className="col s2"></div>
                    <div className="col s10">
                        <Link to='/personalLibrary'><h5 className="blue-text text-darken-3 bold font-montserrat">Thư viện</h5></Link>
                        {/* modals */}
                        <div>
                            {/* modal for addFolder */}
                            <div className='inline-block'>
                                <a href="#addFolder" className="modal-trigger">
                                    <i className="material-icons grey-text text-darken-3">create_new_folder</i>
                                </a>
                                {/* actions = {[]} with no element to get rid of default "close" button */}
                                <Modal id="addFolder" options={{ preventScrolling: true }} style={{ width: "40vw", height: "45vh", overflow: "hidden" }} actions={[]}>
                                    <div className="modal-content" style={{
                                        position: "absolute",
                                        top: "0",
                                        bottom: "0",
                                        left: "0",
                                        right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                                        overflowY: "scroll"
                                    }}>
                                        <h5 className="center">Thêm thư mục</h5>
                                        <div className="line" style={{ marginTop: "30px" }}></div>
                                        <div className="row">
                                            <form className="row col s12" onSubmit={this.handleFormSubmit}>
                                                <div className="input-field inline col s12">
                                                    <input id='folderNameInput' type="text" className="validate" onChange={this.handleInputChange("folderName")} value={this.state.addFolderName} />
                                                    <label htmlFor="folderNameInput" style={{ userSelect: "none" }}>Tên thư mục</label>
                                                </div>
                                            </form>
                                        </div>
                                        {/* <div className="line"></div> */}
                                        <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                                        <a id="buttonAddFolder" className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }} onClick={() => this.addFolder(1)}>Hoàn tất</a>
                                    </div>

                                </Modal>
                            </div>
                            {/* modal for addKnowledgeGroup */}
                            <div className='inline-block'>
                                <a href="#addKnowledgeGroup" className="modal-trigger">
                                    <i className="material-icons grey-text text-darken-3">note_add</i>
                                </a>
                                <Modal id="addKnowledgeGroup" options={{ preventScrolling: true }} style={{ width: "40vw", height: "45vh", overflow: "hidden" }} actions={[]}>
                                    <div className="modal-content" style={{
                                        position: "absolute",
                                        top: "0",
                                        bottom: "0",
                                        left: "0",
                                        right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                                        overflowY: "scroll"
                                    }}>
                                        <h5 className="center">Thêm nhóm kiến thức</h5>
                                        <div className="line" style={{ marginTop: "30px" }}></div>
                                        <div className="row">
                                            <form className="row col s12" onSubmit={this.handleFormSubmit}>
                                                <div className="input-field inline col s12">
                                                    <input id='folderNameInput' type="text" className="validate" onChange={this.handleInputChange("folderName")} value={this.state.addFolderName} />
                                                    <label htmlFor="folderNameInput" style={{ userSelect: "none" }}>Tên nhóm kiến thức</label>
                                                </div>
                                            </form>
                                        </div>
                                        <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                                        <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }} onClick={() => this.addFolder(2)}>Hoàn tất</a>
                                    </div>
                                </Modal>
                            </div>
                            {/* modal for addQuestion */}
                            <div>
                                <a href="#addQuestion" className="btn-floating btn-large blue my-floating-btn modal-trigger">
                                    <i className="material-icons" onClick={()=>{console.log(this.state)}}>add</i>
                                </a>
                                <Modal id="addQuestion" options={{ preventScrolling: true }} style={{ width: "80vw", height: "80vh", overflow: "hidden" }} actions={[]}>
                                    <div style={{ paddingTop: "52.5vh" }}></div>
                                    <div className="modal-content" style={{
                                        position: "absolute",
                                        top: "0",
                                        bottom: "0",
                                        left: "0",
                                        right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                                        overflowY: "scroll"
                                    }}>

                                        <h5 className="center">Thêm câu hỏi</h5>
                                        <div className="line" style={{ width: "96%", marginLeft: "2%", marginTop: "30px" }}></div>

                                        <div className="row">
                                            <form className="row col s12">
                                                <div className="col s12">
                                                    Mã câu hỏi<span className='red-text'>*</span>:
                                                    <div className="input-field inline" style={{ width: '30vw', marginLeft: '7vw' }}>
                                                        <input id='questionCode' type="text" className="validate" value={this.state.questionDetail.questionCode} onChange={this.handleInputChange("questionCode")} />
                                                    </div>
                                                </div>
                                                <div className="col s2">Câu hỏi<span className='red-text'>*</span>:</div>
                                                <div className="col s10">
                                                    {/* <Quill/> */}
                                                    <Editor handleQuillChange={this.handleQuillChange} quillSource="question" />
                                                </div>
                                                <div className="col s12" style={lineSpacing}>
                                                    {/* <div className="switch valign-wrapper" style={{ position: "relative", left: "-20px" }}>
                                                        <label>
                                                            <input type="checkbox" onChange={this.handleToggleChange} />
                                                            <span className="lever"></span>
                                                            <span style={{ color: "#333333", fontSize: "15px" }}>Chế độ câu hỏi chùm</span>
                                                        </label>
                                                    </div> */}
                                                    <Toggle label="Chế độ câu hỏi chùm" handleToggleChange={this.handleToggleChange} />
                                                </div>
                                                {!this.state.questionDetail.questionSeries && <div>
                                                    <div className="col s2" style={lineSpacing}>Đáp án<span className='red-text'>*</span>:</div>
                                                    <div className="col s10" style={lineSpacing}>

                                                        <Editor handleQuillChange={this.handleQuillChange} quillSource="answer" ref={(answerQuill) => { window.answerQuill = answerQuill }} />
                                                        <div className="blue" onClick={() => {
                                                            console.log(window.answerQuill.getData());
                                                        }}>shit</div>
                                                    </div>
                                                    <div className="col s2" style={lineSpacing}>Mức khó<span className='red-text'>*</span>:</div>
                                                    <div className="col s4" style={lineSpacing}>
                                                        <Select value="0">
                                                            <option value="0" disabled selected>Choose your option</option>
                                                            <option value="1">Nhận biết</option>
                                                            <option value="2">Thông hiểu</option>
                                                            <option value="3">Vận dụng</option>
                                                            <option value="4">Vận dụng cao</option>
                                                        </Select>
                                                    </div>

                                                    <div className="col s3" style={lineSpacing}>Câu hỏi cùng form:</div>
                                                    <div className="col s3" style={lineSpacing}>
                                                        <Select value="">
                                                            <option value="" disabled>Choose your option</option>
                                                            <option value="1">Option 1</option>
                                                            <option value="2">Option 2</option>
                                                            <option value="3">Option 3</option>
                                                        </Select>
                                                    </div>
                                                    <div className="col s2">Trình độ<span className='red-text'>*</span>:</div>
                                                    <div className="col s4">
                                                        <Select value="">
                                                            <option value="" disabled>Choose your option</option>
                                                            <option value="1">Option 1</option>
                                                            <option value="2">Option 2</option>
                                                            <option value="3">Option 3</option>
                                                        </Select>
                                                    </div>
                                                    <div className="col s3">Mô tả:</div>
                                                    <div className="col s3">
                                                        <Select value="">
                                                            <option value="" disabled>Choose your option</option>
                                                            <option value="1">Option 1</option>
                                                            <option value="2">Option 2</option>
                                                            <option value="3">Option 3</option>
                                                        </Select>
                                                    </div>
                                                    <div className="col s2">Thuộc tính<span className='red-text'>*</span>:</div>
                                                    <div className="col s4">
                                                        <Select value="">
                                                            <option value="" disabled>Choose your option</option>
                                                            <option value="1">Option 1</option>
                                                            <option value="2">Option 2</option>
                                                            <option value="3">Option 3</option>
                                                        </Select>
                                                    </div>
                                                    <div className="col s3">Kiến thức đặc thù:</div>
                                                    <div className="col s3">
                                                        <Select value="">
                                                            <option value="" disabled>Choose your option</option>
                                                            <option value="1">Option 1</option>
                                                            <option value="2">Option 2</option>
                                                            <option value="3">Option 3</option>
                                                        </Select>
                                                    </div>
                                                    <div className="col s2" style={lineSpacing}>Hướng dẫn giải<span className='red-text'>*</span>:</div>
                                                    <div className="col s10" style={lineSpacing}>
                                                        {/* <Quill/> */}
                                                        <Editor handleQuillChange={this.handleQuillChange} quillSource="explaination" />
                                                    </div>
                                                </div>}

                                            </form>
                                        </div>
                                        <div className="line" style={{ width: "96%", marginLeft: "2%", marginBottom: "30px" }}></div>
                                        <a className="modal-action modal-close black-text lighten-1" style={{ margin: "0 1.5vw", float: "left" }}>Hủy thao tác</a>
                                        <a className="modal-action modal-close blue-text lighten-1" style={{ margin: "0 1.5vw", float: "right" }} onClick={this.addQuestion}>Hoàn tất</a>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                        <div className="line"></div>
                        <CustomizedTreeView folders={this.state.folders} setCurrentFolderId={this.setCurrentFolderId} />
                    </div>
                </div>
                {/* filler for navigation bar */}
                <div className="col s3 z-depth-3 grey lighten-5"></div>
                {/* main content */}
                <div className="row col s9 no-padding">
                    <Switch>
                        <Route exact path={'/personalLibrary'} component={PersonalLibraryFiller} />
                        <Route path={'/personalLibrary/knowledgeGroup/:folderId'} render={(props) => <KnowledgeGroup {...props} setQuestionFolderId={this.setQuestionFolderId} />} />
                        <Route path={'/personalLibrary/test/:folderId'} render={(props) => <ModalTest {...props}/>} />
                    </Switch>
                </div>

            </div>
        )
    }
}

export default PersonalLibrary;

