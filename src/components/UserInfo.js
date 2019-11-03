import React, { Component } from 'react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import SettingsIcon from '@material-ui/icons/Settings'
import { Switch, NavLink, Route, Link } from 'react-router-dom/cjs/react-router-dom.min'
import { Avatar, Button } from '@material-ui/core'
import axios from 'axios'
import PersonalInfoEdit from './PersonalInfoEdit'
import PersonalInfo from './PersonalInfo'
class UserInfo extends Component {
    renderSwitch(url) {
        switch (url) {
            case 'http://localhost/home':
                console.log("home");
        }
    }

    state = {
        user: []
    }

    componentDidMount() {

        axios.get('http://localhost:8080/api/user/2')
            .then(res => {
                this.setState({
                    user: res.data
                })
            });
    }

    render() {
        const { user } = this.state;
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
            <div className="containerFluid">
                <div className="row" style={{ display: 'flex' }}>
                    <div className="col s3  z-depth-2" style={{ height: '100vh', position: 'fixed' }}>
                        <div className="col s2"></div>
                        <div className="col s10">
                            <h5 className='font-montserrat' style={{ ...style.margin30, ...style.colorizedText }}>Tài khoản</h5>
                            <div className="line"></div>
                            <div className='flex-row padding-vertical-10'>
                                <NavLink className='flex-row' to='/home/personalInfo'><AccountCircleIcon /> <span style={{ fontSize: '13px' }}>Thông tin cá nhân</span></NavLink>
                            </div>
                            <div className="flex-row">
                                <NavLink className='flex-row' to='/#'><SettingsIcon className='' /> <span style={{ fontSize: '13px' }}>Cài đặt</span></NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="col s9">
                        <Switch>
                            <Route path="/home/personalInfo/edit" component={PersonalInfoEdit} />
                            <Route path="/home/personalInfo" component={PersonalInfo} />
                            <Route path="/setting"></Route>
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserInfo;
