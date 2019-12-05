import React, { Component } from 'react';
import { Link, Route, Switch, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomizedTreeView from '../common/CustomizedTreeView';
import SimpleTable from '../common/TempTable';
import { serverUrl } from "../common/common";
import axios from 'axios';
import { Modal, Button } from 'react-materialize';
import KnowledgeGroup from './question/KnowledgeGroup';
import PersonalLibraryFiller from './PersonalLibraryFiller';
import CustomizedSelect from '../common/CustomizedSelect';
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
import CustomizedTable from '../common/CustomizedTable';
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
        currentFolder: null,
        // currentFolderId: null,
        // currentFolderTypeId: null,
        // currentFolderSubGroupId: null,
        addFolderName: "",
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

    setCurrentFolder = (folder) => {
        this.setState({
            currentFolder: folder,
        })
    }

    handleFormSubmit = (e) => {
        e.preventDefault();
        if (this.state.addFolderName) {
            document.getElementById("buttonAddFolder").click();
        }
    }

    addFolder = (type) => {
        if (this.state.addFolderName) {
            let folders = this.state.folders;
            const check = folders.filter(folder => {
                return folder.folderName == this.state.addFolderName && folder.parentFolderId == this.state.currentFolder.folderId;
            })
            if (check.length != 0) {
                alert("Tên thư mục bị trùng!");
                return;
            }
            let folderTemp = {
                folderId: "temp",
                teacherId: this.props.user.uid,
                folderName: this.state.addFolderName,
                folderTypeId: type,
                parentFolderId: this.state.currentFolder.folderId,
                subGroupId: this.state.currentFolder.subGroupId,
            }
            this.setState(prevState => ({
                folders: [...prevState.folders, folderTemp]
            }))
            axios.post(serverUrl + "api/folder/addFolder", {
                teacherId: this.props.user.uid,
                folderName: this.state.addFolderName,
                folderTypeId: type,
                parentFolderId: this.state.currentFolder.folderId,
                subGroupId: this.state.currentFolder.subGroupId,
            }).then(res => {
                axios.post(serverUrl + "api/folder/getFoldersForNav", null, {
                    params: {
                        uid: this.props.user.uid
                    }
                }).then(res => {
                    let folders = Object.values(res.data)
                    this.setState({
                        folders: folders,
                        addFolderName: "",
                    })
                }).catch(function (error) {
                    // handle error
                    console.log(error);
                })
            });
        }
    }

    deleteFolder = (folderId) => {
        console.log("delete " + folderId);
        axios.post(serverUrl + "api/folder/deleteFolder", null, {
            params: {
                folderId
            }
        }).then(res => {
            axios.post(serverUrl + "api/folder/getFoldersForNav", null, {
                params: {
                    uid: this.props.user.uid
                }
            }).then(res => {
                let folders = Object.values(res.data)
                this.setState({
                    folders: folders,
                })
            }).catch(function (error) {
                // handle error
                console.log(error);
            })
        });
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
        axios.post(serverUrl + "api/folder/getFoldersForNav", null, {
            params: {
                uid: this.props.user.uid
            }
        }).then(res => {
            let folders = Object.values(res.data);
            this.setState({
                folders: folders,
            })
            // //why folderId = 0 or "0" error??
            // let folderTemp = {
            //     folderId: "temp",
            //     teacherId: 13,
            //     folderName: "dis cu luon",
            //     folderTypeId: 3,
            //     parentFolderId: 38,
            // }

            // folders.push(folderTemp);

            console.log(this.state.folders);
            // console.log(folderTemp);
        }).catch(function (error) {
            // handle error
            console.log(error);
        })
    }

    render() {
        return (
            <div className="personalLibrary row">
                {/* folder navigation bar and modals*/}
                <div className="row col s3 z-depth-2 grey lighten-4 personalLibrary-nav">
                    {/* filler */}
                    <div className="col s2"></div>
                    <div className="col s10">
                        <button onClick={() => { console.log(this.state) }}>Click me</button>
                        <Link to='/personalLibrary'><h5 className="blue-text text-darken-3 bold font-montserrat">Thư viện</h5></Link>
                        {/* modals */}
                        <div>
                            {/* modal for addFolder */}
                            <div className='inline-block'>
                                {
                                    this.state.currentFolder && this.state.currentFolder.folderTypeId == 1 && this.state.currentFolder.subGroupId != 3 ? (
                                        <a href="#addFolder" className="modal-trigger">
                                            <i className="material-icons grey-text text-darken-3">create_new_folder</i>
                                        </a>
                                    ) : (
                                            <i className="material-icons grey-text">create_new_folder</i>
                                        )
                                }
                                {/* {
                                    (!this.state.currentFolder || this.state.currentFolder.folderTypeId != 1 || this.state.currentFolder.folderTypeId == 4) &&
                                    <i className="material-icons grey-text">create_new_folder</i>
                                } */}
                                {/* actions = {[]} with no element to get rid of default "close" button */}
                                <Modal id="addFolder" options={{ preventScrolling: true }} style={{ width: "40vw", height: "45vh", overflow: "hidden", borderRadius: "25px" }} actions={[]}>
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
                                {
                                    this.state.currentFolder && this.state.currentFolder.folderTypeId == 1 ? this.state.currentFolder.subGroupId == 1 ? (
                                        <a href="#addKnowledgeGroup" className="modal-trigger">
                                            <i className="material-icons grey-text text-darken-3">note_add</i>
                                        </a>
                                    ) : this.state.currentFolder.subGroupId == 2 ? (
                                        <a href="#addTest" className="modal-trigger" onClick={() => { alert("test") }}>
                                            <i className="material-icons grey-text text-darken-3">note_add</i>
                                        </a>
                                    ) : this.state.currentFolder.subGroupId == 3 ? (
                                        <a href="#addGroup" className="modal-trigger" onClick={() => { alert("groups") }}>
                                            <i className="material-icons grey-text text-darken-3">note_add</i>
                                        </a>
                                    ) : (
                                                    <i className="material-icons grey-text">note_add</i>
                                                ) : this.state.currentFolder && this.state.currentFolder.folderTypeId == 4 ? (
                                                    <a href="#addKnowledgeGroup" className="modal-trigger">
                                                        <i className="material-icons grey-text text-darken-3">note_add</i>
                                                    </a>
                                                ) : (
                                                <i className="material-icons grey-text">note_add</i>
                                            )
                                }
                                {/* {
                                    (this.state.currentFolderId && ((this.state.currentFolderTypeId == 1 && this.state.currentFolderSubType == "knowledgeGroup") || this.state.currentFolderTypeId == 4)) &&
                                    <a href="#addKnowledgeGroup" className="modal-trigger">
                                        <i className="material-icons grey-text text-darken-3">note_add</i>
                                    </a>
                                }
                                {
                                    (this.state.currentFolderId && this.state.currentFolderTypeId == 1 && this.state.currentFolderSubType == "test") &&
                                    <a href="#addTest" className="modal-trigger" onClick={() => { alert("test") }}>
                                        <i className="material-icons grey-text text-darken-3">note_add</i>
                                    </a>
                                }
                                {
                                    (this.state.currentFolderId && this.state.currentFolderTypeId == 1 && this.state.currentFolderSubType == "groups") &&
                                    <a href="#addGroup" className="modal-trigger" onClick={() => { alert("groups") }}>
                                        <i className="material-icons grey-text text-darken-3">note_add</i>
                                    </a>
                                }
                                {(!this.state.currentFolderId || (this.state.currentFolderTypeId != 1 && this.state.currentFolderTypeId != 4)) &&
                                    <i className="material-icons grey-text">note_add</i>
                                } */}
                                <Modal id="addKnowledgeGroup" options={{ preventScrolling: true }} style={{ width: "40vw", height: "45vh", overflow: "hidden", borderRadius: "25px" }} actions={[]}>
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

                        </div>
                        <div className="line"></div>
                        <CustomizedTreeView folders={this.state.folders} setCurrentFolder={this.setCurrentFolder} deleteFolder={this.deleteFolder} handleFormSubmit={this.handleFormSubmit} addFolderName={this.state.addFolderName} addFolder={this.addFolder} handleInputChange={this.handleInputChange}/>
                    </div>
                </div>
                {/* filler for navigation bar */}
                <div className="col s3 z-depth-3 grey lighten-5"></div>
                {/* main content */}
                <div className="row col s9">
                    <Switch>
                        <Route exact path={'/personalLibrary'} component={PersonalLibraryFiller} />
                        <Route path={'/personalLibrary/knowledgeGroup/:folderId'} render={(props) => <KnowledgeGroup {...props} setQuestionFolderId={this.setQuestionFolderId} />} />
                        <Route path={'/personalLibrary/test/:folderId'} render={(props) => <ModalTest {...props} />} />
                        <Route path={'/personalLibrary/table'} render={(props) => <CustomizedTable {...props} />} />
                    </Switch>
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(withRouter(PersonalLibrary));

