import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomizedTreeView from '../../common/CustomizedTreeView';
import SimpleTable from '../../common/TempTable';
import axios from 'axios';
import { Modal } from 'react-materialize';

class KnowledgeGroup extends Component {

    componentDidMount() {
        let { setQuestionFolderId } = this.props;
        setQuestionFolderId(this.props.match.params.folderId);
    }

    render() {
        return (
            <div className="knowledgeGroup row">
                <div className="col s3 container min-height-60 knowledgeGroup-header">
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