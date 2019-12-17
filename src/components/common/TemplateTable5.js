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

export default function SimpleTable5(props) {
  const classes = useStyles();

  const { rowData, getGrade, grade } = props;

  const [modalName, setName] = useState(0);

  const teacherClickHandle = (index, id, classStudentId) => {
    // console.log("GRADE", grade[0].value)
    getGrade(classStudentId);
    // if (role === 1) {
    //   getParent(id);
    // }

    document
      .getElementById(id)
      .querySelector("#showInfo" + index)
      .click();
    setName(index);
  };

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          {}
          <TableRow>
            <TableCell>
              <span className="blue-text bold font-effra font-size-15"></span>
            </TableCell>
            <TableCell>
              <span className="blue-text bold font-effra font-size-15">
                Tên lớp
              </span>
            </TableCell>
            <TableCell>
              <span className="blue-text bold font-effra font-size-15">
                Tên giáo viên
              </span>
            </TableCell>
            <TableCell>
              <span className="blue-text bold font-effra font-size-15">
                Số điện thoại
              </span>
            </TableCell>
            <TableCell>
              <span className="blue-text bold font-effra font-size-15">
                  Trường
              </span>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rowData.map((row, index) => (
            <TableRow
              key={index}
              id={row[3]} 
              onClick={() => teacherClickHandle(index, row[3], row[9])}      
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
                  {row[8]}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-effra font-size-18 grey-text text-darken-3">
                  {row[0]}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-effra font-size-18 grey-text text-darken-3">
                  {row[4]}
                </span>
              </TableCell>
              <TableCell>
              <span className="font-effra font-size-18 grey-text text-darken-3">
                  {row[5]}
                </span>
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
              <h5 className="center">{rowData && rowData[modalName] && rowData[modalName][8]}</h5>
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
                    <td className={classes.table1}>{grade && grade[0] ? grade[0].value : ""}</td>
                    <td className={classes.table1}>{grade && grade[1] ? grade[1].value : ""}</td>
                    <td className={classes.table1}>{grade && grade[2] ? grade[2].value : ""}</td>
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
                    {rowData[modalName] && rowData[modalName][0]}
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
                    {rowData[modalName] && rowData[modalName][6]} 
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
                    {rowData[modalName] && rowData[modalName][4] ? rowData[modalName][4] : "Chưa rõ"}
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
                    {rowData[modalName] && rowData[modalName][8] ? rowData[modalName][8] : "Chưa rõ"}
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
                    {rowData[modalName] && rowData[modalName][1] ? "Nam" : "Nữa"}
                  </p>
                </div>
              </div>
            </div>
          </Modal>
        </TableBody>
      </Table>
    </Paper>
  );
}
