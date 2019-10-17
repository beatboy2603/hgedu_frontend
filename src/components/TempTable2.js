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

function createData(code, name, status, dob, grade) {
    return { code, name, status, dob, grade };
}

const rows = [
    createData('01', 'Đây là chỗ để tên', ['Student', 'Parent'], "19xx", "Anh-lẻ-ca-2"),
    createData('02', 'Đây là chỗ để tên', ['Student', 'Parent'], "19xx", "Anh-lẻ-ca-2"),
    createData('03', 'Đây là chỗ để tên', ['Student', 'Parent'], "19xx", "Anh-lẻ-ca-2"),
    createData('04', 'Đây là chỗ để tên', ['Student', 'Parent'], "19xx", "Anh-lẻ-ca-2"),
    createData('05', 'Đây là chỗ để tên', ['Student', 'Parent'], "19xx", "Anh-lẻ-ca-2"),
    createData('06', 'Đây là chỗ để tên', ['Student', 'Parent'], "19xx", "Anh-lẻ-ca-2"),
    createData('07', 'Đây là chỗ để tên', ['Student', 'Parent'], "19xx", "Anh-lẻ-ca-2"),
    createData('08', 'Đây là chỗ để tên', ['Student', 'Parent'], "19xx", "Anh-lẻ-ca-2"),
];

export default function SimpleTable() {
    const classes = useStyles();

    return (
        <Paper className={classes.root}>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell><span className="blue-text bold font-effra font-size-15"></span></TableCell>
                        <TableCell><span className="blue-text bold font-effra font-size-15">Tên học sinh</span></TableCell>
                        <TableCell><span className="blue-text bold font-effra font-size-15"></span></TableCell>
                        <TableCell><span className="blue-text bold font-effra font-size-15">Năm sinh</span></TableCell>
                        <TableCell><span className="blue-text bold font-effra font-size-15">Lớp</span></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => (
                        <TableRow key={row.code}>
                            <TableCell component="th" scope="row"><span className="font-effra font-size-18 grey-text text-darken-3">{row.code}</span></TableCell>
                            <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.name}</span></TableCell>
                            {/* <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.status}</span></TableCell> */}
                            <TableCell>
                                <i className="material-icons" style={{marginRight:"10px"}}>school</i>
                                <i className="material-icons">supervisor_account</i>
                            </TableCell>
                            <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.dob}</span></TableCell>
                            <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.grade}</span></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </Paper>
    );
}