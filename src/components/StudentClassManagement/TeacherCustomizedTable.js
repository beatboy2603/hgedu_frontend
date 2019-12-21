import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import axios from 'axios';
import { Modal } from 'react-materialize';
import { serverUrl } from '../common/common'
// function createData(name, calories, fat, carbs, protein) {
//   return { name, calories, fat, carbs, protein };
// }

// const rows = [
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Donut', 452, 25.0, 51, 4.9),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
//   createData('Honeycomb', 408, 3.2, 87, 6.5),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Jelly Bean', 375, 0.0, 94, 0.0),
//   createData('KitKat', 518, 26.0, 65, 7.0),
//   createData('Lollipop', 392, 0.2, 98, 0.0),
//   createData('Marshmallow', 318, 0, 81, 2.0),
//   createData('Nougat', 360, 19.0, 9, 37.0),
//   createData('Oreo', 437, 18.0, 63, 4.0),
// ];


function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}



const headCells = [
    { id: 'name', numeric: false, disablePadding: false, label: 'Dessert (100g serving)' },
    { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
    { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
    { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
    { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
];

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, ...rest } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };


    return (
        <TableHead>
            <TableRow>
                {props.headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                        style={{ color: "#086bd1" }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={order}
                            onClick={createSortHandler(headCell.id)}
                        >
                            <span className="bold font-montserrat font-size-15">{headCell.label}</span>
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles(theme => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
        theme.palette.type === 'light'
            ? {
                color: theme.palette.secondary.main,
                backgroundColor: lighten(theme.palette.secondary.light, 0.85),
            }
            : {
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.secondary.dark,
            },
    title: {
        flex: '1 1 100%',
    },
}));

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    tableWrapper: {
        overflowX: 'auto',
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },

}));

export default function EnhancedTable({ headCells, rows }) {
    const classes = useStyles();
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('calories');
    const [selected, setSelected] = useState([]);
    const [page, setPage] = useState(0);
    const [dense, setDense] = useState(false);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [studentList, setStudentList] = useState([]);
    const [parentList, setParentList] = useState([]);
    // const [parentFullName, setParentFullName] = useState([]);
    // const [parentEmail, setParentEmail] = useState([]);
    // const [parentDob, setParentDob] = useState([]);
    // const [parentPhoneNumber, setParentPhoneNumber] = useState([]);
    // const [parentGender, setParentGender] = useState([]);
    const [id, setId] = useState([]);
    const handleRequestSort = (event, property) => {
        const isDesc = orderBy === property && order === 'desc';
        setOrder(isDesc ? 'asc' : 'desc');
        setOrderBy(property);
    };

    const dateFormat = (text) => {
        if (text != null) {
            return text.slice(8, 10) + "/" + text.slice(5, 7) + "/" + text.slice(0, 4);
        }
        else return '';
    }

    const handleSelectAllClick = event => {
        if (event.target.checked) {
            const newSelecteds = rows.map(n => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };
    useEffect(() => {
        axios.get(serverUrl + "api/enrollment/teacher/studentDetail/" + id)
            .then(res => {
                setStudentList(res.data)
                console.log(res.data)
            })

        axios.get(serverUrl + "api/enrollment/teacher/studentParentDetail/" + id)
            .then(res1 => {
                console.log(id)
                setParentList(res1.data);
                console.log(parentList)
                console.log(parentList[0])
            })
    }, [id, setParentList]);
    const handleClick = (event, name) => {
        // const selectedIndex = selected.indexOf(name);
        // let newSelected = [];

        // if (selectedIndex === -1) {
        //   newSelected = newSelected.concat(selected, name);
        // } else if (selectedIndex === 0) {
        //   newSelected = newSelected.concat(selected.slice(1));
        // } else if (selectedIndex === selected.length - 1) {
        //   newSelected = newSelected.concat(selected.slice(0, -1));
        // } else if (selectedIndex > 0) {
        //   newSelected = newSelected.concat(
        //     selected.slice(0, selectedIndex),
        //     selected.slice(selectedIndex + 1),
        //   );
        // }

        // setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = event => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleChangeDense = event => {
        setDense(event.target.checked);
    };

    const convertDate = time => {
        const addZeroBefore = number => {
            if (number.toString().length <= 1) {
                return "0" + number
            }
            else return number
        }
        if (time) {
            let modDate = new Date(time)
            return addZeroBefore(modDate.getDate()) + "/" + addZeroBefore(modDate.getMonth()+1) + "/" + addZeroBefore(modDate.getFullYear())
        } else
            return "Chưa đặt"
    }

    const isSelected = name => selected.indexOf(name) !== -1;

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);


    return (
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <div className={classes.tableWrapper}>
                    <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={dense ? 'small' : 'medium'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            rowCount={rows.length}
                            headCells={headCells}
                        />
                        <TableBody>
                            {
                                stableSort(rows, getSorting(order, orderBy))
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row, index) => {
                                        const isItemSelected = isSelected(row.name);
                                        const labelId = `enhanced-table-checkbox-${index}`;
                                        return (
                                            <TableRow
                                                className="modal-trigger"
                                                href="#information-modal"
                                                hover
                                                onClick={(e) => { setId(row.studentId) }}
                                                role="checkbox"
                                                aria-checked={isItemSelected}
                                                tabIndex={-1}
                                                key={row.name}
                                                selected={isItemSelected}
                                            >
                                                <TableCell style={{ fontFamily: "iCiel Effra", fontSize: "17px" }} align="right" component="th" id={labelId} scope="row">
                                                    {rows.indexOf(row) + 1}
                                                </TableCell>
                                                <TableCell style={{ fontFamily: "iCiel Effra", fontSize: "17px" }}>{row.displayedName}</TableCell>
                                                <TableCell style={{ fontFamily: "iCiel Effra", fontSize: "17px" }}>{row.email}</TableCell>
                                                <TableCell style={{ fontFamily: "iCiel Effra", fontSize: "17px" }}>{row.phoneNumber}</TableCell>
                                                <TableCell style={{ fontFamily: "iCiel Effra", fontSize: "17px" }}>{row.gender ? "Nam" : "Nữ"}</TableCell>
                                                <TableCell style={{ fontFamily: "iCiel Effra", fontSize: "17px" }}>{convertDate(row.dob)}</TableCell>
                                                <Modal id="information-modal" options={{ preventScrolling: true }} style={{ height: "80vh", width: '37vw', overflow: "hidden", borderRadius: "25px", maxHeight: '90%' }} actions={[]}>
                                                    <div className="modal-content" style={{
                                                        position: "absolute",
                                                        top: "0",
                                                        bottom: "0",
                                                        left: "0",
                                                        right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                                                        overflowY: "scroll"
                                                    }}>
                                                        {studentList ? 
                                                            (<div>
                                                                <h5 className="center" style={{ marginBottom: "30px" }}>Thông tin học sinh</h5>
                                                                <div className="line" style={{ marginBottom: '20px' }}></div>
                                                                <div className='col s12 row'>
                                                                    <div className='col s12' style={{
                                                                        padding: 'unset',
                                                                        marginBottom: '10px'
                                                                    }}>
                                                                        <div className="col s5">Tên đầy đủ: </div>
                                                                        <div className="col s7">{studentList.fullName}</div>
                                                                    </div>
                                                                    <div className='col s12' style={{
                                                                        padding: 'unset',
                                                                        marginBottom: '10px'
                                                                    }}>
                                                                        <div className="col s5">Email: </div>
                                                                        <div className="col s7">{studentList.email}</div>
                                                                    </div>
                                                                    <div className='col s12' style={{
                                                                        padding: 'unset',
                                                                        marginBottom: '10px'
                                                                    }}>
                                                                        <div className="col s5">Ngày sinh: </div>
                                                                        <div className="col s7">{dateFormat(studentList.dob) ? dateFormat(studentList.dob) : "Chưa đặt"}</div>
                                                                    </div>
                                                                    <div className='col s12' style={{
                                                                        padding: 'unset',
                                                                        marginBottom: '10px'
                                                                    }}>
                                                                        <div className="col s5">Số điện thoại: </div>
                                                                        <div className="col s7">{studentList.phoneNumber ? studentList.phoneNumber : "Chưa đặt"}</div>
                                                                    </div>
                                                                    <div className='col s12' style={{
                                                                        padding: 'unset',
                                                                        marginBottom: '10px'
                                                                    }}>
                                                                        <div className="col s5">Giới tính: </div>
                                                                        <div className="col s7">{studentList.gender ? "Nam" : "Nữ"}</div>
                                                                    </div>
                                                                </div>
                                                            </div>):(
                                                                <div></div>
                                                            )}

                                                        {parentList && parentList.map((el, i) => {
                                                            return (
                                                                <div>
                                                                    <div className="line" style={{ marginBottom: '20px' }}></div>
                                                                    <div className='col s12 row'>
                                                                        <h5 className="center" style={{ marginBottom: "30px" }}>Thông tin phụ huynh</h5>
                                                                        <div className='col s12' style={{
                                                                            padding: 'unset',
                                                                            marginBottom: '10px'
                                                                        }}>
                                                                            <div className="col s5">Tên đầy đủ: </div>
                                                                            <div className="col s7">{el.fullName}</div>
                                                                        </div>
                                                                        <div className='col s12' style={{
                                                                            padding: 'unset',
                                                                            marginBottom: '10px'
                                                                        }}>
                                                                            <div className="col s5">Email: </div>
                                                                            <div className="col s7">{el.email}</div>
                                                                        </div>
                                                                        <div className='col s12' style={{
                                                                            padding: 'unset',
                                                                            marginBottom: '10px'
                                                                        }}>
                                                                            <div className="col s5">Ngày sinh: </div>
                                                                            <div className="col s7">{dateFormat(el.dob)}</div>
                                                                        </div>
                                                                        <div className='col s12' style={{
                                                                            padding: 'unset',
                                                                            marginBottom: '10px'
                                                                        }}>
                                                                            <div className="col s5">Số điện thoại: </div>
                                                                            <div className="col s7">{el.phoneNumber}</div>
                                                                        </div>
                                                                        <div className='col s12' style={{
                                                                            padding: 'unset',
                                                                            marginBottom: '10px'
                                                                        }}>
                                                                            <div className="col s5">Giới tính: </div>
                                                                            <div className="col s7">{el.gender ? "Nam" : "Nữ"}</div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                </Modal>
                                            </TableRow>

                                        );
                                    })}
                            {emptyRows > 0 && (
                                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                                    <TableCell colSpan={6} />
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
        </div>
    );
}