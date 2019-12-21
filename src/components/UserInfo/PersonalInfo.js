import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Avatar, Button, Hidden, Divider } from '@material-ui/core'
import { Link, Switch, Route } from 'react-router-dom/cjs/react-router-dom.min'
import { Modal } from 'react-materialize'
import PersonalInfoEdit from './PersonalInfoEdit'
import { serverUrl } from '../common/common'
class PersonalInfo extends Component {
    state = {
        request: {
            parentMail: this.props.user.email,
            studentMail: '',
        },
        parentRequest: [],
        error: 'Email không được để trống!',
        valid: false,
        responseMessage: '',

    }

    componentDidMount() {
        console.log(this.props.user);
        axios.get(serverUrl + 'api/user/request/' + this.props.user.uid)
            .then(res => {
                this.setState({
                    parentRequest: res.data
                })
                console.log(this.state.parentRequest)
            });
    }


    formatPhone = (text) => {
        if (text != null)
            return text.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3');
    }

    dateFormat = (text) => {
        if (text != null) {
            return text.slice(8, 10) + "/" + text.slice(5, 7) + "/" + text.slice(0, 4);
        }
        else return '';
        // console.log(text.slice(8,10)+"/"+text.slice(5,7)+"/"+text.slice(0,4))
    }

    requestLink = (e) => {
        e.preventDefault();
        axios.post(serverUrl + 'api/user', {
            studentMail: this.state.request.studentMail,
            parentMail: this.props.user.email
        }).then(res => {
            console.log(res.data);
            this.setState({
                responseMessage: res.data,
            })
            console.log(this.state.responseMessage.mess)
        });
    }

    validateEmail = () => {
        var vnf_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        var email = this.state.request.studentMail;
        if (email) {
            console.log(this.state.error)
            console.log(this.state.valid)
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

    fillLinkMail = (e) => {
        this.setState({
            request: {
                studentMail: e.target.value,
            }
        }, () => {
            this.validateEmail();
        })
        console.log(this.state.request.studentMail);
    }

    acceptRequest = (e, text, position) => {
        e.preventDefault();
        axios.post(serverUrl + 'api/user/requestResponse',
            {
                status: 'accept',
                parentEmail: text,
                studentEmail: this.props.user.email
            }
        )
        console.log(this.state.parentRequest)
        let newList = this.state.parentRequest.filter((item, index) =>
            index !== position
        )
        this.setState({
            parentRequest: newList
        }) //delete at [nth-element] [num of element] in arr
        console.log(this.state.parentRequest)
    }
    refuseRequest = (e, text, position) => {
        e.preventDefault();
        axios.post(serverUrl + 'api/user/requestResponse',
            {
                status: 'refuse',
                parentEmail: text,
                studentEmail: this.props.user.email
            })
        let newList = this.state.parentRequest.filter((item, index) =>
            index !== position
        )
        this.setState({
            parentRequest: newList
        })
    }

    render() {
        const style = {
            linkCount: {
                backgroundColor: '#ff3838',
                borderRadius: '50%',
                position: 'absolute',
                height: '15px',
                width: '15px',
                fontSize: '75%',
                color: '#fff',
                textAlign: 'center',
                right: '-50%',
                transform: 'translate(-75%,-50%)'
            },

            margin0: {
                margin: '0px'
            },
            detail: {
                title: {
                    margin: '3px',
                    fontSize: '15px'
                },
                content: {
                    margin: '3px',
                    fontSize: '19px',
                },
            },
            margin30: {
                marginTop: '30px',
                marginBottom: '30px'
            },
            colorizedText: {
                color: '#086bd1'
            },
            avatar: {
                height: '130px',
                width: '130px'
            },
            field: {
                marginTop: '15px',
                marginBottom: '15px'
            }
        }

        const sendButton = () => {
            if (this.state.valid == true) {
                return (
                    <Link className="modal-action modal-close" style={{ float: "right" }} onClick={this.requestLink}>Xác nhận</Link>
                )
            }
            else {
                return (
                    null
                )
            }
        }

        const showResponseMsg = () => {
            if (this.state.responseMessage) {
                return (
                    <span style={{ color: '#f44336' }}>{this.state.responseMessage.mess}</span>
                )
            }
        }

        const requestCount = () => {
            if (this.state.parentRequest.length > 0) {
                return (<span style={style.linkCount}>{this.state.parentRequest.length}</span>)
            }
        }


        // Học sinh xác nhận liên kết
        const linkResponseModal = () => {
            if (this.state.parentRequest.length > 0) {
                const a = this.state.parentRequest.map(parentRequest => {
                    return (
                        <div>
                            <p>Từ email {parentRequest.email}</p>
                            <p>Của người dùng {parentRequest.fullName}</p>
                            <div>
                                <Button style={{ alignSelf: 'flex-end' }} color="primary" className ="button-primary" onClick={(e) => { this.acceptRequest(e, parentRequest.email, this.state.parentRequest.indexOf(parentRequest)) }}
                                    variant="outlined" color="primary">Xác nhận</Button>
                                <Button style={{ float: 'right' }} onClick={(e) => { this.refuseRequest(e, parentRequest.email, this.state.parentRequest.indexOf(parentRequest)) }}
                                    variant="outlined" color="secondary">Từ chối</Button>
                            </div>
                            <div style={{ clear: 'both' }}></div>
                        </div>)
                })
                return (
                    <div>
                        <h5 className="font-montserrat center" style={{ ...style.colorizedText }}>Xác nhận liên kết</h5>
                        <p>Bạn có liên kết</p>
                        {a}
                    </div>
                );
            } else return (
                <p>Bạn không có lời mời liên kết nào</p>
            )
        }
        return (
            <div>
                <div>
                    <div className="col s12" style={{ margin: '5px' }}><h5 className='font-montserrat' style={{ ...style.colorizedText, ...style.margin30 }}>Thông tin cá nhân</h5>
                    </div>
                    <div className="col s2">
                        <Avatar style={style.avatar} src={this.props.user.picture}></Avatar>
                    </div>
                    <div className="col s8">
                        <h5 className='font-montserrat' style={{ ...style.colorizedText, ...style.margin0 }}>{this.props.user.name}</h5>
                        <div style={style.field}>
                            <p style={style.detail.title}>E-mail:</p>
                            <p style={style.detail.content}>{this.props.user.email}</p>
                        </div>
                        <div style={style.field}>
                            <p style={style.detail.title}>Điện thoại:</p>
                            <p style={style.detail.content}>{this.formatPhone(this.props.user.phone)}</p>
                        </div>
                        <div style={style.field}>
                            <p style={style.detail.title}>Giới tính:</p>
                            <p style={style.detail.content}>{this.props.user.gender ? "Nam" : "Nữ"}</p>
                        </div>
                        <div style={style.field}>
                            <p style={style.detail.title}>Ngày sinh:</p>
                            {this.props.user.dob &&
                                <p style={style.detail.content}>{this.dateFormat(this.props.user.dob)}</p>
                            }
                        </div>
                        <div style={style.field}>
                            <p style={style.detail.title}>Trường:</p>
                            <p style={style.detail.content}>{this.props.user.school}</p>
                        </div>
                        {showResponseMsg()}
                    </div>
                    <div className="col s2 no-padding">
                        <Link style={style.colorizedText} to='/user/personalInfo/edit'>Sửa</Link>
                        {/* check user is parent, show the link-to-student popup */}
                        {this.props.user.userRoleId === 3 &&
                            <a style={{ ...style.colorizedText, marginLeft: '20px' }} href="#link-modal" className="modal-trigger">Liên kết</a>
                        }

                        {this.props.user.userRoleId === 2 &&
                            <a style={{ ...style.colorizedText, marginLeft: '20px', position: 'relative' }} href="#link-accept-modal" className="modal-trigger">
                                {requestCount()}
                                Liên kết
                            </a>
                        }
                    </div>
                    {/* Phụ huynh liên kết với học sinh */}
                    <Modal id="link-modal" options={{ preventScrolling: true }} style={{ width: "40vw", height: "45vh", overflow: "hidden", borderRadius: '25px' }} actions={[]}>
                        <h5 className="font-montserrat center" style={{ ...style.colorizedText }}>Liên kết với học sinh</h5>
                        <label style={{ fontSize: '20px', color: '#000' }} htmlFor="">Email học sinh:</label>
                        <input pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$" className="validate" type="tel" name="studentMail" id="studentMail" value={this.state.request.studentMail} onChange={e => { this.fillLinkMail(e) }} required />
                        <span className='helper-text' data-error={this.state.error}></span>
                        <div style={{ marginTop: '50px' }}>
                            <span className="modal-action modal-close">Hủy thao tác</span>
                            {sendButton()}
                        </div>
                        <div style={{ clear: 'both' }}></div>
                    </Modal>

                    <Modal id="link-accept-modal" options={{ preventScrolling: true }} style={{ width: "40vw", overflow: "hidden", borderRadius: '25px' }} actions={[]}>
                        {linkResponseModal()}
                    </Modal>

                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(PersonalInfo);
