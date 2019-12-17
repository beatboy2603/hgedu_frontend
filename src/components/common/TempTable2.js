import React from "react";
import { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import { Modal } from "react-materialize";
import WarningRoundedIcon from "@material-ui/icons/WarningRounded";

const useStyles = makeStyles(theme => ({
  root: {
    width: "100%",
    marginTop: theme.spacing(3),
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  },
  margin: {
    margin: theme.spacing(0.5)
  },
  table1: {
    border: "1px solid #AAAAAA",
    textAlign: "center",
    fontWeight: "300",
    fontSize: "15px"
  }
}));

export default function SimpleTable(props) {
  const classes = useStyles();

  const {
    data,
    deleteStudent,
    getGrade,
    classStudent,
    grade,
    parent,
    getParent,
    role,
    classOfStudent,
    connectedStudent,
    exams
  } = props;

  const [modalName, setName] = useState(0);

  const over = test => {
    document.getElementById(test).querySelector(".deleteBtn").style.visibility =
      "visible";
  };

  const out = test => {
    document.getElementById(test).querySelector(".deleteBtn").style.visibility =
      "hidden";
  };

  const examCheck = classId => {
    let currentDate = new Date().getTime();
    let check = 0;
    let check2 = 0;
    exams
      .filter(exam => {
        return exam[5] == classId;
      })
      .map(item => {
        if ((item[2] - currentDate) < 432000000) {
          check++;
          if ((item[2] - currentDate) < 172800000) {
            check2++;
          }
        }
        return;
      });
    if (check > 0) {
      if (check2 > 0) {
        return (<WarningRoundedIcon style={{color: "red"}}/>);
      } else {
        return (<WarningRoundedIcon style={{color: "orange"}}/>);
      }
      
    }
  };

  const studentClickHandle = (index, id, classStudentId) => {
    // console.log("GRADE", grade[0].value)
    getGrade(classStudentId);
    if (role === 1) {
      getParent(id);
    }

    document
      .getElementById(id)
      .querySelector("#showInfo" + index)
      .click();
    setName(index);
    if (role === 2) {
    }
  };

  const deleteStudentHandle = (id, e) => {
    e.stopPropagation();
    deleteStudent(id);
  };

  return (
    <Paper className={classes.root}>
      {role === 1 ? (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>
                <span className="blue-text bold font-effra font-size-15"></span>
              </TableCell>
              <TableCell>
                <span className="blue-text bold font-effra font-size-15">
                  Tên học sinh
                </span>
              </TableCell>
              <TableCell>
                <span className="blue-text bold font-effra font-size-15">
                  Năm sinh
                </span>
              </TableCell>
              <TableCell>
                <span className="blue-text bold font-effra font-size-15">
                  Số điện thoại
                </span>
              </TableCell>
              <TableCell>
                <span className="blue-text bold font-effra font-size-15"></span>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={index}
                onMouseOver={() => {
                  over(row.userId);
                }}
                onMouseOut={() => {
                  out(row.userId);
                }}
                id={row.userId}
                onClick={e => {
                  studentClickHandle(
                    index,
                    row.userId,
                    classStudent[index].id,

                    e
                  );
                }}
              >
                <a
                  style={{ display: "none" }}
                  id={"showInfo" + index}
                  href="#showInformation"
                  className="modal-trigger"
                ></a>
                <TableCell component="th" scope="row">
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {index + 1}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {row.fullName}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {row.dob
                      ? new Date(row.dob).toLocaleString("vi-VN").split(" ")[1]
                      : "Chưa rõ"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {row.phoneNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <Button size="small" stype={{ padding: "0" }}>
                    <span
                      style={{ textTransform: "none", visibility: "hidden" }}
                      className="deleteBtn font-effra font-size-18 red-text text-lighten-1"
                      onClick={e => {
                        deleteStudentHandle(row.userId, e);
                      }}
                    >
                      Xóa khỏi lớp
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            <Modal
              id="showInformation"
              options={{ preventScrolling: true }}
              actions={[]}
              style={{
                width: "30%",
                height: "80%",
                maxHeight: "80%",
                borderRadius: "15px"
              }}
            >
              <div
                className="modal-content"
                style={{
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  overflowY: "scroll"
                }}
              >
                <h5 className="center">{data[modalName].fullName}</h5>
                <div style={{ marginTop: "30px" }} className="line"></div>
                <div>
                  <p className="blue-text bold font-effra font-size-15 text-darken-3">
                    Bảng điểm
                  </p>
                  <p>Điểm hệ số</p>
                  <table>
                    <tr>
                      <th className={classes.table1}>Hệ số I</th>
                      <th className={classes.table1}>Hệ số II</th>
                      <th className={classes.table1}>Hệ số III</th>
                    </tr>
                    <tr>
                      <td className={classes.table1}>
                        {grade && grade[0] ? grade[0].value : ""}
                      </td>
                      <td className={classes.table1}>
                        {grade && grade[1] ? grade[1].value : ""}
                      </td>
                      <td className={classes.table1}>
                        {grade && grade[2] ? grade[2].value : ""}
                      </td>
                    </tr>
                  </table>
                </div>
                <div style={{ marginTop: "30px" }} className="line"></div>
                <div>
                  <p className="blue-text bold font-effra font-size-15 text-darken-3">
                    Thông tin học sinh
                  </p>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Tên học sinh:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {data[modalName].fullName}
                    </p>
                  </div>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Email:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {data[modalName].email}
                    </p>
                  </div>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Ngày sinh:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {data[modalName].dob
                        ? new Date(data[modalName].dob)
                            .toLocaleString("vi-VN")
                            .split(" ")[1]
                        : "Chưa rõ"}
                    </p>
                  </div>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Điện thoại:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {data[modalName].phoneNumber
                        ? data[modalName].phoneNumber
                        : "Chưa rõ"}
                    </p>
                  </div>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Trường:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {data[modalName].school
                        ? data[modalName].school
                        : "Chưa rõ"}
                    </p>
                  </div>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Giới tính:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {data[modalName].gender ? "Nam" : "Nữ"}
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: "30px" }} className="line"></div>
                <div>
                  <p className="blue-text bold font-effra font-size-15 text-darken-3">
                    Thông tin phụ huynh
                  </p>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Tên phụ huynh:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {parent ? parent.fullName : "Chưa có"}
                    </p>
                  </div>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Email:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {parent ? parent.email : "Chưa có"}
                    </p>
                  </div>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Số điện thoại:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {parent ? parent.phoneNumber : "Chưa có"}
                    </p>
                  </div>
                </div>
              </div>
            </Modal>
          </TableBody>
        </Table>
      ) : (
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>
                <span className="blue-text bold font-effra font-size-15"></span>
              </TableCell>
              <TableCell>
                <span className="blue-text bold font-effra font-size-15">
                  Tên lớp học
                </span>
              </TableCell>
              <TableCell>
                <span className="blue-text bold font-effra font-size-15">
                  Tên giáo viên
                </span>
              </TableCell>
              <TableCell>
                <span className="blue-text bold font-effra font-size-15">
                  Trường
                </span>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {classOfStudent.map((row, index) => (
              <TableRow
                key={index}
                id={row.id}
                onClick={e => {
                  studentClickHandle(index, row.id, classStudent[index].id, e);
                }}
              >
                <a
                  style={{ display: "none" }}
                  id={"showInfo" + index}
                  href="#showInformation"
                  className="modal-trigger"
                ></a>

                <TableCell component="th" scope="row">
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {index + 1}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {row.name}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {connectedStudent[index] &&
                      connectedStudent[index].fullName}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {connectedStudent[index] && connectedStudent[index].school
                      ? connectedStudent[index].school
                      : "Chưa rõ"}
                  </span>
                </TableCell>
                <TableCell>
                  {examCheck(classStudent[index].classId)}
                </TableCell>
              </TableRow>
            ))}
            <Modal
              id="showInformation"
              options={{ preventScrolling: true }}
              actions={[]}
              style={{
                width: "30%",
                height: "80%",
                maxHeight: "80%",
                borderRadius: "15px"
              }}
            >
              <div
                className="modal-content"
                style={{
                  position: "absolute",
                  top: "0",
                  bottom: "0",
                  left: "0",
                  right: "0",
                  overflowY: "scroll"
                }}
              >
                <h5 className="center">{classOfStudent[modalName].name}</h5>
                <div style={{ marginTop: "30px" }} className="line"></div>
                <div>
                  <p className="blue-text bold font-effra font-size-15 text-darken-3">
                    Bảng điểm
                  </p>
                  <p>Điểm hệ số</p>
                  <table>
                    <tr>
                      <th className={classes.table1}>Hệ số I</th>
                      <th className={classes.table1}>Hệ số II</th>
                      <th className={classes.table1}>Hệ số III</th>
                    </tr>
                    <tr>
                      <td className={classes.table1}>
                        {grade && grade[0] ? grade[0].value : ""}
                      </td>
                      <td className={classes.table1}>
                        {grade && grade[1] ? grade[1].value : ""}
                      </td>
                      <td className={classes.table1}>
                        {grade && grade[2] ? grade[2].value : ""}
                      </td>
                    </tr>
                  </table>
                </div>
                <div style={{ marginTop: "30px" }} className="line"></div>
                <div>
                  <p className="blue-text bold font-effra font-size-15 text-darken-3">
                    Thông tin giáo viên
                  </p>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Tên giáo viên:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {connectedStudent[modalName] &&
                        connectedStudent[modalName].fullName &&
                        connectedStudent[modalName].fullName}
                    </p>
                  </div>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Email:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {connectedStudent[modalName] &&
                        connectedStudent[modalName].email &&
                        connectedStudent[modalName].email}
                    </p>
                  </div>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Ngày sinh:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {connectedStudent[modalName] &&
                      connectedStudent[modalName].dob
                        ? new Date(connectedStudent[modalName].dob)
                            .toLocaleString("vi-VN")
                            .split(" ")[1]
                        : "Chưa rõ"}
                    </p>
                  </div>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Điện thoại:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {connectedStudent[modalName] &&
                      connectedStudent[modalName].phoneNumber
                        ? connectedStudent[modalName].phoneNumber
                        : "Chưa rõ"}
                    </p>
                  </div>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Trường:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {connectedStudent[modalName] &&
                      connectedStudent[modalName].school
                        ? connectedStudent[modalName].school
                        : "Chưa rõ"}
                    </p>
                  </div>
                  <div className="row">
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s5 font-effra font-size-15"
                    >
                      Giới tính:
                    </p>
                    <p
                      style={{ padding: "0", margin: "0" }}
                      className="col s7 font-effra font-size-15"
                    >
                      {connectedStudent[modalName] &&
                      connectedStudent[modalName].gender
                        ? "Nam"
                        : "Nữ"}
                    </p>
                  </div>
                </div>
              </div>
            </Modal>
          </TableBody>
        </Table>
      )}
    </Paper>
  );
}
