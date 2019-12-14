import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomizedTreeView from './common/CustomizedTreeView';
import SimpleTable from './common/TempTable2';
import axios from 'axios';
import { Modal } from 'react-materialize';
import { Button } from '@material-ui/core'
import KnowledgeGroup from './personalLibrary/question/KnowledgeGroup';
import PersonalLibraryFiller from './personalLibrary/PersonalLibraryFiller';
import Quill from 'quill';
import ReactQuill from 'react-quill';
import SwitchUI from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import { serverUrl } from './common/common'
class StudentManagement extends Component {
    state = {
        student: [],
        sss: [],
        displayName: {}
    }

    style = {
        countBadge: {
            backgroundColor: '#ff3838',
            borderRadius: '50%',
            top: '0%',
            left: '83%',
            transform: 'translate(-75%,-50%)',
            height: '16px',
            width: '16px',
            lineHeight: '18px',
            position: 'absolute',
            textAlign: 'center',
            verticalAlign: 'middle',
            color: '#fff',
            textAlign: 'center',
        },

        column: {
            padding: 'unset',
            marginBottom: '10px'
        }

        // table: {
        //     fontSize: '16px',
        //     marginBottom: '10px',
        //     tr: {
        //         border: 'none',

        //     },
        //     th: {
        //         padding: '5px 0',
        //     },
        //     td: {
        //         paddingTop: '5px',
        //         paddingBottom: '5px'
        //     }
        // }
    }

    componentDidMount() {
        axios.get(serverUrl + 'api/enrollment/request/studentInfo/' + this.props.user.uid)
            .then(res => {
                this.setState({
                    student: res.data,
                })
            });
        axios.get(serverUrl + "api/enrollment/request/studentInfo/note/" + this.props.user.uid)
            .then(res => {
                this.setState({
                    note: res.data,
                    sss: res.data
                })

            })
    }
    acceptRequest = (teacherId, studentId, studentName) => {
        if (this.state.displayName["student" + studentId]) {
            axios.post(serverUrl + "api/enrollment/request/studentInfo/requestHandle", {
                status: "accept",
                teacherId: teacherId,
                studentId: studentId,
                displayName: this.state.displayName["student" + studentId]
            })
        }
        else {
            axios.post(serverUrl + "api/enrollment/request/studentInfo/requestHandle", {
                status: "accept",
                teacherId: teacherId,
                studentId: studentId,
                displayName: studentName
            })
        }
    }

    refuseRequest = (teacherId, studentId) =>{
        axios.post(serverUrl+ "/api/enrollment/student/studentInfo/requestHandle",
        {
            status:"refuse",
            teacherId: teacherId,
            studentId: studentId
        })
    }


    displayStudentName = (e) => {
        this.setState({
            displayName: {
                ...this.state.displayName,
                [e.target.name]: e.target.value
            },
        })
        console.log(this.state.displayName)
    }

    setStudentDisplayedName = (e, id) => {

        if (this.state.sss[id]) {
            const { sss } = this.state;
            sss[id] = e.target.value;
            this.setState({
                sss
            })
        }
        console.log(this.state.student)
    }
    render() {
        const countStudent = () => {
            if (this.state.student.length > 0) {
                return (
                    <span style={this.style.countBadge}>{this.state.student.length}</span>
                )
            }
        }

        const loadStudentInfo = () => {
            if (this.state.student.length > 0) {
                let student = this.state.student;
                let merge = student.map((newStudent) => {
                    let note = this.state.note;
                    newStudent["note"] = note[student.indexOf(newStudent)];
                    return newStudent;
                });
                const load = merge.map((studentInfo, index) => {
                    return (
                        <div>
                            <div className="line" style={{ marginBottom: '20px' }}></div>
                            <div className='col s12 row'>
                                <div className='col s12' style={this.style.column}>
                                    <div className="col s5">Tên học sinh: </div>
                                    <div className="col s7">{studentInfo.fullName}</div>
                                </div>
                                <div className='col s12' style={this.style.column}>
                                    <div className="col s5">Email: </div>
                                    <div className="col s7">{studentInfo.email}</div>
                                </div>
                                <div className='col s12' style={this.style.column}>
                                    <div className="col s5">Ngày sinh: </div>
                                    <div className="col s7">{studentInfo.dob}</div>
                                </div>
                                <div className='col s12' style={this.style.column}>
                                    <div className="col s5">Giới tính: </div>
                                    <div className="col s7">{studentInfo.gender ? "Nam" : "Nữ"}</div>
                                </div>
                                <div className='col s12' style={this.style.column}>
                                    <div className="col s5">Ghi chú: </div>
                                    <div className="col s7">{studentInfo.note}</div>
                                </div>
                                <div className='col s12' style={this.style.column}>
                                    <div className="col s5">Tên hiển thị: </div>
                                    <div className="col s7"><input type="text" placeholder="Điền tên hiển thị" style={{ height: '25px', fontFamily: 'iCiel Effra' }} name={"student" + studentInfo.userId} onChange={this.displayStudentName} /></div>
                                </div>
                                <div className='col s12' style={this.style.column}>
                                    <Link style={{ alignSelf: 'flex-end', color: '#f44336', fontSize: '18px', paddingLeft: '11.25px' }} onClick={(e) => { console.log(this.props.user.uid) }}>Từ chối</Link>
                                    <Link style={{ float: "right", fontSize: '18px', paddingRight: '11.25px' }} onClick={(e) => { this.acceptRequest(this.props.user.uid, studentInfo.userId, studentInfo.fullName) }}>Xác nhận</Link>
                                </div>
                            </div>
                        </div>

                    )
                })
                return (
                    <div>
                        {load}
                    </div>
                );
            }
            else {
                return (
                    <p>Bạn không có yêu cầu nào</p>
                )
            }
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
                        <div style={{ position: 'relative' }}>
                            <h5 className="blue-text text-darken-3 bold font-montserrat modal-trigger" style={{ cursor: "pointer" }} href='#student-request-modal'>D.S. học sinh</h5>
                            {countStudent()}
                        </div>
                        <Modal id="student-request-modal" options={{ preventScrolling: true }} style={{ height: "80vh", width: '37vw', overflow: "hidden", borderRadius: "25px", maxHeight: '90%' }} actions={[]}>
                            <div className="modal-content" style={{
                                position: "absolute",
                                top: "0",
                                bottom: "0",
                                left: "0",
                                right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                                overflowY: "scroll"
                            }}>
                                <h5 className="center" style={{ marginBottom: "30px" }}>Danh sách học sinh đăng kí vào lớp</h5>
                                {loadStudentInfo()}

                            </div>
                        </Modal>
                        <p className='grey-text text-darken-1'>08 học sinh</p>
                    </div>
                    <div className="col s9 container z-depth-1">
                        Quảng cáo
                    </div>
                    <div className="col s12 no-padding center">
                        <SimpleTable />
                    </div>
                </div>
                <div>
                    <a href="#addStudent" style={{ position: 'relative' }} className="btn-floating btn-large blue my-floating-btn modal-trigger">
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
const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(StudentManagement);

