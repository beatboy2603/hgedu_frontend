import React, { Component } from 'react';
import SwitchUI from '@material-ui/core/Switch';
import { Checkbox } from '@material-ui/core';

class UserManagemnt extends Component {
    handleChange = (e) => {
        console.log(e.target.checked);
    }

    

    render() {
        return (
            <div className="containerFluid">
                <div className = "row">
                    <div className="col s1"></div>
                    <div className="col s9">
                        <div className="header">
                            <h3 className="setBlue">Tài khoản</h3>
                            <select>
                                            <option>Tất cả</option>
                                            <option>Teacher</option>
                                            <option>Parent</option>
                                            <option>Student</option>
                            </select>
                            <span>344 Người dùng</span>
                            <button className= "float-right">Ủy Quyền</button>
                            <table className = "menu"> 
                                <tr>
                                    <th className="setBlue">Loại người dùng</th>
                                    <th>
                                        <select>
                                            <option>Tất cả</option>
                                            <option>Teacher</option>
                                            <option>Parent</option>
                                            <option>Student</option>
                                        </select>
                                    </th>
                                    <th><a>Tất cả</a></th>
                                    <th><input type="text" placeholder="Tìm kiếm"></input></th>
                                </tr>
                            </table>
                        </div>
                        
                        
                        
                        <table className= "table" >
                            <tr className="setBlue">
                                <th>
                                <Checkbox></Checkbox>
                                </th>
                                <th>E-mail</th>
                                <th>Chức năng</th>
                                <th></th>
                                <th>Tên hiển thị</th>
                            </tr>
                            <tr>
                                <td><Checkbox checked="check"></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Teacher</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Student</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Parent</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Teacher</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Parent</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Teacher</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Teacher</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Parent</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Parent</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Teacher</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Teacher</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Parent</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Parent</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                            <tr>
                                <td><Checkbox></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Parent</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>
                        </table>
                    </div>
                    
                </div>
            </div>
                
        )
    }
}

export default UserManagemnt;