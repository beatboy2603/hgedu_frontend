
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import SwitchUI from "@material-ui/core/Switch";
import { Checkbox, TextField } from "@material-ui/core";
import axios from "axios";
import { array } from "prop-types";
import Icon from "@material-ui/core/Icon";
import { Modal, Button } from "react-materialize";
import { makeStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import CustomizedSelect from "../common/CustomizedSelect";
import moment from "moment";
import common, { formatDate } from "../common/common";
import { border } from "@material-ui/system";

class UserManagemnt extends Component {
  constructor() {
    super();
    var today = new Date(),
      date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate() +
        " " +
        today.getHours() +
        ":" +
        today.getMinutes() +
        ":" +
        today.getSeconds();
    this.state = {
      // "userId": "",
      // "userSub": "",
      // "email": "",
      // "fullName": "",
      // "phoneNumber": "",
      // "gender": "",
      // "roleId": ""
      users: [],
      user_subcription: [],
      addModEmail: null,
      selectedDateBan: null,
      selectedDatePremium: null,
      currentDate: date,
      
      error: 'Email không được để trống!',
      valid: false,
      responseMessage:'',
      
    };
    this.checkRoleId = this.checkRoleId.bind(this);
    this.checkBan = this.checkBan.bind(this);
    // this.unBanUser = this.unBanUser.bind(this);
    // this.banUser = this.banUser.bind(this);
    // this.banForever = this.banForever.bind(this);
    // this.addMod = this.addMod.bind(this);
  }

  handleSelectChange = value => {
    this.setState({
      selectedDateBan: value
    });
  };

  handleSelectChangePremium = value => {
    this.setState({
      selectedDatePremium: value
    });
  };

  handleChange = e => {
    console.log(e.target.checked);
  };

  componentWillMount() {
    axios.get("http://localhost:8084/api/user/allUsers").then(res => {
      console.log("all");
      console.log(res.data);
      this.setState({
        users: res.data
      });
    });

    axios.get("http://localhost:8084/api/user/countUsers").then(res => {
      console.log(res.data + "as");
      this.setState({
        ...this.state,
        total: res.data
      });
    });
  }

  handleFormSubmit = e => {
    e.preventDefault();
    if (this.state.addModEmail !== null && this.state.addModEmail !== "") {
      document.getElementById("buttonAddMod").click();
    }
    
  };

  handleInputChange = source => e => {
    if (source === "email") {
      this.setState({
        addModEmail: e.target.value
      });
    }
  };

  addMod = type => {
    var vnf_regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var email = this.state.addModEmail;
    if (this.state.addModEmail) {
      let users = this.state.users;
      const check = users.filter(user =>{
        return user.email === this.state.addModEmail;
      })
      if(check.length!==0){
        alert("Email này đã được sử dụng!!!");
        return;
      }
      if (vnf_regex.test(email) === false) {
        this.setState({
            valid: false
        });
        alert("Email không đúng định dạng!!!")
        return;
      }
      
      axios
        .post("http://localhost:8084/api/user/addMod", {
          email: this.state.addModEmail,
          roleId: 2
        })
        .then(res => {
          axios.get("http://localhost:8084/api/user/allUsers").then(res => {
            
            this.setState({
              users: res.data
            });
          });
        });
      }
      else {
        this.setState({
            valid: false
        })
        alert("Email không được để trống1!!")
        return;
    }
    this.setState({
      valid: true
    })
  };

  


  banUser = (user,index) => {
    // const {users} = this.state;
    // const user = users.filter((user, id)=>{
    //   return user.userId==id;
    // })

    // user.isBan = true;
    // user.isBanForever = false;
    // user.bannedUntil = moment(this.state.currentDate)
    //       .add(this.state.selectedDateBan, "d")
    //       .format("YYYY-MM-DD HH:MM:SS");
    
    // user = this.state.users.map(user,index);
    console.log(user);
    console.log(index);
    
    axios
      .post("http://localhost:8084/api/user/banUsers", {
        userId: user.userId,
        userSub: user.userSub,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        roleId: user.roleId,
        dob: user.dob,
        school: user.school,
        isBan: true,
        isBanForever: false,
        bannedUntil: moment(this.state.currentDate)
          .add(this.state.selectedDateBan, "d")
          .format("YYYY-MM-DD HH:MM:SS")
        
      })
      .then(res => {
        axios.get("http://localhost:8084/api/user/allUsers").then(res => {
          this.setState({
            users: res.data
          });
        });
      });
  };

  banForever = user => {
    // const {users} = this.state;
    // const user = users.filter((user, id)=>{
    //   return user.userId==id;
    // })

    axios
      .post("http://localhost:8084/api/user/banForever", {
        userId: user.userId,
        userSub: user.userSub,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        roleId: user.roleId,
        dob: user.dob,
        school: user.school,
        isBan: true,
        isBanForever: true,
        // bannedUntil: this.state.currentDate
        bannedUntil: this.state.currentDate
      })
      .then(res => {
        axios.get("http://localhost:8084/api/user/allUsers").then(res => {
          this.setState({
            users: res.data
          });
        });
      });
  };

  unBanUser = user => {
    axios
      .post("http://localhost:8084/api/user/unBanUsers", {
        userId: user.userId,
        userSub: user.userSub,
        email: user.email,
        fullName: user.fullName,
        phoneNumber: user.phoneNumber,
        gender: user.gender,
        roleId: user.roleId,
        dob: user.dob,
        school: user.school,
        isBan: false,
        isBanForever: false,
        bannedUntil: this.state.currentDate
      })
      .then(res => {
        axios.get("http://localhost:8084/api/user/allUsers").then(res => {
          this.setState({
            users: res.data
          });
        });
      });
  };

  checkBan(user,index) {
    if (user.isBan === false) {
      if (this.state.selectedDateBan === 100) {
        return (
          <td>
            <a href="#banUser" className="modal-trigger">
              <i className="material-icons grey-text text-darken-3">
                not_interested
              </i>
            </a>
            <Modal
              id="banUser"
              options={{ preventScrolling: true }}
              style={{
                width: "40vw",
                height: "45vh",
                overflow: "hidden"
              }}
              actions={[]}
            >
              <div
                className="modal-content"
                style={{
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  left: "0",
                  right:
                    "-17px" /* Increase/Decrease this value for cross-browser compatibility */,
                  overflowY: "scroll"
                }}
              >
                <h5 className="center">Ban người dùng</h5>
                <div className="line" style={{ marginTop: "20px" }}></div>
                <table
                  style={{
                    borderCollapse: "collapse",
                    border: "none"
                  }}
                >
                  <tr>
                    <td
                      style={{
                        marginLeft: "50px"
                      }}
                    >
                      Thời gian ban:
                    </td>
                    
                    <td>
                      <CustomizedSelect
                        handleParentSelect={this.handleSelectChange}
                        items={[
                          { value: 15, text: "15 ngày" },
                          { value: 30, text: "30 ngày" },
                          { value: 60, text: "60 ngày" },
                          { value: 90, text: "90 ngày" },
                          { value: 100, text: "Ban vĩnh viễn" }
                        ]}
                      />
                    </td>
                  </tr>
                </table>
                
                <div className="line"></div>
                <a
                  className="modal-action modal-close black-text lighten-1"
                  style={{ margin: "0 1.5vw", float: "left" }}
                >
                  Hủy thao tác
                </a>

                <a
                  id="buttonBanUser"
                  className="modal-action modal-close blue-text lighten-1"
                  style={{ margin: "0 1.5vw", float: "right" }}
                  onClick={() => this.banForever(user)}
                >
                  Hoàn tất
                </a>
              </div>
            </Modal>
          </td>
        );
      } else {
        return (
          <td>
            <a href="#banUser" className="modal-trigger">
              <i className="material-icons grey-text text-darken-3">
                not_interested
              </i>
            </a>
            <Modal
              id="banUser"
              options={{ preventScrolling: true }}
              style={{
                width: "40vw",
                height: "45vh",
                overflow: "hidden"
              }}
              actions={[]}
            >
              <div
                className="modal-content"
                style={{
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  left: "0",
                  right:
                    "-17px" /* Increase/Decrease this value for cross-browser compatibility */,
                  overflowY: "scroll"
                }}
              >
                <h5 className="center">Ban người dùng</h5>
                <div className="line" style={{ marginTop: "20px" }}></div>
                <table
                  style={{
                    borderCollapse: "collapse",
                    border: "none"
                  }}
                >
                  <tr>
                    <td
                      style={{
                        marginLeft: "50px"
                      }}
                    >
                      Thời gian ban:
                    </td>
                    <td>
                      <CustomizedSelect
                        handleParentSelect={this.handleSelectChange}
                        items={[
                          { value: 15, text: "15 ngày" },
                          { value: 30, text: "30 ngày" },
                          { value: 60, text: "60 ngày" },
                          { value: 90, text: "90 ngày" },
                          { value: 100, text: "Ban vĩnh viễn" }
                        ]}
                      />
                    </td>
                  </tr>
                </table>
                {/* <div className="row" style={{
                marginLeft: "200px"
              }}>
                
                
                
              </div> */}
                <div className="line"></div>
                <a
                  className="modal-action modal-close black-text lighten-1"
                  style={{ margin: "0 1.5vw", float: "left" }}
                >
                  Hủy thao tác
                </a>
                <a
                  id="buttonBanUser"
                  className="modal-action modal-close blue-text lighten-1"
                  style={{ margin: "0 1.5vw", float: "right" }}
                  key ={index}
                  onClick={() => this.banUser(user,index)}
                >
                  Hoàn tất
                </a>
              </div>
            </Modal>
          </td>
        );
      }
    } else {
      if (user.isBanForever === true) {
        return (
          <td>
            <a href="#bannedUser" className="modal-trigger">
              <i
                title={"Người dùng này đang bị ban vĩnh viễn "}
                className="material-icons red-text hover "
              >
                not_interested
              </i>
            </a>
            <Modal
              id="bannedUser"
              options={{ preventScrolling: true }}
              style={{
                width: "30vw",
                height: "30vh",
                overflow: "hidden"
              }}
              actions={[]}
            >
              <div
                className="modal-content"
                style={{
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  left: "0",
                  right:
                    "-17px" /* Increase/Decrease this value for cross-browser compatibility */,
                  overflowY: "scroll"
                }}
              >
                <h5 className="center">Gỡ Ban người dùng</h5>
                <div className="line" style={{ marginTop: "20px" }}></div>
                <div className="row"></div>
                {/* <div className="line"></div> */}
                <a
                  className="modal-action modal-close black-text lighten-1"
                  style={{ margin: "2vh 1.5vw", float: "left" }}
                >
                  Hủy thao tác
                </a>
                <a
                  id="buttonUnBanUser"
                  className="modal-action modal-close blue-text lighten-1"
                  style={{ margin: "2vh 1.5vw", float: "right" }}
                  onClick={() => this.unBanUser(user)}
                >
                  Hoàn tất
                </a>
              </div>
            </Modal>
          </td>
        );
      } else {
        return (
          <td>
            <a href="#bannedUser" className="modal-trigger">
              <i
                title={
                  "Người dùng này đang bị ban đến ngày " +
                  moment(user.bannedUntil).format("DD/MM/YYYY")
                }
                className="material-icons red-text hover "
              >
                not_interested
              </i>
            </a>
            <Modal
              id="bannedUser"
              options={{ preventScrolling: true }}
              style={{
                width: "30vw",
                height: "30vh",
                overflow: "hidden"
              }}
              actions={[]}
            >
              <div
                className="modal-content"
                style={{
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  left: "0",
                  right:
                    "-17px" /* Increase/Decrease this value for cross-browser compatibility */,
                  overflowY: "scroll"
                }}
              >
                <h5 className="center">Gỡ Ban người dùng</h5>
                <div className="line" style={{ marginTop: "20px" }}></div>
                <div className="row"></div>
                {/* <div className="line"></div> */}
                <a
                  className="modal-action modal-close black-text lighten-1"
                  style={{ margin: "2vh 1.5vw", float: "left" }}
                >
                  Hủy thao tác
                </a>
                <a
                  id="buttonUnBanUser"
                  className="modal-action modal-close blue-text lighten-1"
                  style={{ margin: "2vh 1.5vw", float: "right" }}
                  onClick={() => this.unBanUser(user)}
                >
                  Hoàn tất
                </a>
              </div>
            </Modal>
          </td>
        );
      }
    }
  }

  checkRoleId(user) {
    if (user.roleId === 1) {
      return <td></td>;
    } else if (user.roleId === 2) {
      if(user.userSub){
        return (
          <td>
            <i
              className="material-icons blue-text text-darken-3"
              style={{
                marginLeft: "35px"
              }}
            >
              create
            </i>
          </td>
        );
      }
      else{
        return (
          <td>
            <i
              className="material-icons grey-text text-darken-3"
              style={{
                marginLeft: "35px"
              }}
            >
              create
            </i>
          </td>
        );
      }
    } else {
      return (
        <td>
          <i
            className="material-icons grey-text text-darken-3 "
            style={{
              marginRight: "10px"
            }}
          >
            import_contacts
          </i>
          <i
            className="material-icons grey-text text-darken-3"
            style={{
              marginRight: "10px"
            }}
          >
            school
          </i>
          <i
            className="material-icons grey-text text-darken-3 "
            style={{
              marginRight: "10px"
            }}
          >
            people_alt
          </i>
        </td>
      );
    }
  }

  render() {
    const { users } = this.state;
    const { total } = this.state;
    const isBan = this.state.users.map;

    
    return (
      <div className="containerFluid">
        <div className="row s12">
          {/* <div className="col s1"></div> */}
          <div className="marginLeft">
            <div className="header">
              <h5 className="blue-text text-darken-3 bold font-montserrat">
                Tài khoản
              </h5>

              <span>{total} Người dùng</span>
              {/* <button className="float-right" required>Ủy Quyền</button> */}
              <div className="floar-right">
                <div className="inline-block">
                  <a href="#addMod" className="modal-trigger">
                    <i className="material-icons grey-text text-darken-3">
                      how_to_reg
                    </i>
                  </a>
                  {/* actions = {[]} with no element to get rid of default "close" button */}
                  <Modal
                    id="addMod"
                    options={{ preventScrolling: true }}
                    style={{
                      width: "40vw",
                      height: "45vh",
                      overflow: "hidden"
                    }}
                    actions={[]}
                  >
                    <div
                      className="modal-content"
                      style={{
                        position: "absolute",
                        top: "0",
                        bottom: "0",
                        left: "0",
                        right:
                          "-17px" /* Increase/Decrease this value for cross-browser compatibility */,
                        overflowY: "scroll"
                      }}
                    >
                      <h5 className="center">Tạo Moderator</h5>
                      <div className="line" style={{ marginTop: "20px" }}></div>
                      <div className="row">
                        <form
                          className="row col s12"
                          onSubmit={this.handleFormSubmit}
                        >
                          <div className="input-field inline col s12">
                            <input
                              pattern="^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"
                              id="modEmailInput"
                              type="text"
                              className="validate"
                              onChange={this.handleInputChange("email")}
                              value={this.state.addModEmail}
                            />
                            
                            <label
                              htmlFor="modEmailInput"
                              style={{ userSelect: "none" }}
                            >
                              Nhập Email
                            </label>
                          </div>
                        </form>
                      </div>
                      <div className="line"></div>
                      <a
                        className="modal-action modal-close black-text lighten-1"
                        style={{ margin: "0 1.5vw", float: "left" }}
                      >
                        Hủy thao tác
                      </a>
                      <a
                        id="buttonAddMod"
                        className="modal-action modal-close blue-text lighten-1"
                        style={{ margin: "0 1.5vw", float: "right" }}
                        onClick={() => this.addMod(2)}
                      >
                        Hoàn tất
                      </a>
                    </div>
                  </Modal>
                </div>
              </div>
              <table className="menuTable">
                <tr>
                  <th className="blue-text text-darken-3 bold font-montserrat">
                    Loại người dùng
                  </th>
                  <th>
                    <CustomizedSelect
                      items={[
                        { value: 1, text: "Giáo Viên" },
                        { value: 2, text: "Học Sinh" },
                        { value: 3, text: "Phụ Huynh" },
                        { value: 4, text: "Moderator" }
                      ]}
                    />
                  </th>

                  <th>
                    <input
                      type="text"
                      placeholder="Tìm kiếm người dùng..."
                    ></input>
                  </th>
                </tr>
              </table>
            </div>

            <table className="table">
              <tr className="setBlue">
                <th>
                  <Checkbox></Checkbox>
                </th>
                <th>E-mail</th>
                <th>Chức năng</th>
                <th>Tên hiển thị</th>
                <th></th>
              </tr>
              {users.map((user,index ) => {
                return (
                  <tr key={user.id}>
                    <td>
                      <Checkbox></Checkbox>
                    </td>
                    <td>{user.email}</td>
                    {this.checkRoleId(user)}
                    <td>{user.fullName}</td>
                    {this.checkBan(user,index)}
                    
                  </tr>
                );
              })
              }
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default UserManagemnt;
