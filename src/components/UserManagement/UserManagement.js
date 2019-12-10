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
      currentDate: date
    };
    this.checkRoleId = this.checkRoleId.bind(this);
    this.checkBan = this.checkBan.bind(this);
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

    axios.get("http://localhost:8084/api/user/banUsers").then(res => {
      console.log(res.data + "as");
      this.setState({
        ...this.state,
        ban: res.data
      });
    });

    // axios.post("http://localhost:8084/api/user/addMod").then(res => {
    //   console.log(res.data + "as");
    //   this.setState({
    //     ...this.state,
    //     ban: res.data
    //   });
    // });
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
    // if (this.state.addModEmail) {
    axios
      .post("http://localhost:8084/api/user/addMod", {
        email: this.state.addModEmail,
        roleId: 2
      })
      .then(res => {
        axios.get("http://localhost:8084/api/user/allUsers").then(res => {
          console.log("all");
          console.log(res.data);
          this.setState({
            users: res.data
          });
        });
      });
    // }
  };

  upPremium = (user_subcription) => {
    axios.post("http://localhost:8084/api/user/upPremium", {
      subcriptionId: 1,
      userId: user_subcription.userId,
      status: true,
      expired_date: moment(this.state.currentDate)
        .add(this.state.selectedDatePremium, "d")
        .format("YYYY-MM-DD HH:MM:SS"),
      userRoleId: 1
    }).then(res =>{
      axios.get("http://localhost:8084/api/user/allUsers").then(res => {
          console.log("all");
          console.log(res.data);
          this.setState({
            users: res.data
          });
        });
    });
  };

  banUser = user => {
    // const {users} = this.state;
    // const user = users.filter((user, id)=>{
    //   return user.userId==id;
    // })

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
        // bannedUntil: this.state.currentDate
        bannedUntil: moment(this.state.currentDate)
          .add(this.state.selectedDateBan, "d")
          .format("YYYY-MM-DD HH:MM:SS")
      })
      .then(res => {
        axios.get("http://localhost:8084/api/user/allUsers").then(res => {
          console.log("all");
          console.log(res.data);
          this.setState({
            users: res.data
          });
        });
      });
  };

  banForever = (user) => {
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
          console.log("all");
          console.log(res.data);
          this.setState({
            users: res.data
          });
        });
      });
  };

  unBanUser = user => {
    console.log(user);
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
          console.log("all");
          console.log(res.data);
          this.setState({
            users: res.data
          });
        });
      });
  };

  checkBan(user) {
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
                  onClick={() => this.banUser(user)}
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


  checkRoleId(user,user_subcription) {
    if (user.roleId === 1) {
      return <td></td>;
    } else if (user.roleId === 2) {
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
    } else {
      if(user_subcription.userRoleId === 1 && user_subcription.status === true)
      {
        return (
          <td>
            <a href="#upTeacher" className="modal-trigger icon">
              <i title={"Người dùng này còn Premium đến ngày " +
                    moment(user_subcription.expired_date).format("DD/MM/YYYY")} className="material-icons blue-text ">
                import_contacts
              </i>
            </a>
            <Modal
              id="upTeacher"
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
                <h5 className="center">Nâng Cấp Premium Giáo Viên</h5>
                <div className="line" style={{ marginTop: "20px" }}></div>
                {/* <div className="row">
                  <Select value="0">
                    <option value="0" disabled selected>
                      Thời gian
                    </option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                  </Select>
                </div> */}
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
                      Thời gian nâng cấp Premium:
                    </td>
                    <td>
                      <CustomizedSelect
                        handleParentSelect={this.handleSelectChangePremium}
                        items={[
                          { value: 15, text: "15 ngày" },
                          { value: 30, text: "30 ngày" },
                          { value: 60, text: "60 ngày" },
                          { value: 90, text: "90 ngày" }
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
                  id="buttonAddFolder"
                  className="modal-action modal-close blue-text lighten-1"
                  style={{ margin: "0 1.5vw", float: "right" }}
                  onClick={() => this.upPremium(user_subcription)}
                >
                  Hoàn tất
                </a>
              </div>
            </Modal>
            <a href="#upStudent" className="modal-trigger icon">
              <i className="material-icons grey-text text-darken-3">school</i>
            </a>
            <Modal
              id="upStudent"
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
                <h5 className="center">Nâng Cấp Premium Học Sinh</h5>
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
                      Thời gian nâng cấp Premium:
                    </td>
                    <td>
                      <CustomizedSelect
                        handleParentSelect={this.handleSelectChange}
                        items={[
                          { value: 15, text: "15 ngày" },
                          { value: 30, text: "30 ngày" },
                          { value: 60, text: "60 ngày" },
                          { value: 90, text: "90 ngày" }
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
                  id="buttonAddFolder"
                  className="modal-action modal-close blue-text lighten-1"
                  style={{ margin: "0 1.5vw", float: "right" }}
                >
                  Hoàn tất
                </a>
              </div>
            </Modal>
            <a href="#upParents" className="modal-trigger icon">
              <i className="material-icons grey-text text-darken-3">people_alt</i>
            </a>
            <Modal
              id="upParents"
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
                <h5 className="center">Nâng Cấp Premium Phụ Huynh</h5>
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
                      Thời gian nâng cấp Premium:
                    </td>
                    <td>
                      <CustomizedSelect
                        handleParentSelect={this.handleSelectChange}
                        items={[
                          { value: 15, text: "15 ngày" },
                          { value: 30, text: "30 ngày" },
                          { value: 60, text: "60 ngày" },
                          { value: 90, text: "90 ngày" }
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
                  id="buttonAddFolder"
                  className="modal-action modal-close blue-text lighten-1"
                  style={{ margin: "0 1.5vw", float: "right" }}
                >
                  Hoàn tất
                </a>
              </div>
            </Modal>
          </td>
        );
      }
      else{
        return (
          <td>
            <a href="#upTeacher" className="modal-trigger icon">
              <i className="material-icons grey-text text-darken-3">
                import_contacts
              </i>
            </a>
            <Modal
              id="upTeacher"
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
                <h5 className="center">Nâng Cấp Premium Giáo Viên</h5>
                <div className="line" style={{ marginTop: "20px" }}></div>
                {/* <div className="row">
                  <Select value="0">
                    <option value="0" disabled selected>
                      Thời gian
                    </option>
                    <option value="15">15</option>
                    <option value="30">30</option>
                    <option value="60">60</option>
                    <option value="90">90</option>
                  </Select>
                </div> */}
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
                      Thời gian nâng cấp Premium:
                    </td>
                    <td>
                      <CustomizedSelect
                        handleParentSelect={this.handleSelectChangePremium}
                        items={[
                          { value: 15, text: "15 ngày" },
                          { value: 30, text: "30 ngày" },
                          { value: 60, text: "60 ngày" },
                          { value: 90, text: "90 ngày" }
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
                  id="buttonAddFolder"
                  className="modal-action modal-close blue-text lighten-1"
                  style={{ margin: "0 1.5vw", float: "right" }}
                  onClick={() => this.upPremium(user,user_subcription)}
                >
                  Hoàn tất
                </a>
              </div>
            </Modal>
            <a href="#upStudent" className="modal-trigger icon">
              <i className="material-icons grey-text text-darken-3">school</i>
            </a>
            <Modal
              id="upStudent"
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
                <h5 className="center">Nâng Cấp Premium Học Sinh</h5>
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
                      Thời gian nâng cấp Premium:
                    </td>
                    <td>
                      <CustomizedSelect
                        handleParentSelect={this.handleSelectChange}
                        items={[
                          { value: 15, text: "15 ngày" },
                          { value: 30, text: "30 ngày" },
                          { value: 60, text: "60 ngày" },
                          { value: 90, text: "90 ngày" }
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
                  id="buttonAddFolder"
                  className="modal-action modal-close blue-text lighten-1"
                  style={{ margin: "0 1.5vw", float: "right" }}
                >
                  Hoàn tất
                </a>
              </div>
            </Modal>
            <a href="#upParents" className="modal-trigger icon">
              <i className="material-icons grey-text text-darken-3">people_alt</i>
            </a>
            <Modal
              id="upParents"
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
                <h5 className="center">Nâng Cấp Premium Phụ Huynh</h5>
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
                      Thời gian nâng cấp Premium:
                    </td>
                    <td>
                      <CustomizedSelect
                        handleParentSelect={this.handleSelectChange}
                        items={[
                          { value: 15, text: "15 ngày" },
                          { value: 30, text: "30 ngày" },
                          { value: 60, text: "60 ngày" },
                          { value: 90, text: "90 ngày" }
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
                  id="buttonAddFolder"
                  className="modal-action modal-close blue-text lighten-1"
                  style={{ margin: "0 1.5vw", float: "right" }}
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

  render() {
    const { users } = this.state;
    const { total } = this.state;
    

    const iconColor = {
      color: "#3A3A3A"
    };
    const lineSpacing = {
      marginTop: "25px"
    };
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
                    {/* <div className="col s3">
                      <Select value="0">
                        <option value="0" disabled selected>
                          Tất cả
                        </option>
                        <option value="1">Giáo Viên</option>
                        <option value="2">Học Sinh</option>
                        <option value="3">Phụ Huynh</option>
                        <option value="4">Moderator</option>
                      </Select>
                    </div> */}
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
              {users.map((user,user_subcription) => {
                return (
                  <tr key={user.id} >
                    <td>
                      <Checkbox></Checkbox>
                    </td>
                    <td>{user.email}</td>
                    {this.checkRoleId(user,user_subcription)}
                    <td>{user.fullName}</td>
                    {this.checkBan(user)}
                  </tr>
                );
              })
              /* {<tr>
                                <td><Checkbox checked="check"></Checkbox></td>
                                <td>abc@gmail.com</td>
                                <td>Teacher</td>
                                <td className="setBlue">VIP</td>
                                <td>Phan Hữu Đức</td>
                            </tr>} */
              }
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default UserManagemnt;
