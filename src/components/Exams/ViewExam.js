import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import HomeIcon from '@material-ui/icons/Home';
import TimelineIcon from '@material-ui/icons/Timeline';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import axios from 'axios';
import {serverUrl} from '../common/common';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-force-tabpanel-${index}`}
      aria-labelledby={`scrollable-force-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    width: '100%',
    backgroundColor: theme.palette.background.paper,
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
    },
    expanded: {},
  })(MuiExpansionPanel);
  
  const ExpansionPanelSummary = withStyles({
    root: {
      backgroundColor: 'rgba(0, 0, 0, .03)',
      //borderBottom: '1px solid rgba(0, 0, 0, .125)',
      marginBottom: -1,
      minHeight: 56,
      '&$expanded': {
        minHeight: 56,
      },
      padding: 0
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
        padding:'24px'
    }
  })(MuiExpansionPanelSummary);
  
  const ExpansionPanelDetails = withStyles(theme => ({
    root: {
      backgroundColor: 'rgba(0, 0, 0, .03)',
      padding: '24px',
    },
  }))(MuiExpansionPanelDetails);

export default function ViewExam(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [selectedClassList, setSelectedClasses] = React.useState([]);
  const [selectedTestList, setSelectedTests] = React.useState([]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const getSelectedClasses = (examId) => {
    axios.get(serverUrl + "api/examClass/classes/" + examId + "/all")
        .then(res => {
            let result = [];
            if(res.data) {
                res.data.map(item => result.push({id: item.id, name: item.name}))
            }
            setSelectedClasses(result);
        })
}

  const getSelectedTests = (examId) => {
      axios.get(serverUrl + "api/examTest/tests/" + examId + "/all")
          .then(res => {
            setSelectedTests(res.data)
          })
  }

  const { exam } = props;

  if(exam) {
    getSelectedClasses(exam.id);
    getSelectedTests(exam.id);
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" color="default" style={{width: 'fit-content', minHeight: '500px'}}>
        <Tabs
          value={value}
          orientation="vertical"
          onChange={handleChange}
          variant="scrollable"
          className="exam-tabs"
          scrollButtons="on"
          indicatorColor="secondary"
          textColor="secondary"
          aria-label="scrollable force tabs example"
        >
          <Tab label="Thông tin chung" icon={<HomeIcon />} {...a11yProps(0)} />
          <Tab label="Lịch sử" icon={<TimelineIcon />} {...a11yProps(1)} />
        </Tabs>
      </AppBar>
        <TabPanel value={value} index={0} style={{width: '100%'}}>
            <div className="blue-text">Thông tin cơ bản</div>
            <div className="row required" style={{marginTop: "20px"}}>
                <label htmlFor="title" className="col s2" style={{paddingLeft: 0, fontSize: '1rem'}}>
                    Chủ đề:
                </label>
                <div className="col s10">{exam.title}</div>
            </div>
            <div className="row required" style={{marginTop: "20px"}}>
                <label htmlFor="title" className="col s2" style={{paddingLeft: 0, fontSize: '1rem'}}>
                    Điểm hệ số:
                </label>
                <div className="col s10">{exam.powerLevel}</div>
            </div>
            <div className="row required" style={{marginTop: "20px"}}>
                <label htmlFor="title" className="col s2" style={{paddingLeft: 0, fontSize: '1rem'}}>
                    Mã bài thi:
                </label>
                <div className="col s10">{exam.code ? exam.code : 'N/A'}</div>
            </div>
            <div className="row required">
                <label htmlFor="forClass" className="col s2" style={{paddingLeft: 0, fontSize: '1rem'}}>Lớp:</label>
                {/* <div> */}
                    { (selectedClassList && selectedClassList.length !== 0) &&
                        <div className="col s10 no-padding">
                            <div className="col s11 no-padding">
                            { selectedClassList.map( (item, index) => 
                                <span key={item.id}>{item.name}{index !== selectedClassList.length - 1 ? ", " : ''}</span>
                            )
                            }</div>
                        </div>
                    }
                {/* </div> */}
            </div>
            <Divider style={{marginBottom: "1vw"}}/>
            <div className="blue-text">Giờ kiểm tra</div>
            <div style={{
            position: 'relative',
            marginTop: '10px',
            marginLeft: '-24px',
            marginRight: '-24px'
            //margin:'-10px'
            }}>
            <ExpansionPanel square >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>Thông tin phát bài</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details} style={{display: 'block'}}>
                    <div className="row">
                        <div className="row" >
                            <label htmlFor="title" className="col s4 inputLabel" style={{paddingLeft: 0}}>Thời gian làm bài (Phút):</label>
                            <div className="col s8">{exam.duration}</div>
                        </div>
                        <div className="row" style={{marginTop: "20px"}}>
                            <label htmlFor="title" className="col s4 inputLabel" style={{paddingLeft: 0}}>Số lần làm bài:</label>
                            <div className="col s8">{exam.trials}</div>
                        </div>
                        <div className="row" style={{marginTop: "20px"}}>
                            <label htmlFor="title" className="col s4 inputLabel" style={{paddingLeft: 0}}>Thời gian phát:</label>
                            <div className="col s8">{new Date(exam.startEntryTime).toLocaleString("vi-VN")}</div>
                        </div>
                        <div className="row" style={{marginTop: "20px"}}>
                            <label htmlFor="title" className="col s4 inputLabel" style={{paddingLeft: 0}}>Thời gian đóng:</label>
                            <div className="col s8">{exam.endEntryTime === '0000-00-00 00:00:00' ? 'Không xác định' : new Date(exam.endEntryTime).toLocaleString("vi-VN")}</div>
                        </div>
                    </div>
                </ExpansionPanelDetails>
            </ExpansionPanel>
            <Divider />
            <ExpansionPanel square >
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
                    <Typography>Đề kiểm tra</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails className={classes.details} style={{paddingBottom: 0}}>
                    <div className={classes.column + " blue-text text-darken-3 bold"} style={{width: '33.33%'}}>
                        Mã đề thi
                    </div>
                    <div className={classes.column + " blue-text text-darken-3 bold"} style={{width: '33.33%'}}>
                        Tên bài kiểm tra
                    </div>
                    <div className={classes.column + " blue-text text-darken-3 bold"} style={{width: '33.33%'}}>
                    </div>
                        {/* <div className={clsx(classes.column, classes.helper)}>
                        <Typography variant="caption">
                        Select your destination of choice
                        <br />
                        <a href="#secondary-heading-and-columns" className={classes.link}>
                            Learn more
                        </a>
                        </Typography>
                    </div> */}
                </ExpansionPanelDetails>
                <Divider/>
                { selectedTestList && selectedTestList.map((test, index) => 
                    <div key={test.id}>
                        <ExpansionPanelDetails className={classes.details} style={{paddingBottom: 0}}>
                            <div className={classes.column} style={{width: '33.33%'}}>
                                {test.testCode}
                            </div>
                            <div className={classes.column} style={{width: '60.33%'}}>
                                {test.title}
                                {/* <a href="#dateTimePicker" className="modal-trigger" style={{textDecorationLine: 'underline'}}>Cai dat thoi gian phat</a>
                                <Modal id="dateTimePicker" options={{ preventScrolling: false }} actions={<Button style={{display: 'none'}}></Button>}> 
                                    <div>
                                        <h5 className="center" style={{marginTop: 0}}>Cai dat thoi gian phat</h5>
                                        <Divider style={{marginBottom: "1vw"}}/>
                                </Modal> */}
                            </div>
                            {/* <div className={classes.column} style={{width: '6.33%'}}> */}
                                {/* <input type="text" size="5" style={{height: 'fit-content', width: 'fit-content', display: 'flex'}}/> */}
                            {/* </div>*/} 
                                {/* <div className={clsx(classes.column, classes.helper)}>
                                <Typography variant="caption">
                                Select your destination of choice
                                <br />
                                <a href="#secondary-heading-and-columns" className={classes.link}>
                                    Learn more
                                </a>
                                </Typography>
                            </div> */}
                        </ExpansionPanelDetails>
                        <Divider/>
                    </div>
                )}
            </ExpansionPanel>
            <Divider />
            <ExpansionPanel square>
                <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2d-content" id="panel2d-header">
                    <Typography>Thông tin thu bài</Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails style={{display: 'block'}}>
                    <div className="row">
                        <label className="col s5 inputLabel" style={{paddingLeft: 0}}>Vào điểm:</label>
                        <div className="col s7">{exam.isMarked ? 'Có' : 'Không'}</div>
                    </div>
                    <div className="row">
                        <label className="col s5 inputLabel" style={{paddingLeft: 0}}>Hiển thị đáp án:</label>
                        <div className="col s7">{exam.isShowAnswers ? 'Có' : 'Không'}</div>
                    </div>
                    <div className="row">
                        <label className="col s5 inputLabel" style={{paddingLeft: 0}}>Hiển thị lời giải:</label>
                        <div className="col s7">{exam.isShowExplanation ? 'Có' : 'Không'}</div>
                    </div>
                    {/* <div className="row" style={{marginTop: "20px"}}>
                        <label htmlFor="title" className="col s2 inputLabel" style={{paddingLeft: 0}}>Gửi thông báo sau kiểm tra:</label>
                    </div>
                    <div className="row" style={{marginTop: "20px"}}>
                        <label htmlFor="title" className="col s2 inputLabel" style={{paddingLeft: 0}}>Gửi lời giải sau kiểm tra:</label>
                        <FormControl required component="fieldset" className={classes.formControl}>
                            <FormGroup>
                            <FormControlLabel
                                dis
                                control={<CustomCheckbox value="send" />}
                                label="File word qua mail"
                            />
                            </FormGroup>
                        </FormControl>
                    </div> */}
                </ExpansionPanelDetails>
            </ExpansionPanel>
            </div>
        </TabPanel>
        <TabPanel value={value} index={1} style={{width: '100%'}}>
            Item Two
        </TabPanel>
    </div>
  );
}
