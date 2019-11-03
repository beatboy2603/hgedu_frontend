import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomizedTreeView from '../../common/CustomizedTreeView';
import SimpleTable from '../../common/TempTable2';
import axios from 'axios';
import { Modal } from 'react-materialize';
import KnowledgeGroup from '../question/KnowledgeGroup';
import PersonalLibraryFiller from '../PersonalLibraryFiller';
import Quill from 'quill';
import ReactQuill from 'react-quill';
import SwitchUI from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';

class TestManagement extends Component {

    render() {
        return (
            <div className="personalLibrary row">
                {/* folder navigation bar and modals*/}
                <div className="row col s3 z-depth-2 grey lighten-4 personalLibrary-nav">
                    {/* filler */}
                    <div className="col s2"></div>
                    <div className="col s10">
                        <Link to='/personalLibrary'><h5 className="blue-text text-darken-3 bold">Kiểm tra</h5></Link>
                        <div className="line"></div>
                    </div>
                </div>
                {/* filler for navigation bar */}
                <div className="col s3 z-depth-3 grey lighten-5"></div>
                {/* main content */}
                <div className="row col s9 no-padding">
                    <div className="col s3 container min-height-60 knowledgeGroup-header">
                        <h5 className="blue-text text-darken-3 bold">D.S. kiểm tra</h5>
                    </div>
                    <div className="col s9 container z-depth-1">
                        Quảng cáo
                    </div>
                </div>
                <div>
                    <a href="#addStudent" className="btn-floating btn-large blue my-floating-btn modal-trigger">
                        <i className="material-icons">add</i>
                    </a>
                    <Modal id="addStudent" options={{ preventScrolling: true }}>
                        <div className="modal-content">
                            <h5 className="center">Thêm học sinh</h5>
                            <div className="line"></div>
                        
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

export default TestManagement;