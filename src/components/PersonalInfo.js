import React, { Component } from 'react'
import axios from 'axios';
import { Avatar, Button } from '@material-ui/core'
import { Link , Switch , Route } from 'react-router-dom/cjs/react-router-dom.min'
import PersonalInfoEdit from './PersonalInfoEdit'
import Modal from 'react-materialize'
export default class PersonalInfo extends Component {
    state = {
        user: null
    }

    componentDidMount() {
        axios.get('http://localhost:8080/api/user/' + '1')
            .then(res => {
                console.log(res.data)
                this.setState({
                    user: res.data
                })
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
                    <div className="col s9">
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
                    <div className="col s1 no-padding">
                        <Link to = '/home/personalInfo/edit'>Sửa</Link>
                    </div>
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
