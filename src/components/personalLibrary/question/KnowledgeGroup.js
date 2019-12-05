import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomizedTreeView from '../../common/CustomizedTreeView';
import SimpleTable from '../../common/TempTable';
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
            if (currentFolder !== this.state.currentFolder) {
                this.setState({
                    currentFolder,
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
    }

    render() {
        return (
            <div className="knowledgeGroup row">
                <button onClick={() => { console.log(this.state) }}>Click me</button>
                <ModalQuestion currentFolder={this.state.currentFolder} />
                <div className="col s3 container min-height-60 knowledgeGroup-header" >
                    <h5 className="blue-text text-darken-3 bold font-montserrat" style={{ paddingLeft: "10px" }}>Vô Cơ  <i className="material-icons grey-text text-darken-3">more_vert</i></h5>
                    <p className='grey-text text-darken-3' style={{ position: "relative", top: "-15px", paddingLeft: "10px" }}>04 câu hỏi</p>
                </div>
                <div className="col s9 container z-depth-1">
                    Quảng cáo
                </div>
                <div className="col s12 no-padding center">
                    <SimpleTable />
                </div>

            </div>
        )
    }
}

export default KnowledgeGroup;