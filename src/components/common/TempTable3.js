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

export default function SimpleTable2(props) {
  const classes = useStyles();

  const {
    data,
    deleteStudent,
    parent,
    getParent,
    connectedStudent,
    role,
    classOfStudent
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

  const studentClickHandle = (index, id, classStudentId) => {
    document
      .getElementById(id)
      .querySelector("#showInfo" + index)
      .click();
    setName(index);
  };

  console.log("ROle", role);

  const deleteStudentHandle = (id, e) => {
    e.stopPropagation();
    deleteStudent(id);
  };

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell>
              <span className="blue-text bold font-effra font-size-15"></span>
            </TableCell>
            <TableCell>
              {role == 1 ? (
                <span className="blue-text bold font-effra font-size-15">
                  Tên học sinh
                </span>
              ) : (
                <span className="blue-text bold font-effra font-size-15">
                  Tên giáo viên
                </span>
              )}
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
            {role === 1 ? (
              <TableCell>
                <span className="blue-text bold font-effra font-size-15"></span>
              </TableCell>
            ) : (
              <TableCell>
                <span className="blue-text bold font-effra font-size-15">
                  Trường
                </span>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        {role === 1 ? (
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={index}
                id={index}
                onMouseOver={() => {
                  over(index);
                }}
                onMouseOut={() => {
                  out(index);
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
                    {row.displayedName
                      ? row.displayedName
                      : connectedStudent[index] &&
                        connectedStudent[index].fullName}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {connectedStudent[index] && connectedStudent[index].dob
                      ? new Date(connectedStudent[index].dob)
                          .toLocaleString("vi-VN")
                          .split(" ")[1]
                      : "Chưa rõ"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {connectedStudent[index] &&
                    connectedStudent[index].phoneNumber
                      ? connectedStudent[index].phoneNumber
                      : "Chưa rõ"}
                  </span>
                </TableCell>
                <TableCell>
                  <Button size="small" stype={{ padding: "0" }}>
                    <span
                      style={{ textTransform: "none", visibility: "hidden" }}
                      className="deleteBtn font-effra font-size-18 red-text text-lighten-1"
                      onClick={e => {
                        deleteStudentHandle(row.studentId, e);
                      }}
                    >
                      Xóa khỏi lớp
                    </span>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        ) : (
          <TableBody>
            {data.map((row, index) => (
              <TableRow
                key={index}
                id={index}
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
                    {connectedStudent[index] && connectedStudent[index].fullName && connectedStudent[index].fullName}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {connectedStudent[index] && connectedStudent[index].dob
                      ? new Date(connectedStudent[index].dob)
                          .toLocaleString("vi-VN")
                          .split(" ")[1]
                      : "Chưa rõ"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {connectedStudent[index] &&
                    connectedStudent[index].phoneNumber
                      ? connectedStudent[index].phoneNumber
                      : "Chưa rõ"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-effra font-size-18 grey-text text-darken-3">
                    {connectedStudent[index] &&
                    connectedStudent[index].school
                      ? connectedStudent[index].school
                      : "Chưa rõ"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        )}
      </Table>
    </Paper>
  );
}
