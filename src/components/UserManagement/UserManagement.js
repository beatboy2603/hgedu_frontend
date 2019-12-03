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
      users: [],
      addModEmail: null
    };
    this.checkRoleId = this.checkRoleId.bind(this);
    this.checkBan = this.checkBan.bind(this);
  }

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
    if (source == "email") {
      this.setState({
        addModEmail: e.target.value
      });
    }
  };

  addMod = type => {
    // if (this.state.addModEmail) {
      axios.post("http://localhost:8084/api/user/addMod", {
        email: this.state.addModEmail,
        roleId: 2
      }).then(res=>{
        console.log(res);
      });
    // }
  };

  checkBan(isBan, bannedUntil) {
    if (isBan === false) {
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
              <div className="row">
                <Select value="0">
                  <option value="0" disabled selected>
                    Thời gian
                  </option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                  <option value="100">Ban vĩnh viễn</option>
                </Select>
              </div>
              {/* <div className="line"></div> */}
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
            <i className="material-icons red-text ">not_interested</i>
          </a>
          <Modal
            id="bannedUser"
            options={{ preventScrolling: true }}
            style={{
              width: "40vw",
              height: "40vh",
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
              <div className="row">
                <a href="#unBanUser" className="modal-trigger">
                  Gỡ Ban
                </a>
                <Modal
                  id="unBanUser"
                  options={{ preventScrolling: true }}
                  style={{
                    width: "30vw",
                    height: "20vh",
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
                    <h5 className="center">Xác nhận gỡ Ban người dùng</h5>
                    <div className="line" style={{ marginTop: "10px" }}></div>
                    <div className="row"></div>
                    {/* <div className="line"></div> */}
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
                <p>Người dùng này đang bị ban đến ngày: </p>
                {bannedUntil}
              </div>
              <div className="line"></div>
              <a
                className="modal-action modal-close black-text lighten-1"
                style={{ margin: "2vh 1.5vw", float: "left" }}
              >
                Hủy thao tác
              </a>
              <a
                id="buttonAddFolder"
                className="modal-action modal-close blue-text lighten-1"
                style={{ margin: "2vh 1.5vw", float: "right" }}
              >
                Hoàn tất
              </a>
            </div>
          </Modal>
        </td>
      );
    }
  }

  checkRoleId(roleId) {
    if (roleId === 1) {
      return <td></td>;
    } else if (roleId === 2) {
      return (
        <td>
          <i
            className="material-icons blue-text text-darken-3"
            style={{
              marginLeft: "33px"
            }}
          >
            create
          </i>
        </td>
      );
    } else {
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
              <div className="row">
                <Select value="0">
                  <option value="0" disabled selected>
                    Thời gian
                  </option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                </Select>
              </div>
              {/* <div className="line"></div> */}
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
              <div className="row">
                <Select value="0">
                  <option value="0" disabled selected>
                    Thời gian
                  </option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                </Select>
              </div>
              {/* <div className="line"></div> */}
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
              <div className="row">
                <Select value="0">
                  <option value="0" disabled selected>
                    Thời gian
                  </option>
                  <option value="15">15</option>
                  <option value="30">30</option>
                  <option value="60">60</option>
                  <option value="90">90</option>
                </Select>
              </div>
              {/* <div className="line"></div> */}
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
        <button onClick={()=>{console.log(this.state)}}>click me</button>
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
                      {/* <div className="line"></div> */}
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
                    <div className="col s3">
                      <Select value="0">
                        <option value="0" disabled selected>
                          Tất cả
                        </option>
                        <option value="1">Giáo Viên</option>
                        <option value="2">Học Sinh</option>
                        <option value="3">Phụ Huynh</option>
                        <option value="4">Moderator</option>
                      </Select>
                    </div>
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
              {users.map(user => {
                return (
                  <tr key={user.id} className="hover">
                    <td>
                      <Checkbox></Checkbox>
                    </td>
                    <td>{user.email}</td>
                    {this.checkRoleId(user.roleId)}
                    <td>{user.fullName}</td>
                    {this.checkBan(user.isBan, user.bannedUntil)}
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
