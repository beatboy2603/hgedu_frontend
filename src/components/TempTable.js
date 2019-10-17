import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
}));

function createData(code, content, hardness, level, thuoctinh) {
  return { code, content, hardness, level, thuoctinh };
}

const rows = [
  createData('VC00001', "Câu này đúng hay sai", 1, "Lớp 12", "Lý thuyết"),
  createData('VC00002', "HG Education được thành lập vào năm nào", 1, "Lớp 12", "Lý thuyết"),
  createData('VC00003', "ABCD", 3, "Lớp 1", "Thực hành"),
  createData('VC00004', "Doctor Strange", 2, "Marvel Class", "Lý thuyết"),
];

export default function SimpleTable() {
  const classes = useStyles();

  return (
    <Paper className={classes.root}>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell style={{color: "#086bd1", paddingLeft:"30px"}}><span className="bold font-montserrat font-size-15">Mã câu</span></TableCell>
            <TableCell style={{color: "#086bd1"}}><span className="bold font-montserrat font-size-15">Câu hỏi</span></TableCell>
            <TableCell style={{color: "#086bd1"}}><span className="bold font-montserrat font-size-15">Mức khó</span></TableCell>
            <TableCell style={{color: "#086bd1"}}><span className="bold font-montserrat font-size-15">Trình độ</span></TableCell>
            <TableCell style={{color: "#086bd1"}}><span className="bold font-montserrat font-size-15">Thuộc tính</span></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.code}>
              <TableCell component="th" scope="row" style={{paddingLeft:"30px"}}><span className="font-effra font-size-18 grey-text text-darken-3">{row.code}</span></TableCell>
              <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.content}</span></TableCell>
              <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.hardness}</span></TableCell>
              <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.level}</span></TableCell>
              <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.thuoctinh}</span></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}