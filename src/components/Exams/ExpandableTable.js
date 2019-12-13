import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import Button from 'react-materialize/lib/Button';
import { Modal } from 'react-materialize';
import ExamForm from './ExamForm'
import { Link } from '@material-ui/core';
import ViewExam from './ViewExam';

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
        marginTop: theme.spacing(3),
        //overflowX: 'auto',
    },
    elevation1: {
        boxShadow: 0
    },
    table: {
        minWidth: 650,
    },
    tableHead: {
        display: 'table',
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

const ExpansionPanel = withStyles({
    root: {
        //border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
        position: 'unset',
        backgroundColor: '#fff',
        padding: 0,
    },
    expanded: {

    },
})(MuiExpansionPanel);

const ExpansionPanelSummary = withStyles({
    root: {
        //backgroundColor: 'rgba(0, 0, 0, .03)',
        //borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        //minHeight: 56,
        '&$expanded': {
            minHeight: 56,
            borderBottom: '1px solid rgba(0,0,0,0.12)'
        },
        padding: 0,
        fontSize: '15px'
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
        paddingLeft: '50px'
    },
    expanded: {},
    expandIcon: {
        left: 0,
        position: 'absolute',
        //padding:'24px',
    }
})(MuiExpansionPanelSummary);

const ExpansionPanelDetails = withStyles(theme => ({
    root: {
        //backgroundColor: 'rgba(0, 0, 0, .03)',
        //padding: '24px',
        display: 'table',
        width: '100%',
        padding: 0
    },
}))(MuiExpansionPanelDetails);

function createData(code, name, status, dob, grade) {
    return { code, name, status, dob, grade };
}

export default function ExpandableTable(props) {
    const classes = useStyles();

    const { type, examMap } = props;

    console.log("map", examMap)

    const [hoverIndex, setHoverIndex] = useState(-1);
    const [isModalShow, setModalShow] = useState(false);

    return (
        <div className="expand-table">
            <Paper className={classes.root}>
                <Table className={classes.table}>
                    <TableHead className={classes.tableHead}>
                        <TableRow>
                            <TableCell className="table-col-width-35"><span className="blue-text bold font-effra font-size-16 text-darken-3">Chủ đề</span></TableCell>
                            <TableCell className="table-col-width-10"><span className="blue-text bold font-effra font-size-16 text-darken-3">Tiến độ</span></TableCell>
                            <TableCell className="table-col-width-20"><span className="blue-text bold font-effra font-size-16 text-darken-3">Thời gian mở</span></TableCell>
                            <TableCell className="table-col-width-20"><span className="blue-text bold font-effra font-size-16 text-darken-3">Thời lượng (phút)</span></TableCell>
                            <TableCell><span className="blue-text bold font-effra font-size-16 "></span></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {Object.keys(examMap).map(date =>
                            <TableRow>
                                <ExpansionPanel square className="row-hover" >
                                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon className="blue-text" style={{ fontSize: "2vw", fontFamily: 'iCiel Effra' }} />} className="blue-text" aria-controls="panel1d-content" id="panel1d-header">
                                        <Typography style={{ fontFamily: 'iCiel Effra' }}>{new Date(date).toLocaleString("vi-VN", { weekday: "long" })}, {new Date(date).getDate()} tháng {new Date(date).getMonth() + 1} năm {new Date(date).getFullYear()}</Typography>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails className={classes.details} style={{ paddingBottom: 0 }}>
                                        {examMap[date].map((item, index) => (
                                            <TableRow key={item.exam.id} onMouseEnter={() => setHoverIndex(index)}
                                            //onMouseLeave={isModalShow ? () => setHoverIndex(-1) : ''}
                                            >
                                                <TableCell className="table-col-width-35"><span className="font-effra font-size-18 grey-text text-darken-3">{item.exam.title}</span></TableCell>
                                                {/* <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.status}</span></TableCell> */}
                                                <TableCell className="table-col-width-10"><span className="font-effra font-size-18 grey-text text-darken-3">{item.progress}</span></TableCell>
                                                <TableCell className="table-col-width-20"><span className="font-effra font-size-18 grey-text text-darken-3">{item.exam.startEntryTime}</span></TableCell>
                                                <TableCell className="table-col-width-20"><span className="font-effra font-size-18 grey-text text-darken-3">{item.exam.duration === 0 ? 'Không giới hạn' : item.exam.duration}</span></TableCell>
                                                {/* {hoverIndex === index && */}
                                                <TableCell style={{ textAlign: 'end' }}>
                                                    <a href={"#viewExam" + item.exam.id} className="modal-trigger">
                                                        <i className="material-icons" style={{ marginRight: "10px" }}>import_contacts</i>
                                                    </a>
                                                    <Modal id={"viewExam" + item.exam.id} className="view-exam" options={{ preventScrolling: false }} actions={<Button style={{ display: 'none' }}></Button>}>
                                                        <div>
                                                            {/* <h5 className="center" style={{marginTop: 0}}>Tạo buổi kiểm tra</h5>
                                                                <Divider style={{marginBottom: "1vw"}}/> */}
                                                            <ViewExam exam={item.exam} />
                                                        </div>
                                                    </Modal>
                                                    {(type && type === 'SCHEDULE') &&
                                                        <>
                                                            <a href={"#editExam" + item.exam.id} className="modal-trigger">
                                                                <i className="material-icons" style={{ marginRight: "10px" }}>edit</i>
                                                            </a>
                                                            <Modal id={"editExam" + item.exam.id} options={{ preventScrolling: false }} actions={<Button style={{ display: 'none' }}></Button>}>
                                                                <div>
                                                                    <h5 className="center" style={{ marginTop: 0 }}>Sửa thông tin buổi kiểm tra</h5>
                                                                    <Divider style={{ marginBottom: "1vw" }} />
                                                                    <ExamForm exam={item.exam} />
                                                                </div>
                                                            </Modal>
                                                        </>
                                                    }
                                                    {((type && type === 'SCHEDULE') || item.progress === 'Xong') &&
                                                        <>
                                                            <a href={"#deleteExam" + item.exam.id} className="modal-trigger">
                                                                <i className="material-icons" style={{ color: '#e32' }}>delete</i>
                                                            </a>
                                                            <Modal id={"deleteExam" + item.exam.id} options={{ preventScrolling: false }} actions={<Button style={{ display: 'none' }}></Button>}>
                                                                <div>
                                                                    <h5 className="center" style={{ marginTop: 0 }}>Tạo buổi kiểm tra</h5>
                                                                    <Divider style={{ marginBottom: "1vw" }} />
                                                                </div>
                                                            </Modal>
                                                        </>
                                                    }
                                                </TableCell>
                                                {/* } */}
                                                {/* {hoverIndex !== index && 
                                                <TableCell style={{textAlign: 'end'}}>
                                                    <i className="material-icons" style={{color: '#e32', visibility: 'hidden'}}>delete</i>
                                                </TableCell>
                                            } */}
                                            </TableRow>
                                        ))}
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </Paper>
        </div>
    );
}