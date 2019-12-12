import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomizedTreeView from '../../common/CustomizedTreeView';
import SimpleTable from '../../common/TempTable';
import CustomizedTable from './CustomizedTable';
import axios from 'axios';
import { Modal, Dropdown } from 'react-materialize';
import ModalQuestion from './ModalQuestion';
import { serverUrl } from '../../common/common'


class KnowledgeGroup extends Component {

    state = {
        currentFolder: null,
        questionList: [],
        linkedQuestionList: [],
    }

    waitUpdate = false;

    componentDidUpdate() {
        let folderId = this.props.match.params.folderId;
        if (this.state.currentFolder && folderId !== this.state.currentFolder.folderId && !this.waitUpdate) {

            // axios.get(serverUrl + "api/folder/" + folderId).then(res => {
            //     let currentFolder = res.data;
            //     if (currentFolder!== this.state.currentFolder) {
            //         this.setState({
            //             currentFolder,
            //         }, () => {
            //             this.waitUpdate = false;
            //             axios.get(serverUrl + "api/question/" + this.props.user.uid + "/" + folderId).then(res => {
            //                 let questionList = res.data.map(question => {
            //                     question.content = question.content.slice(0, question.content.length - 2) + "]";
            //                     question.content = JSON.parse(question.content);
            //                     return question;
            //                 });
            //                 this.setState(prevState => ({
            //                     ...prevState,
            //                     questionList,
            //                 }))
            //             })
            //         })
            //     }else{
            //         this.waitUpdate = false;
            //     }
            // })
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
                                    this.setState(prevState => ({
                                        ...prevState,
                                        questionList,
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
            
            let linkedQuestionList = questionList.map((el,i)=>{
                if(el.questionTypeId==3){
                    let childQuestions = questionList.filter((child, i)=>el.questionId==child.questionParentId);
                    el.childQuestions = childQuestions;
                }
                if(el.questionParentId==0){
                    return el;
                }
            })

            linkedQuestionList = linkedQuestionList.filter(el=>el);
            console.log(linkedQuestionList);
            this.setState({
                questionList,
                linkedQuestionList,
            })
        })
    }

    render() {
        return (
            <div id="knowledgeGroup" className="knowledgeGroup row">
                <button onClick={() => { console.log(this.state) }}>Click me</button>
                <ModalQuestion currentFolder={this.state.currentFolder} />
                <div className="col s3 container min-height-60 knowledgeGroup-header" >
                    <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ paddingLeft: "10px" }}>{this.state.currentFolder && this.state.currentFolder.folderName}
                        <Dropdown
                            trigger={<i className="material-icons grey-text text-darken-3">more_vert</i>}
                        >
                            <span onClick={() => { alert("Import") }}>Import</span>
                        </Dropdown>
                    </h5>
                    <p className='grey-text text-darken-3' style={{ position: "relative", top: "-15px", paddingLeft: "10px" }}>{this.state.questionList.length} câu hỏi</p>
                </div>
                <div className="col s9 container z-depth-1">
                    Quảng cáo
                </div>
                <div className="col s12 no-padding center">
                    {/* <SimpleTable /> */}
                    <CustomizedTable headCells={[
                        { id: 'questionCode', numeric: false, disablePadding: false, label: 'Mã câu' },
                        { id: 'content', numeric: false, disablePadding: false, label: 'Câu hỏi' },
                        { id: 'difficultyId', numeric: false, disablePadding: false, label: 'Mức khó' },
                        { id: 'gradeLevelId', numeric: false, disablePadding: false, label: 'Trình độ' },
                        { id: 'questionTypeId', numeric: false, disablePadding: false, label: 'Thuộc tính' },
                    ]} rows={this.state.linkedQuestionList} />
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