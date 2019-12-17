import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

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

// const headCells = [
//   { id: 'name', numeric: false, disablePadding: false, label: 'Dessert (100g serving)' },
//   { id: 'calories', numeric: true, disablePadding: false, label: 'Calories' },
//   { id: 'fat', numeric: true, disablePadding: false, label: 'Fat (g)' },
//   { id: 'carbs', numeric: true, disablePadding: false, label: 'Carbs (g)' },
//   { id: 'protein', numeric: true, disablePadding: false, label: 'Protein (g)' },
// ];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, ...rest } = props;
  const createSortHandler = property => event => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {props.headCells.map((headCell, i) => (
          <TableCell
            className={headCell.id == "content" ? ("table-col-width-40") : ("table-col-width-15")}
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
    margin: 0,
    //minHeight: 56,
    '&$expanded': {
      minHeight: "50px",
      // borderBottom: '1px solid rgba(0,0,0,0.12)'
    },
    padding: 0,
    fontSize: '15px',
  },
  content: {
    margin: 0,
    '&$expanded': {
      margin: 0,
    },
    // paddingLeft: '50px'
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

export default function EnhancedTable({ headCells, rows, setCurrentQuestion }) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('desc');
  const [orderBy, setOrderBy] = React.useState('questionId');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [expanded, setExpanded] = React.useState(false);

  const handleRequestSort = (event, property) => {
    const isDesc = orderBy === property && order === 'desc';
    console.log(orderBy);
    setOrder(isDesc ? 'asc' : 'desc');
    setOrderBy(property);
  };

  const handleSelectAllClick = event => {
    if (event.target.checked) {
      const newSelecteds = rows.map(n => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

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

  const isSelected = name => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const test = (questionId) => {
    setExpanded(!expanded);
  }

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
              {stableSort(rows, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    row.questionTypeId == 3 ? (
                      <TableRow>
                        {/* <div onClick={()=>{
                          test(row.questionId);
                        }}>nani</div> */}
                        <TableCell colSpan={5} style={{ padding: "0" }}>
                          <ExpansionPanel square className="row-hover" >
                            <ExpansionPanelSummary title={row.description} onClick={()=>{setCurrentQuestion(row)}} style={{ padding: "0" }} aria-controls="panel1d-content" id="panel1d-header">
                              <TableCell className="table-col-width-15" component="th" id={labelId} scope="row">
                                <span className="font-effra font-size-18 grey-text text-darken-3">{row.questionCode}</span>
                              </TableCell>
                              <TableCell className="table-col-width-40"><span className="font-effra font-size-18 grey-text text-darken-3">{row.content&&row.content.ops&&row.content.ops.map(
                                obj => obj.insert.formula ? (<InlineMath math={obj.insert.formula} />) : (obj.insert.image ? (<img src={obj.insert.image} alt="image" width={obj.attributes && obj.attributes.width} />) : (<span> {obj.insert} </span>)))
                              }</span></TableCell>
                              <TableCell className="table-col-width-15">
                                <span className="-effra font-size-18 grey-text text-darken-3">{row.difficultyId == 1 && "Nhận biết"}
                                {row.difficultyId == 2 && "Thông hiểu"}
                                {row.difficultyId == 3 && "Vận dụng"}
                                {row.difficultyId == 4 && "Vận dụng cao"}</span>
                              </TableCell>
                              <TableCell className="table-col-width-15"><span className="font-effra font-size-18 grey-text text-darken-3">{row.gradeLevelId != 0 ? ("Lớp " + row.gradeLevelId) : ("Khác")}</span></TableCell>
                              <TableCell className="table-col-width-15" onClick={(e) => {
                                e.stopPropagation();
                                alert(row.questionCode)
                              }}><span className="font-effra font-size-18 grey-text text-darken-3">{row.questionTypeId == 1 && "Lý thuyết"}
                                  {row.questionTypeId == 2 && "Bài tập"}
                                  {row.questionTypeId == 3 && "Câu hỏi chùm"}</span>
                              </TableCell>

                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.details} style={{ paddingBottom: 0 }}>

                              {row.childQuestions && row.childQuestions.map((item, index) => (
                                <TableRow onClick={()=>{setCurrentQuestion(row)}} title={item.description} key={item.questionId} style={{backgroundColor:"#EEEEEE", cursor: "pointer"}} href="#editQuestion" className="modal-trigger">
                                  <TableCell className="table-col-width-15" id={labelId} scope="row">
                                    <span className="font-effra font-size-18 grey-text text-darken-3">{item.questionCode}</span>
                                  </TableCell>
                                  <TableCell className="table-col-width-40"><span className="font-effra font-size-18 grey-text text-darken-3">{item.content&&item.content.ops&&item.content.ops.map(
                                    obj => obj.insert.formula ? (<InlineMath math={obj.insert.formula} />) : (obj.insert.image ? (<img src={obj.insert.image} alt="image" width={obj.attributes && obj.attributes.width} />) : (<span> {obj.insert} </span>)))
                                  }</span></TableCell>
                                  <TableCell className="table-col-width-15"><span className="font-effra font-size-18 grey-text text-darken-3">{item.difficultyId == 1 && "Nhận biết"}
                                    {item.difficultyId == 2 && "Thông hiểu"}
                                    {item.difficultyId == 3 && "Vận dụng"}
                                    {item.difficultyId == 4 && "Vận dụng cao"}</span></TableCell>
                                  <TableCell className="table-col-width-15"><span className="font-effra font-size-18 grey-text text-darken-3">{item.gradeLevelId != 0 ? ("Lớp " + item.gradeLevelId) : ("Khác")}</span></TableCell>
                                  <TableCell className="table-col-width-15"><span className="font-effra font-size-18 grey-text text-darken-3">{item.questionTypeId == 1 && "Lý thuyết"}
                                    {item.questionTypeId == 2 && "Bài tập"}
                                    {item.questionTypeId == 3 && "Câu hỏi chùm"}</span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </ExpansionPanelDetails>
                          </ExpansionPanel>
                        </TableCell>
                      </TableRow>
                    ) : (
                        <TableRow
                          hover
                          onClick={()=>{setCurrentQuestion(row)}}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.questionCode}
                          selected={isItemSelected}
                          href="#editQuestion" className="modal-trigger"
                          style={{cursor: "pointer"}}
                          title={row.description}
                        >
                          <TableCell component="th" id={labelId} scope="row">
                            <span className="font-effra font-size-18 grey-text text-darken-3">{row.questionCode}</span>
                          </TableCell>
                          <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.content&&row.content.ops&&row.content.ops.map(
                            obj => obj.insert.formula ? (<InlineMath math={obj.insert.formula} />) : (obj.insert.image ? (<img src={obj.insert.image} alt="image" width={obj.attributes && obj.attributes.width} />) : (<span> {obj.insert} </span>)))
                          }</span></TableCell>
                          <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.difficultyId == 1 && "Nhận biết"}
                            {row.difficultyId == 2 && "Thông hiểu"}
                            {row.difficultyId == 3 && "Vận dụng"}
                            {row.difficultyId == 4 && "Vận dụng cao"}</span></TableCell>
                          <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.gradeLevelId != 0 ? ("Lớp " + row.gradeLevelId) : ("Khác")}</span></TableCell>
                          <TableCell><span className="font-effra font-size-18 grey-text text-darken-3">{row.questionTypeId == 1 && "Lý thuyết"}
                            {row.questionTypeId == 2 && "Bài tập"}
                            {row.questionTypeId == 3 && "Câu hỏi chùm"}</span>
                          </TableCell>
                        </TableRow>
                      )
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
          rowsPerPageOptions={[10, 25, 100]}
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