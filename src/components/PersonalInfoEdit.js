import React, { Component } from 'react'
import axios from 'axios';
import { Avatar, Button, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import { NavLink, Link, Redirect } from 'react-router-dom/cjs/react-router-dom.min'
export default class PersonalInfoEdit extends Component {
    // state = {
    //     user: {}
    // }

    constructor(props) {
        super(props);
        this.state = {
            user: {}
        }
        this.changeInfo = this.changeInfo.bind(this);
        this.submitData = this.submitData.bind(this);
    }
    componentDidMount() {
        axios.get('http://localhost:8080/api/user/' + '2')
            .then(res => {
                this.setState({
                    user: res.data
                })
                console.log(this.state.user)
            });
    }

    submitData(e) {
        e.preventDefault();
        axios.put('http://localhost:8080/api/user/2', this.state.user)
            .then(res => 
                console.log(res.status));
                return <Redirect to='/home/personalInfo'/>
    }

    str2bool = (string) => {
        if (string && typeof string === 'string') {
            if (string.toLowerCase() === "true") return true;
            if (string.toLowerCase() === "false") return false;
        }
        return string;
    }
    changeInfo(e) {
        this.setState({
            user: { ...this.state.user, [e.target.name]: this.str2bool(e.target.value) }
        })
        console.log(this.state.user)

    }

    render() {
        const { user } = this.state
        const style = {
            inputname: {
                height: '30px'
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
                            <div className="form col s8">
                                <h5 className='font-montserrat' style={{ ...style.colorizedText, ...style.margin0 }}>{user.fullName}</h5>
                                {/* <input type="text" name="fullName" value={user.fullName} onChange={this.changeInfo} /> */}
                                <div style={style.field}>
                                    <p style={style.detail.title}>E-mail:</p>
                                    <input type="text" style={style.detail.content} name="email" value={user.email} onChange={this.changeInfo} />
                                </div>
                                <div style={style.field}>
                                    <p style={style.detail.title}>Điện thoại:</p>
                                    <input name="phoneNumber" type="text" style={style.detail.content} value={user.phoneNumber} />
                                </div>
                                <div style={style.field}>
                                    <p style={style.detail.title}>Giới tính:</p>
                                    <RadioGroup name="gender">
                                        <FormControlLabel value={true} checked={user.gender === true} name="gender" control={<Radio color="primary" />} onChange={this.changeInfo} label="Male" />
                                        <FormControlLabel value={false} checked={user.gender === false} name="gender" control={<Radio color="primary" />} onChange={this.changeInfo} label="Female" />
                                    </RadioGroup>
                                </div>
                                <div style={style.field}>
                                    <p style={style.detail.title}>Ngày sinh:</p>
                                    <input type="text" style={style.detail.content} defaultValue="10/01/1997" onChange={((e) => { console.log(e.target.value) })} />
                                </div>
                                <div style={style.field}>
                                    <p style={style.detail.title}>Trường</p>
                                    <input type="text" style={style.detail.content} value="Đại học FPT Hà Nội" />
                                </div>
                            </div>
                        </div>
                        <div className="col s2 no-padding">
                            <Link style={{ marginRight: '10px', color: '#3a3a3a' }} to="/home/personalInfo">Huỷ</Link>
                            <Link onClick={this.submitData}>Lưu</Link>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
