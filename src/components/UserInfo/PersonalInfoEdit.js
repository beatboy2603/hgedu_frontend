import React, { Component } from 'react';
import axios from 'axios';
import { connect } from 'react-redux';
import { Avatar, Button, RadioGroup, FormControlLabel, Radio } from '@material-ui/core'
import { NavLink, Link, Redirect } from 'react-router-dom/cjs/react-router-dom.min'
import { makeStyles } from '@material-ui/styles'
import { serverUrl } from '../common/common'
import CustomizedDatePicker from '../common/CustomizedDatePicker'
class PersonalInfoEdit extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //user: this.props.user ? this.props.user : {}
            name: '',
            email: '',
            phone: '',
            gender: true,
            dob: '',
            school: '',
            error: '',
            valid: true,

        }
        this.changeInfo = this.changeInfo.bind(this);
        this.submitData = this.submitData.bind(this);
    }

    // componentWillReceiveProps(nextProps) {
    //     console.log(nextProps.user)
    //     if(nextProps.user){
    //         console.log(nextProps.user)
    //         //if(JSON.stringify(nextProps.user)!== JSON.stringify(this.state.user)) {
    //             this.setState({
    //                 user: nextProps.user
    //             })
    //         //}
    //     }
    // }

    componentDidMount() {
        console.log(this.props.user)
        this.setState({
            name: this.props.user.name,
            email: this.props.user.email,
            phone: this.props.user.phone,
            gender: this.props.user.gender,
            dob: this.props.user.dob,
            school: this.props.user.school
        })
    }

    submitData(e) {
        if (window.confirm('Bạn có muốn thay đổi thông tin?')) {
            e.preventDefault();
            axios.put(serverUrl + 'api/user/' + this.props.user.uid, this.state)
                .then(res =>
                    console.log(res.status));
            console.log('success!');
            this.props.dispatch({
                type: "UPDATE_USER", payload: {
                    phone: this.state.phone,
                    gender: this.state.gender,
                    dob: this.state.dob,
                    school: this.state.school,
                }
            });
            this.props.history.push("/user/personalInfo")
        }

        
    }

    handleDate = (value) => {
        this.setState({
            dob: value,
        })
    }

    dateFormat = (text) => {
        if (text) {
            return text.slice(8, 10) + "/" + text.slice(5, 7) + "/" + text.slice(0, 4);
        }
        else return '';
        // console.log(text.slice(8,10)+"/"+text.slice(5,7)+"/"+text.slice(0,4))
    }

    str2bool = (string) => {
        if (string && typeof string === 'string') {
            if (string.toLowerCase() === "true") return true;
            if (string.toLowerCase() === "false") return false;
        }
        return string;
    }

    validatePhone = () => {
        var vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
        var mobile = this.state.phone;
        if (mobile) {
            console.log(mobile)
            console.log(this.state.valid)
            if (vnf_regex.test(mobile) == false) {
                this.setState({
                    error: "Số điện thoại của bạn không đúng định dạng!",
                    valid: false
                });
                return;
            };
        } else {
            this.setState({
                error: "Bạn chưa điền số điện thoại!",
                valid: false
            })
            return;
        }
        this.setState({
            valid: true
        })
    }


    changeInfo(e) {
        if (e.target.name === 'gender') {
            this.setState({
                gender: this.str2bool(e.target.value)
            })
        }
        else if (e.target.name === 'phone') {
            this.setState({
                phone: e.target.value
            }, () => {
                this.validatePhone();
            });
        }
        else {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
    };


    render() {
        const saveLink = () => {
            if (this.state.valid == true) {
                console.log(this.state.valid)
                return (
                    <Link onClick={this.submitData}>Lưu</Link>
                )
            }
            else {
                console.log(this.state.valid);
                return (
                    <span style={{ cursor: 'not-allowed', color: '#f44336' }}>Lưu</span>
                )
            }

        }

        const { user } = this.state;
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
                <div>
                    <div className="col s12" style={{ margin: '5px' }}><h5 className='font-montserrat' style={{ ...style.colorizedText, ...style.margin30 }}>Thông tin cá nhân</h5>
                    </div>
                    <div className="col s2">
                        <Avatar style={style.avatar} src={this.props.user.picture}></Avatar>
                    </div>
                    <div className="col s8">
                        <div className="form col s8">
                            <h5 className='font-montserrat' style={{ ...style.colorizedText, ...style.margin0 }}>{this.state.name}</h5>
                            <div style={style.field}>
                                <p style={style.detail.title}>E-mail:</p>
                                <label style={{ ...style.detail.content, color: '#3a3a3a' }} name="email" value={this.state.email} onChange={this.changeInfo}>{this.state.email}</label>
                            </div>
                            <div style={style.field}>
                                <p style={style.detail.title}>Điện thoại:</p>
                                <input pattern="^((09|03|07|08|05)+([0-9]{8})\b)$" name="phone" className="validate" required type="tel" style={style.detail.content} onChange={e => { this.changeInfo(e) }} value={this.state.phone} />
                                <span className="helper-text" data-error={this.state.error}></span>
                            </div>
                            {/* Radio-button gender chooser section */}
                            <div style={style.field}>
                                <p style={style.detail.title}>Giới tính:</p>
                                <RadioGroup name="gender">
                                    <FormControlLabel value={true} checked={this.state.gender === true} name="gender" control={<Radio color="primary" />} onChange={this.changeInfo} label="Male" />
                                    <FormControlLabel value={false} checked={this.state.gender === false} name="gender" control={<Radio color="primary" />} onChange={this.changeInfo} label="Female" />
                                </RadioGroup>
                            </div>

                            <div style={style.field}>
                                <p style={style.detail.title}>Ngày sinh:</p>
                                <CustomizedDatePicker width="376px" customStyle={{ marginLeft: "-11.25px" }} handleParentState={this.handleDate} defaultValue={this.dateFormat(this.props.user.dob)} />
                                {/* <input type="text" style={style.detail.c/ontent} name="dob" value={this.dateFormat(this.state.dob)} onChange={this.changeInfo} /> */}
                            </div>
                            <div style={style.field}>
                                <p style={style.detail.title}>Trường:</p>
                                <input type="text" style={style.detail.content} name="school" value={this.state.school} onChange={this.changeInfo} />
                            </div>
                        </div>
                    </div>
                    <div className="col s2 no-padding">
                        <Link style={{ marginRight: '10px', color: '#3a3a3a' }} to="/user/personalInfo">Huỷ</Link>
                        {saveLink()}
                    </div>


                </div>
            </div>
        )
    }
}
const mapStateToProps = state => ({
    user: state.user,
});

export default connect(mapStateToProps)(PersonalInfoEdit)