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
        teacherList: [],
        note: '',
        // valid: false,
        requestTeacher: [],
        // 
    }

    style = {
        countBadge: {
            backgroundColor: '#ff3838',
            borderRadius: '50%',
            top: '0%',
            left: '86%',
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
    }

    componentDidMount() {
        axios.get(serverUrl + "api/enrollment/student/getRequest/" + this.props.user.uid)
            .then(res => {
                this.setState({
                    requestTeacher: res.data,
                })
                console.log(this.state.requestTeacher)
            })

        axios.get(serverUrl + "api/enrollment/student/teacherList/" + this.props.user.uid)
            .then(res => {
                console.log(res.data);
                let teacherList = [];
                res.data.map((el, i) => {
                    let teacher = {
                        index: i + 1,
                        teacherId: el[0],
                        fullName: el[1],
                        email: el[2],
                        phoneNumber: el[3],
                        gender: el[4],
                        dob: el[5],
                    }
                    teacherList.push(teacher);
                })
                console.log(teacherList);
                this.setState({
                    teacherList
                })
                console.log(this.state.teacherList)
            })
    }


    acceptRequest = (teacherId, studentId, position) => {
        axios.post(serverUrl + "api/enrollment/student/requestHandle", {
            status: "accept",
            teacherId: teacherId,
            studentId: studentId,
        }, () => {
            this.loadData();
        })
        console.log("accept")
        let newList = this.state.requestTeacher.filter((item, index) =>
            index !== position
        )
        this.setState({
            requestTeacher: newList,
        })
    }

    refuseRequest = (teacherId, studentId, position) => {
        axios.post(serverUrl + "api/enrollment/student/requestHandle",
            {
                status: "refuse",
                teacherId: teacherId,
                studentId: studentId
            })
        let newList = this.state.requestTeacher.filter((item, index) =>
            index !== position
        )
        this.setState({
            requestTeacher: newList,
        })
    }

    fillInput = (e) => {
        if (e.target.name === "email") {
            this.setState({
                teacherEmail: e.target.value
            }, () => { this.validateEmail(this.state.teacherEmail) });
        }
        else {
            this.setState({
                [e.target.name]: e.target.value,
            })
        }
    }

    validateEmail = (email) => {
        var vnf_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
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
        axios.post(serverUrl + "api/enrollment/student/request",
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
        const loadTeacherInfo = () => {
            if (this.state.requestTeacher && this.state.requestTeacher.length > 0) {
                let teacher = this.state.requestTeacher;
                const load = teacher.map((teacherInfo, index) => {
                    return (
                        <div>
                            <div className="line" style={{ marginBottom: '20px' }}></div>
                            <div className='col s12 row'>
                                <div className='col s12' style={this.style.column}>
                                    <div className="col s5">Tên giáo viên: </div>
                                    <div className="col s7">{teacherInfo.fullName}</div>
                                </div>
                                <div className='col s12' style={this.style.column}>
                                    <div className="col s5">Email: </div>
                                    <div className="col s7">{teacherInfo.email}</div>
                                </div>
                                <div className='col s12' style={this.style.column}>
                                    <div className="col s5">Ngày sinh: </div>
                                    <div className="col s7">{teacherInfo.dob}</div>
                                </div>
                                <div className='col s12' style={this.style.column}>
                                    <div className="col s5">Giới tính: </div>
                                    <div className="col s7">{teacherInfo.gender ? "Nam" : "Nữ"}</div>
                                </div>
                                <div className='col s12' style={this.style.column}>
                                    <Link style={{ alignSelf: 'flex-end', color: '#f44336', fontSize: '18px', paddingLeft: '11.25px' }} onClick={(e) => { this.refuseRequest(teacherInfo.userId, this.props.user.uid, this.state.requestTeacher.indexOf(teacherInfo)) }}>Từ chối</Link>
                                    <Link style={{ float: "right", fontSize: '18px', paddingRight: '11.25px' }} onClick={(e) => { this.acceptRequest(teacherInfo.userId, this.props.user.uid, teacherInfo.fullName, this.state.requestTeacher.indexOf(teacherInfo)) }}>Xác nhận</Link>
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

        const countTeacher = () => {
            console.log(this.state.requestTeacher)
            if (this.state.requestTeacher && this.state.requestTeacher.length > 0) {
                return (
                    <span style={this.style.countBadge}>{this.state.requestTeacher.length}</span>
                )
            }
        }
        const showResponseMsg = () => {
            if (this.state.responseMessage) {
                if (this.state.responseMessage.error) {
                    return (
                        <div className="col 12" style={{ borderRadius: '12px', border: '1px solid #FE3433', backgroundColor: '#FFEEEE', padding: '10px 0 10px 10px' }}>
                            <span style={{ color: '#f44336' }}>{this.state.responseMessage.error}</span>
                        </div>
                    )
                }
                if (this.state.responseMessage.success) {
                    return (
                        <div className="col 12" style={{ borderRadius: '12px', border: '1px solid #6ABF5A', backgroundColor: '#CCEBC9', padding: '10px 0 10px 10px' }}>
                            <span style={{ color: '#2F7211' }}>{this.state.responseMessage.success}</span>
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
                <div className="row no-padding">
                    <div className="col s3 container min-height-60 knowledgeGroup-header">
                        <div style={{ position: 'relative' }}>
                            <h5 className="blue-text text-darken-3 bold font-montserrat modal-trigger" style={{ cursor: "pointer" }} href='#student-request-modal'>D.S. giáo viên</h5>
                            {countTeacher()}
                        </div>
                        <Modal id="student-request-modal" options={{ preventScrolling: true }} style={{ height: "80vh", width: '37vw', overflow: "hidden", borderRadius: "25px" }} actions={[]}>
                            <div className="modal-content" style={{
                                position: "absolute",
                                top: "0",
                                bottom: "0",
                                left: "0",
                                right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                                overflowY: "scroll"
                            }}>
                                <h5 className="center" style={{ marginBottom: "30px" }}>Danh sách giáo viên gửi liên kết</h5>
                                {loadTeacherInfo()}
                            </div>
                        </Modal>
                        <p className='grey-text text-darken-1'>{this.state.teacherList.length > 0 ? this.state.teacherList.length + " giáo viên" : "0 giáo viên"} </p>
                    </div>
                    <div className="col s9 container z-depth-1">
                        Quảng cáo
                    </div>
                    <div className="col s12 no-padding center">
                        <StudentCustomizedTable
                            headCells={[
                                { id: 'index', numeric: true, disablePadding: false, label: '' },
                                { id: 'name', numeric: false, disablePadding: false, label: 'Họ và tên' },
                                { id: 'email', numeric: false, disablePadding: false, label: 'Email' },
                                { id: 'phoneNumber', numeric: false, disablePadding: false, label: 'Số điện thoại' },
                                { id: 'gender', numeric: false, disablePadding: false, label: 'Giới tính' },
                                { id: 'dob', numeric: false, disablePadding: false, label: 'Ngày sinh' },
                            ]}
                            rows={this.state.teacherList}
                        />

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