import React, { Component } from 'react'
import axios from 'axios';
import { Avatar, Button } from '@material-ui/core'
import { Link, Switch, Route } from 'react-router-dom/cjs/react-router-dom.min'
import PersonalInfoEdit from './PersonalInfoEdit'
import Modal from 'react-materialize'
import {serverUrl} from './common/common'
export default class PersonalInfo extends Component {
    state = {
        user: null
    }

    componentDidMount() {
        axios.get(serverUrl+'api/user/' + '2')
            .then(res => {
                this.setState({
                    user: res.data
                })
                console.log(this.state.user);
            });
    }
    render() {
        const { user } = this.state
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
                            <Link style={{marginLeft:'20px'}} to='/user/personalInfo/edit'>Liên kết</Link>
                        </div>
                        <div class="link-form" id="class-form" style={{ border: 'solid 1px #3a3a3a', backgroundColor: '#fff', width: '400px', position: 'fixed', top: '20%', left: '50%', zIndex: '100', transform: 'translate(-50%,-50%)' }}>
                            <form style={{ margin: '10px' }} action="">
                                <h5 className="font-montserrat" style={{ ...style.colorizedText }}>Liên kết với học sinh</h5>
                                <label style={{ fontSize: '20px', color: '#000' }} htmlFor="">Email học sinh:</label>
                                <input type="text" name="email" id="email" />
                                <button style={{ float: 'right' }} onSubmit={()=>{this.sendLinkRequest()}}>Gửi</button>
                                <div style={{ clear: 'both' }}></div>
                            </form>
                        </div>
                        <div style={{ position: 'fixed', top: '0', right: '0', bottom: '0', left: '0', backgroundColor: 'rgba(0,0,0,0.5)', pointerEvents: 'none' }}></div>
                        {/* <div className="col s1 no-padding">
                        <a href="#edit">Sửa</a>
                        <Modal id="edit">
                            
                        </Modal>
      
                    </div> */}
                    </div>

                }
            </div>
        )
    }
}
