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
import CheckIcon from "@material-ui/icons/Check";
import ClearIcon from "@material-ui/icons/Clear";
import AddIcon from "@material-ui/icons/Add";

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

export default function SimpleTable4(props) {
  const classes = useStyles();

  const { data, deleteStudent, parent, getParent, connectedStudent, filterStudentTeacher } = props;

  const [modalName, setName] = useState(0);

  const onUnCheckClick = (index, id) => {
    document.getElementById(id).querySelector(".addIcon").style.display = "block"; 
    document.getElementById(id).querySelector(".unCheckIcon").style.display = "none";
    filterStudentTeacher[index].status = false;
    console.log("Batsu", filterStudentTeacher[index]);
  };
  const onAddClick = (index, id) => {
    document.getElementById(id).querySelector(".addIcon").style.display = "none"; 
    document.getElementById(id).querySelector(".unCheckIcon").style.display = "block";
    filterStudentTeacher[index].status = true;
    console.log("Plus", filterStudentTeacher[index]);
  };

  const studentClickHandle = (index, id, classStudentId) => {
    document
      .getElementById(id)
      .querySelector("#showInfo" + index)
      .click();
    setName(index);
  };

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
                <span className="blue-text bold font-effra font-size-15">
                  Tên học sinh
                </span>
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow key={index} id={index + "addModal"}>
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
                <AddIcon
                  className="addIcon"
                  style={{ display: "block", color: "green" }}
                  onClick={() => onAddClick(index, index + "addModal")}
                />
                <ClearIcon
                  className="unCheckIcon"
                  style={{ display: "none", color: "red" }}
                  onClick={() => onUnCheckClick(index, index + "addModal")}
                />
              </TableCell>
            </TableRow>
          ))}
          
        </TableBody>
      </Table>
    </Paper>
  );
}
