import React, { Component } from 'react';
import SwitchUI from '@material-ui/core/Switch';
import { Checkbox } from '@material-ui/core';
import axios from 'axios';
import { array } from 'prop-types';

class UserManagemnt extends Component {

    constructor() {
        super();
        this.state = {
            // "userId": "",
            // "userSub": "",
            // "email": "",
            // "fullName": "",
            // "phoneNumber": "",
            // "gender": "",
            // "roleId": ""
            users: []
        }
        this.checkRoleId = this.checkRoleId.bind(this);
    }

    handleChange = (e) => {
        console.log(e.target.checked);
    }

    componentWillMount() {
        axios.get("http://localhost:8084/api/user/allUsers").then(res => {
            console.log(res.data+"as");
            this.setState({
                users: res.data
            });
        });

        axios.get("http://localhost:8084/api/user/countUsers").then(res => {
            console.log(res.data+"as");
            this.setState({
                ...this.state,
                total: res.data
            });
        });
    }

    checkRoleId(roleId){
        if(roleId===1){
            return (<td>Student</td>)
        }
        else if(roleId === 2){
            return (<td>Parent</td>)
        }
        else{
            return (<td>Teacher</td>)
        }
    }

    
    render() {

        const {users}= this.state;
        const {total}= this.state;
        return (
            <div className="containerFluid">
                <div className="row s12">
                    <div className="col s1"></div>
                    <div className="col s11">
                        <div className="header">
                            <h5 className="setBlue">Tài khoản</h5>
                            <select>
                                <option>Tất cả</option>
                                <option>Teacher</option>
                                <option>Parent</option>
                                <option>Student</option>
                            </select>
                            <span>{total} Người dùng</span>
                            <button className="float-right">Ủy Quyền</button>
                            <table className="menu">
                                <tr>
                                    <th className="setBlue">Loại người dùng</th>

                                    <th><a>Tất cả</a></th>
                                    <th><input type="text" placeholder="Tìm kiếm"></input></th>
                                </tr>
                            </table>
                        </div>



                        <table className="table" >
                            <tr className="setBlue">
                                <th>
                                    <Checkbox></Checkbox>
                                </th>
                                <th>E-mail</th>
                                <th>Chức năng</th>
                                <th></th>
                                <th>Tên hiển thị</th>
                            </tr>
                            {
                                users.map(user => {
                                    return (
                                      <tr key={user.id}>
                                        <td>
                                          <Checkbox></Checkbox>
                                        </td>
                                        <td>{user.email}</td>
                                        {this.checkRoleId(user.roleId)}
                                        <td className="setBlue">VIP</td>
                                        <td>{user.fullName}</td>
                                      </tr>
                                    );
                                })
                                /* {<tr>
                                <td><Checkbox checked="check"></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Teacher</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>} */}

                            
                            
                        </table>
                    </div>

                </div>
            </div>

        )
    }
}

export default UserManagemnt;