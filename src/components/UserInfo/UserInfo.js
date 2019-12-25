import React, { Component } from 'react'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import CreditCardIcon from '@material-ui/icons/CreditCard';
import { Switch, NavLink, Route, Link } from 'react-router-dom/cjs/react-router-dom.min'
import { Avatar, Button } from '@material-ui/core'
import axios from 'axios'
import PersonalInfoEdit from './PersonalInfoEdit'
import PersonalInfo from './PersonalInfo'
import Setting from './Setting';
class UserInfo extends Component {

    state = {
        user: []
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
                                <NavLink className='flex-row' style = {{color:'#3a3a3a'}}to='/user/personalInfo' activeStyle={style.colorizedText}><AccountCircleIcon style={{marginRight: '8px'}}/> <span style={{ fontSize: '13px' }}>Thông tin cá nhân</span></NavLink>
                            </div>
                            <div className="flex-row">
                                <NavLink className='flex-row'style = {{color:'#3a3a3a'}} to='/user/setting' activeStyle={style.colorizedText}><CreditCardIcon style={{marginRight: '8px'}} /> <span style={{ fontSize: '13px' }}>Thuê bao</span></NavLink>
                            </div>
                        </div>
                    </div>
                    <div className="col s9">
                        <Switch>
                            <Route path="/user/personalInfo/edit" component={PersonalInfoEdit} />
                            <Route path="/user/personalInfo" component={PersonalInfo} />
                            <Route path="/user/setting" component={Setting}/>
                        </Switch>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserInfo;
