import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomizedTreeView from '../../common/CustomizedTreeView';
import SimpleTable from '../../common/TempTable';
import CustomizedTable from './CustomizedTable';
import axios from 'axios';
import { Modal } from 'react-materialize';
import ModalQuestion from './ModalQuestion';
import { serverUrl } from '../../common/common'

class KnowledgeGroup extends Component {

    state = {
        currentFolder: null,
        questionList: [],
    }

    componentDidUpdate() {
        let folderId = this.props.match.params.folderId;
        axios.get(serverUrl + "api/folder/" + folderId).then(res => {
            let currentFolder = res.data;
            if (currentFolder.folderId !== this.state.currentFolder.folderId) {
                this.setState({
                    currentFolder,
                }, ()=>{
                    axios.get(serverUrl + "api/question/" + this.props.user.uid + "/" + folderId).then(res => {
                        let questionList = res.data.map(question => {
                            question.content = question.content.slice(0, question.content.length - 2) + "]";
                            question.content = JSON.parse(question.content);
                            return question;
                        });
                        console.log(res);
                        console.log(questionList);
                        this.setState(prevState=>({
                            ...prevState,
                            questionList,
                            isChanged: false,
                        }))
                    })
                })
            }
        })

    }

    componentDidMount() {
        // let { setQuestionFolderId } = this.props;
        // // this.setState({
        // //     currentFolder,
        // // })
        // setQuestionFolderId(this.props.match.params.folderId);
        let folderId = this.props.match.params.folderId;
        axios.get(serverUrl + "api/folder/" + folderId).then(res => {
            // console.log(res);
            this.setState({
                currentFolder: res.data,
            })
        })
        axios.get(serverUrl + "api/question/" + this.props.user.uid + "/" + folderId).then(res => {
            let questionList = res.data.map(question => {
                question.content = question.content.slice(0, question.content.length - 2) + "]";
                question.content = JSON.parse(question.content);
                return question;
            });
            console.log(res);
            console.log(questionList);
            // questionList.forEach(question=>{
            //     question.content = question.content.slice(0,question.content.length-2)+"]";
            //     question.content = JSON.parse(question.content)
            // })
            this.setState({
                questionList
            })
        })
    }

    render() {
        return (
            <div id="knowledgeGroup" className="knowledgeGroup row">
                <button onClick={() => { console.log(this.state) }}>Click me</button>
                <ModalQuestion currentFolder={this.state.currentFolder}/>
                <div className="col s3 container min-height-60 knowledgeGroup-header" >
                    <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ paddingLeft: "10px" }}>{this.state.currentFolder && this.state.currentFolder.folderName}  <i className="material-icons grey-text text-darken-3">more_vert</i></h5>
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
                    ]} rows={this.state.questionList} />
                </div>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(withRouter(KnowledgeGroup));