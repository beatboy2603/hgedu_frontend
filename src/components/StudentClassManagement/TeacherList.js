import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomizedTreeView from '../common/CustomizedTreeView';
import StudentCustomizedTable from './StudentCustomizedTable';
import axios from 'axios';
import { Modal } from 'react-materialize';
import { serverUrl } from '../common/common'
import KnowledgeGroup from '../personalLibrary/question/KnowledgeGroup';
import PersonalLibraryFiller from '../personalLibrary/PersonalLibraryFiller';
import Quill from 'quill';
import ReactQuill from 'react-quill';
import SwitchUI from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
class StudentManagement extends Component {
    state = {
        error: 'Bạn chưa nhập email hay định dạng gì đó',
        teacherEmail: '',
        note: '',
        valid: false
    }

    fillInput = (e) => {
        if (e.target.name === "email") {
            this.setState({
                teacherEmail: e.target.value
            }, () => { this.validateEmail() });
        }
        else {
            this.setState({
                [e.target.name]: e.target.value,
            })
        }
    }

    validateEmail = () => {
        var vnf_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var email = this.state.email;
        if (email) {
            if (vnf_regex.test(email) == false) {
                this.setState({
                    error: "Email của bạn không đúng định dạng!",
                    valid: false
                });
                return;
            }
        } else {
            this.setState({
                error: "Email không được để trống!",
                valid: false
            })
            return;
        }
        this.setState({
            valid: true
        })
    }

    submitRequest = () => {
        axios.post(serverUrl + "api/enrollment/request",
            {
                teacherEmail: this.state.teacherEmail,
                note: this.state.note,
                studentEmail: this.props.user.email,
            }).then(res => {
                this.setState({
                    responseMessage: res.data
                })
                console.log(this.state.responseMessage)
            })
    }

    render() {
        const showResponseMsg = () => {
            if (this.state.responseMessage) {
                if (this.state.responseMessage.error) {
                    return (
                        <div className="col 12" style = {{borderRadius:'12px', border:'1px solid #FE3433', backgroundColor:'#FFEEEE', padding:'10px 0 10px 10px'}}>
                        <span style={{ color: '#f44336'}}>{this.state.responseMessage.error}</span>
                        </div>
                    )
                }
                if(this.state.responseMessage.success){
                    return (
                        <div className="col 12" style = {{borderRadius:'12px', border:'1px solid #6ABF5A', backgroundColor:'#CCEBC9', padding:'10px 0 10px 10px'}}>
                        <span style={{ color: '#2F7211'}}>{this.state.responseMessage.success}</span>
                        </div>
                    )
                }
            }
            
        }

        const confirmationButton = () => {
            return (
                <Link className="float-right" onClick={this.submitRequest}>Xác nhận</Link>
            )
        }
        return (
            <div className="personalLibrary row">
                {/* folder navigation bar and modals*/}
                <div className="row col s3 z-depth-2 grey lighten-4 personalLibrary-nav">
                    {/* filler */}
                    <div className="col s2"></div>
                    <div className="col s10">
                        <Link to='/personalLibrary'><h5 className="blue-text text-darken-3 bold font-montserrat">Học sinh</h5></Link>
                        {/* modals */}
                        <div>
                            {/* modal for addFolder */}
                            <div className='inline-block'>
                                <a href="#addFolder" className="modal-trigger">
                                    <i className="material-icons grey-text text-darken-3">create_new_folder</i>
                                </a>
                                <Modal id="addFolder" options={{ preventScrolling: true }}>
                                    <div className="modal-content">
                                        <h5 className="center">Thêm thư mục</h5>
                                        <div className="line"></div>
                                        <div className="row">
                                            <form className="row col s12">
                                                <div className="input-field inline col s12">
                                                    <input id='folderNameInput' type="text" className="validate" />
                                                    <label htmlFor="folderNameInput">Tên thư mục</label>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </Modal>
                            </div>
                        </div>
                        <div className="line"></div>
                    </div>
                </div>
                {/* filler for navigation bar */}
                <div className="col s3 z-depth-3 grey lighten-5"></div>
                {/* main content */}
                <div className="row col s9 no-padding">
                    <div className="col s3 container min-height-60 knowledgeGroup-header">
                        <h5 className="blue-text text-darken-3 bold font-montserrat">D.S. học sinh</h5>
                        <p className='grey-text text-darken-1'>08 học sinh</p>
                    </div>
                    <div className="col s9 container z-depth-1">
                        Quảng cáo
                    </div>
                    <div className="col s12 no-padding center">
                        <StudentCustomizedTable
                            headCells={[
                                { id: 'name', numeric: false, disablePadding: false, label: 'Dessert (100g serving)' },
                                { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
                                { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
                                { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
                                { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
                            ]}
                            rows={[
                                { name: 'Carbon', calories: 111, fat: 123, carbs: 544, protein: 789 },
                                { name: 'Calcium', calories: 111, fat: 145, carbs: 341, protein: 576 },
                                { name: 'Calories', calories: 121, fat: 193, carbs: 654, protein: 467 },
                            ]} />

                    </div>

                </div>
                <div>
                    <a href="#studentRequest" className="btn-floating btn-large blue my-floating-btn modal-trigger">
                        <i className="material-icons">add</i>
                    </a>
                    <Modal id="studentRequest" options={{ preventScrolling: true }} style={{ height: "75vh", overflow: "hidden", borderRadius: "25px" }} actions={[]}>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            {showResponseMsg()}
                            <h5 className="center">Đăng ký vào lớp</h5>
                            <div className="line"></div>
                            <label name='label-email' style={{ fontSize: '20px', color: '#000' }} htmlFor="">Email giáo viên: </label>
                            <input pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$" className="validate" type="tel" name="email" id="studentMail" required onChange={this.fillInput} />
                            <span className='helper-text' data-error={this.state.error}></span>
                            <div className="note col s12">
                                <label name='label-email' style={{ fontSize: '20px', color: '#000' }} htmlFor="">Ghi chú: </label>
                                <textarea name='note' style={{ resize: 'none', minHeight: '100px', marginTop: '20px' }} onChange={this.fillInput}></textarea>
                            </div>
                            <div style={{ marginBottom: '40px' }}>
                            </div>
                                <span style={{ float: 'left' }} className="modal-action modal-close">Hủy thao tác</span>
                                {confirmationButton()}
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(StudentManagement);