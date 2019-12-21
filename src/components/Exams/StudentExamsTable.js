import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from 'react-materialize/lib/Button';
import { Modal } from 'react-materialize';
import { Link } from 'react-router-dom';

// const useStyles = makeStyles(theme => ({
//     root: {
//         width: '100%',
//         marginTop: theme.spacing(3),
//         overflowX: 'auto',
//     },
//     table: {
//         minWidth: 650,
//     },
// }));

const useStyles = makeStyles(theme => ({
    root: {
        //display: 'flex',
        width: '100%',
        //marginTop: theme.spacing(3),
        //overflowX: 'auto',
    },
    elevation1: {
        boxShadow: 0
    },
    table: {
        minWidth: 650,
    },
    tableHead: {
        //display: 'table',
        width: '100%'
    },
    tableRow: {
        ':hover': {
            backgroundColor: '#f5f5f5'
        }
    },
    formControl: {
        margin: theme.spacing(3),
    },
    column: {
        flexBasis: '33.33%',
        fontStyle: 'bold'
        //width: '33.33%'
      },
    details: {
        alignItems: 'center',
    },
  }));

export default function StudentExamsTable(props) {
    const classes = useStyles();
    const {examList, studentClass} = props;
    const [hoverIndex, setHoverIndex] = useState(-1);
    const [isModalShow, setModalShow] = useState(false);

    function getExamStatus(startTime, endTime) {
        let currentDateTime = new Date();
        if(currentDateTime < new Date(startTime)) {
            return 'Chưa mở';
        } else if (currentDateTime >= new Date(startTime) && (endTime === '0000-00-00 00:00:00' ||
                     currentDateTime < new Date(endTime))) {
            return 'Đang mở';
        } else {
            return 'Đã đóng';
        }
    }

    return (
        <div className="expand-table">
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell className="table-col-width-35"><span className="blue-text bold font-effra font-size-16 text-darken-3">Chủ đề</span></TableCell>
                            {/* <TableCell className="table-col-width-10"><span className="blue-text bold font-effra font-size-16 text-darken-3">Lần thử</span></TableCell> */}
                            <TableCell className="table-col-width-20"><span className="blue-text bold font-effra font-size-16 text-darken-3">Thời gian mở</span></TableCell>
                            <TableCell className="table-col-width-20"><span className="blue-text bold font-effra font-size-16 text-darken-3">Thời lượng (phút)</span></TableCell>
                            <TableCell className="table-col-width-20"><span className="blue-text bold font-effra font-size-16 text-darken-3">Trạng thái</span></TableCell>
                            <TableCell><span className="blue-text bold font-effra font-size-16 "></span></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                      {examList && examList.map(item =>
                        <TableRow
                        key={item.id}
                        //onMouseLeave={isModalShow ? () => setHoverIndex(-1) : ''}
                        >
                            <TableCell className="table-col-width-35"><span className="font-effra font-size-18 grey-text text-darken-3">{item.title}</span></TableCell>
                            {/* <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.status}</span></TableCell> */}
                            {/* <TableCell className="table-col-width-10"><span className="font-effra font-size-18 grey-text text-darken-3"></span></TableCell> */}
                            <TableCell className="table-col-width-20"><span className="font-effra font-size-18 grey-text text-darken-3">{item.startEntryTime}</span></TableCell>
                            <TableCell className="table-col-width-20"><span className="font-effra font-size-18 grey-text text-darken-3">{item.duration}</span></TableCell>
                            <TableCell className="table-col-width-10"><span className="font-effra font-size-18 grey-text text-darken-3">{getExamStatus(item.startEntryTime, item.endEntryTime)}</span></TableCell>
                            {/* {hoverIndex === index && */}
                            <TableCell style={{textAlign: 'end'}}>
                                <Link to={{pathname: '/exam/' + item.title.replace(/\s/g,'-'), state: {id: item.id, studentClass: studentClass}}}>
                                    <i className="material-icons" style={{marginRight:"10px"}}>import_contacts</i>
                                </Link>
                                {/* <a href={"#viewExam"} className="modal-trigger">
                                    <i className="material-icons" style={{marginRight:"10px"}}>import_contacts</i>
                                </a>
                                <Modal id={"viewExam"} className="view-exam" options={{ preventScrolling: false }} actions={<Button style={{display: 'none'}}></Button>}> 
                                    <div>
                                        {/* <h5 className="center" style={{marginTop: 0}}>Tạo buổi kiểm tra</h5>
                                        <Divider style={{marginBottom: "1vw"}}/> */}
                                    {/* </div>
                                </Modal> */} 
                            </TableCell>
                            {/* } */}
                            {/* {hoverIndex !== index && 
                                <TableCell style={{textAlign: 'end'}}>
                                    <i className="material-icons" style={{color: '#e32', visibility: 'hidden'}}>delete</i>
                                </TableCell>
                            } */}
                        </TableRow>
                      )}
                    </TableBody>
                </Table>
            </Paper>
        </div>
    );
}