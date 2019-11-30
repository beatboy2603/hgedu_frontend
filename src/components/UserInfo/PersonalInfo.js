import React, { Component } from 'react'
import axios from 'axios';
import { Avatar, Button, Hidden, Divider } from '@material-ui/core'
import { Link, Switch, Route } from 'react-router-dom/cjs/react-router-dom.min'
import { Modal } from 'react-materialize'
import PersonalInfoEdit from './PersonalInfoEdit'
import {serverUrl} from '../common/common'
export default class PersonalInfo extends Component {
    state = {
        user: null,
        request: {
            parentMail: null,
            studentMail: null,

        }
    }

    componentDidMount() {
        axios.get(serverUrl+'api/user/' + '2')
            .then(res => {
                this.setState({
                    user: res.data
                })
                console.log(this.state.user);
            });

        axios.get('http://localhost:8080/api/user/request/' + '2')
            .then(res => {
                this.setState({
                    request:res.data
                })
                console.log(this.state.request)
            });

    }


    checkRequestLink = () =>{

    }

    requestLink = (e) => {
        e.preventDefault();
        axios.post('http://localhost:8080/api/user', {
            studentMail: this.state.request.studentMail,
            parentMail: this.state.user.email
        })
        if (window.confirm("Do you want to link to this email?")) {
            window.alert(this.state.request.studentMail + "\n" + this.state.request.parentMail)
        }
    }

    fillLinkMail = (e) => {
        this.state.request.studentMail = e.target.value
        this.state.request.parentMail = this.state.user.email
    }

    render() {
        const { user } = this.state
        const { request } = this.state
        const style = {
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
        return (
            <div>
                {user && 
                    <div>
                        <div className="col s12" style={{ margin: '5px' }}><h5 className='font-montserrat' style={{ ...style.colorizedText, ...style.margin30 }}>Thông tin cá nhân</h5>
                        </div>
                        <div className="col s2">
                            <Avatar style={style.avatar}></Avatar>
                        </div>
                        <div className="col s8">
                            <h5 className='font-montserrat' style={{ ...style.colorizedText, ...style.margin0 }}>{user.fullName}</h5>
                            <div style={style.field}>
                                <p style={style.detail.title}>E-mail:</p>
                                <p style={style.detail.content}>{user.email}</p>
                            </div>
                            <div style={style.field}>
                                <p style={style.detail.title}>Điện thoại:</p>
                                <p style={style.detail.content}>{user.phoneNumber}</p>
                            </div>
                            <div style={style.field}>
                                <p style={style.detail.title}>Giới tính:</p>
                                <p style={style.detail.content}>{user.gender ? "Nam" : "Nữ"}</p>
                            </div>
                            <div style={style.field}>
                                <p style={style.detail.title}>Ngày sinh:</p>
                                <p style={style.detail.content}>10/01/1997</p>
                            </div>
                            <div style={style.field}>
                                <p style={style.detail.title}>Trường</p>
                                <p style={style.detail.content}>Đại học FPT Hà Nội</p>
                            </div>
                        </div>
                        <div className="col s2 no-padding">
                            <Link to='/user/personalInfo/edit'>Sửa</Link>
                            <a style={{ marginLeft: '20px' }} href="#link-modal" className="modal-trigger">Liên kết</a>
                        </div>
                
                        <Modal id="link-modal" options={{ preventScrolling: true }} style={{ width: "40vw", height: "45vh", overflow: "hidden" }} actions={[]}>
                        <h5 className="font-montserrat center" style={{ ...style.colorizedText }}>Liên kết với học sinh</h5>

                        {/* <div className="link-form" id="class-form" style={{ border: 'solid 1px #3a3a3a', backgroundColor: '#fff', width: '400px', position: 'fixed', top: '20%', left: '50%', zIndex: '100', transform: 'translate(-50%,-50%)' }}>
                            <form style={{ margin: '10px' }} action="">
                                <label style={{ fontSize: '20px', color: '#000' }} htmlFor="">Email học sinh:</label>
                                <input className="validate" type="email" name="studentMail" id="studentMail" value={this.state.request.studentMail} onChange={this.fillLinkMail} required />
                                <span className='helper-text' data-error="Mail sai định dạng"></span>
                                <button style={{ float: 'right' }} onClick={this.requestLink}>Gửi</button>
                                <div style={{ clear: 'both' }}></div>
                            </form>
                            <Divider variant="middle"/>
                            <div className="listed-link" >
                                {request.parentMail}
                            </div>
                        </div> */}
                        </Modal>
                    </div>
                }
            </div>
        )
    }
}
