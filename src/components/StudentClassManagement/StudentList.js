import React, { Component } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import CustomizedTreeView from '../common/CustomizedTreeView';
import SimpleTable from './TeacherCustomizedTable';
import axios from 'axios';
import { Modal } from 'react-materialize';
import { Button } from '@material-ui/core'
import KnowledgeGroup from '../personalLibrary/question/KnowledgeGroup';
import PersonalLibraryFiller from '../personalLibrary/PersonalLibraryFiller';
import Quill from 'quill';
import ReactQuill from 'react-quill';
import SwitchUI from '@material-ui/core/Switch';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Select from '@material-ui/core/Select';
import { serverUrl } from '../common/common'
class StudentManagement extends Component {
    state = {
        studentList: [],
        student: [],
        sss: [],
        displayName: {},
        error: "Email không được để trống",
        studentEmail: '',
        setDisplay: '',
        valid: false

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

    loadData = () => {
        axios.get(serverUrl + 'api/enrollment/teacher/studentInfo/' + this.props.user.uid)
            .then(res => {
                this.setState({
                    student: res.data,
                })
            });
        axios.get(serverUrl + "api/enrollment/teacher/studentInfo/note/" + this.props.user.uid)
            .then(res => {
                this.setState({
                    note: res.data,
                    sss: res.data
                })
            })
        axios.get(serverUrl + "api/enrollment/teacher/studentList/" + this.props.user.uid)
            .then(res => {
                let studentList = [];
                res.data.map((el, i) => {
                    let students = {
                        index: i + 1,
                        studentId: el[0],
                        displayedName: el[1],
                        email: el[2],
                        phoneNumber: el[3],
                        gender: el[4],
                        dob: el[5],
                    }
                    studentList.push(students)
                })
                this.setState({
                    studentList
                })
                console.log(this.state.studentList)
            })
    }

    componentDidMount() {
        this.loadData();
    }
    acceptRequest = (teacherId, studentId, studentName, index) => {
        if (this.state.displayName["student" + studentId]) {
            axios.post(serverUrl + "api/enrollment/teacher/studentInfo/requestHandle", {
                status: "accept",
                teacherId: teacherId,
                studentId: studentId,
                displayName: this.state.displayName["student" + studentId]
            }, ()=>{
                this.loadData();
            })
            this.state.student.splice(index, 1)
        }
        else {
            axios.post(serverUrl + "api/enrollment/teacher/studentInfo/requestHandle", {
                status: "accept",
                teacherId: teacherId,
                studentId: studentId,
                displayName: studentName
            }, ()=>{
                this.loadData();
            })
            this.state.student.splice(index, 1)
        }
    }

    refuseRequest = (teacherId, studentId, index) => {
        axios.post(serverUrl + "api/enrollment/teacher/studentInfo/requestHandle",
            {
                status: "refuse",
                teacherId: teacherId,
                studentId: studentId
            })
        this.state.student.splice(index, 1)
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

    fillInput = (e) => {
        if (e.target.name === "studentEmail") {
            this.setState({
                studentEmail: e.target.value
            }, () => { this.validateEmail(this.state.studentEmail) });
        }
        else {
            console.log(e.target.name);
            this.setState({
                [e.target.name]: e.target.value,
            })
        }
    }

    validateEmail = (email) => {
        var vnf_regex = /^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$/;
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

    sendRequest = () => {
        if (this.state.studentEmail && !this.state.setDisplay.trim() == "") {
            axios.post(serverUrl + "api/enrollment/teacher/request", {
                studentEmail: this.state.studentEmail,
                teacherEmail: this.props.user.email,
                displayedName: this.state.setDisplay.trim()
            })
        } else {
            axios.post(serverUrl + "api/enrollment/teacher/request", {
                studentEmail: this.state.studentEmail,
                teacherEmail: this.props.user.email,
                displayedName: null
            })
        }
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
                                    <Link style={{ alignSelf: 'flex-end', color: '#f44336', fontSize: '18px', paddingLeft: '11.25px' }} onClick={(e) => { this.refuseRequest(this.props.user.uid, studentInfo.userId, this.state.student.indexOf(studentInfo)) }}>Từ chối</Link>
                                    <Link style={{ float: "right", fontSize: '18px', paddingRight: '11.25px' }} onClick={(e) => { this.acceptRequest(this.props.user.uid, studentInfo.userId, studentInfo.fullName, this.state.student.indexOf(studentInfo)) }}>Xác nhận</Link>
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

        const confirmationButton = () => {
            if (this.state.valid === true) {
                return (
                    <Link className="float-right" onClick={this.sendRequest}>Xác nhận</Link>
                )
            }
            else {
                return (
                    <span className="float-right" style={{ cursor: 'not-allowed', color: '#f44336' }}>Xác nhận</span>
                )
            }
        }

        return (
            <div className="personalLibrary row">
                {/* folder navigation bar and modals*/}
                
                {/* main content */}
                <div className="row no-padding">
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
                        <span className='grey-text text-darken-1 modal-trigger' href="#map-test" style={{ cursor: 'pointer', fontSize: '20px', padding: '10px 0' }}>{this.state.studentList.length > 0 ? this.state.studentList.length + " học sinh" : "0 học sinh"}</span>
                    </div>
                    <div className="col s9 container z-depth-1">
                        Quảng cáo
                    </div>
                    <div className="col s12 no-padding center">
                        <SimpleTable style={{ fontFamily: 'Monserrat' }} headCells={[
                            { id: 'index', numeric: true, disablePadding: false, label: '' },
                            { id: 'name', numeric: false, disablePadding: false, label: 'Tên hiển thị' },
                            { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
                            { id: 'phoneNumber', numeric: false, disablePadding: false, label: 'Số điện thoại' },
                            { id: 'gender', numeric: false, disablePadding: false, label: 'Giới tính' },
                            { id: 'dob', numeric: false, disablePadding: false, label: 'Ngày sinh' },
                        ]}
                            rows={this.state.studentList} />
                    </div>
                </div>
                <div>
                    <a href="#addStudent" style={{ position: 'relative' }} className="btn-floating btn-large blue my-floating-btn modal-trigger">
                        <i className="material-icons">add</i>
                    </a>
                    <Modal id="addStudent" options={{ preventScrolling: true }} style={{ height: "80vh", width: '37vw', overflow: "hidden", borderRadius: "25px" }} actions={[]}>
                        <div className="modal-content" style={{
                            position: "absolute",
                            top: "0",
                            bottom: "0",
                            left: "0",
                            right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                            overflowY: "scroll"
                        }}>
                            {/* {showResponseMsg()} */}
                            <h5 className="center">Thêm học sinh</h5>
                            <div className="line"></div>
                            <label name='label-email' style={{ fontSize: '20px', color: '#000' }} htmlFor="">Email học sinh: </label>
                            <input pattern="^[a-z][a-z0-9_\.]{5,32}@[a-z0-9]{2,}(\.[a-z0-9]{2,4}){1,2}$" className="validate" type="email" name="studentEmail" id="studentMail" required onChange={this.fillInput} />
                            <span className='helper-text' data-error={this.state.error}></span>
                            <div className="note col s12">
                                <label name='label-email' style={{ fontSize: '20px', color: '#000' }} htmlFor="setDisplay">Tên hiển thị: </label>
                                <input type="text" name="setDisplay" onChange={this.fillInput} />
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
})

export default connect(mapStateToProps)(StudentManagement);

