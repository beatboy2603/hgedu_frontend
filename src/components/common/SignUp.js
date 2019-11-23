import React, { Component } from 'react';
import Logo from '../../resources/logo.png';
import { connect } from 'react-redux';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CustomizedDatePicker from '../common/CustomizedDatePicker';
import { DatePicker } from "react-materialize";

class SignUp extends Component {
    state = {
        fullName: this.props.user.name,
        email: this.props.user.email,
        phone: "",
        gender: null,
        dob: null,
        school: "",
        errorText: "Bạn chưa điền số điện thoại!",
    }

    validatePhone = () => {
        var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        var mobile = this.state.phone;

        if (mobile) {
            if (vnf_regex.test(mobile) == false) {
                // this.setState(prevState => ({
                //     ...prevState,
                //     errorText: "Số điện thoại của bạn không đúng định dạng!"
                // }))
                console.log(mobile);
                this.setState({
                    errorText: "Số điện thoại của bạn không đúng định dạng!"
                })
            }
        } else {
            this.setState({
                errorText: "Bạn chưa điền số điện thoại!"
            })
        }
        console.log(this.state);
    }

    handleChange = (source, e) => {
        switch (source) {
            case "phone":
                this.setState({
                    phone: e.target.value
                }, () => {
                    this.validatePhone();
                });

                break;
            case "school":
                this.setState({
                    school: e.target.value
                })
                break;
        }
    }

    render() {
        return (
            <div className="signup row">
                <div className="col s2">
                    <a href="">
                        <i className="material-icons" style={{ margin: "10vh", color: "#3a3a3a", fontSize: "50px" }}>arrow_back</i>
                    </a>
                </div>
                <div className="col s8 container flex-column center">
                    <div style={{ margin: "5vh 0" }}>
                        <img className="center-align" style={{ width: "7vw" }} src={Logo} alt="Logo" />
                    </div>
                    <div>
                        <h5 className="blue-text text-darken-2 bold font-montserrat" style={{ marginTop: "0" }}>Chào mừng!</h5>
                        <p style={{ fontSize: "19px" }}>Bây giờ, chúng mình cần thông tin đầy đủ và xác thực của bạn.</p>
                        <div className="row">
                            <div className="col s2 offset-s2 center">
                                <div>
                                    <img style={{ width: "9vw" }} src={this.props.user.picture} alt="Avatar" />
                                </div>
                            </div>
                            <div className="row col s7">
                                <div className="col s12 flex-row">
                                    <div className="col s4 left-align">
                                        <span style={{ fontSize: "19px" }}>Họ, tên<span className='red-text'>*</span>:</span>
                                    </div>
                                    <div className="col s8">
                                        <input id='fullName' type="text" className="validate" disabled value={this.props.user.name} />
                                    </div>
                                </div>
                                <div className="col s12 flex-row">
                                    <div className="col s4 left-align">
                                        <span style={{ fontSize: "19px" }}>Email<span className='red-text'>*</span>:</span>
                                    </div>
                                    <div className="col s8 ">
                                        <input id='email' type="text" className="validate" disabled value={this.props.user.email} />
                                    </div>
                                </div>
                                <div className="col s12 flex-row">
                                    <div className="col s4 left-align">
                                        <span style={{ fontSize: "19px" }}>Số điện thoại<span className='red-text'>*</span>:</span>
                                    </div>
                                    <div className="col s8 ">
                                        <input pattern="^((09|03|07|08|05)+([0-9]{8})\b)$" id='phone' type="tel" className="validate" required value={this.state.phone} onChange={e => { this.handleChange("phone", e) }} />
                                        <span class="helper-text" data-error={this.state.errorText}></span>
                                    </div>
                                </div>
                                <p className="grey-text text-lighten-1 left-align" style={{ marginLeft: "1.5vw", textDecoration: "underline", fontSize: "13px" }}>*Nhớ sử dụng số điện thoại có thực bạn đang dùng nhé!</p>
                                <div className="col s12 flex-row">
                                    <div className="col s4 left-align">
                                        <span style={{ fontSize: "19px" }}>Giới tính:</span>
                                    </div>
                                    <div className="col s8 left-align" >
                                        <RadioGroup aria-label="gender" name="gender" style={{ display: "inline" }}>
                                            <FormControlLabel style={{ color: "#000000" }} value="true" control={<Radio color="primary" />} label="Nam" />
                                            <FormControlLabel style={{ color: "#000000" }} value="false" control={<Radio />} label="Nữ" />
                                        </RadioGroup>
                                    </div>
                                </div>
                                <div className="col s12 flex-row">
                                    <div className="col s4 left-align">
                                        <span style={{ fontSize: "19px" }}>Ngày sinh:</span>
                                    </div>
                                    <div className="col s8" >
                                        <CustomizedDatePicker width="21vw" />
                                    </div>
                                </div>
                                <div className="col s12 flex-row">
                                    <div className="col s4 left-align">
                                        <span style={{ fontSize: "19px" }}>Trường:</span>
                                    </div>
                                    <div className="col s8">
                                        <input id='school' type="text" className="validate" value={this.state.school} onChange={e => { this.handleChange("school", e) }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(mapStateToProps)(SignUp);
