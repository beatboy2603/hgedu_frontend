import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Modal } from 'react-materialize';
import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import Button from 'react-materialize/lib/Button';
import ClassSelector from './ClassSelector'
import TestSelector from './TestSelector'
import { MuiPickersUtilsProvider} from "@material-ui/pickers";
import DatetimePicker from './DatetimePicker'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import DateFnsUtils from '@date-io/date-fns';
import TextField from '@material-ui/core/TextField';
import { createExam, updateExam } from '../../../actions/examAction';
import { getSelectedExamTests, deleteExamTests } from '../../../actions/examTestAction';
import { getSelectedExamClasses, deleteExamClasses } from '../../../actions/examClassAction';
import classnames from 'classnames';
import Link from '@material-ui/core/Link';
import {CustomCheckbox} from '../../common/CustomCheckbox';
import axios from 'axios';

const styles = makeStyles(theme => ({
    root: {
      display: 'flex',
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

class ExamForm extends Component {
    constructor(props) {
        super(props);

        this.state = {
            _id: 0,
            title: '',
            errors: {},
            selectedClassList: [],
            selectedTestList: [],
            testList: [],
            isMarkSaved: '0',
            startEntryTime: '',
            endEntryTime: '',
            duration: 0,
            durationSelectionValue: 0,
            trials: 0,
            trialsSelectionValue: 0,
            //isSelectedTestUodated: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleDurationChange = this.handleDurationChange.bind(this);
        this.handleTrialsChange = this.handleTrialsChange.bind(this);
        this.handleDurationOtherChange = this.handleDurationOtherChange.bind(this);
        this.handleTrialsOtherChange = this.handleTrialsOtherChange.bind(this);
        this.updateSelectedClasses = this.updateSelectedClasses.bind(this);
        this.updateSelectedTests = this.updateSelectedTests.bind(this);
        this.handleDeleteTest = this.handleDeleteTest.bind(this);
        this.updateSelectedEndEntryTime = this.updateSelectedEndEntryTime.bind(this);
        this.updateSelectedStartEntryTime = this.updateSelectedStartEntryTime.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleMarkSave = this.handleMarkSave.bind(this);
        this.resetForm = this.resetForm.bind(this);

        this.getSelectedClasses = this.getSelectedClasses.bind(this);
        this.getSelectedTests = this.getSelectedTests.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({errors: nextProps.errors});
        }
        // if(nextProps.selectedClassList) {
        //     console.log("getted", this.props.selectedClassList)
        //     this.setState({selectedClassList: nextProps.selectedClassList})
        // }
        // if(nextProps.selectedTestList) {
        //     this.setState({selectedTestList: nextProps.selectedTestList});
        // }
    }

    getSelectedClasses = (examId) => {
        axios.get("http://localhost:8084/api/examClass/classes/" + examId + "/all")
            .then(res => {
                let result = [];
                if(res.data) {
                    res.data.map(item => result.push({id: item.id, name: item.name}))
                }
                this.setState({selectedClassList: result})
            })
    }

    getSelectedTests = (examId) => {
        axios.get("http://localhost:8084/api/examTest/tests/" + examId + "/all")
            .then(res => {
                this.setState({selectedTestList: res.data})
            })
    }

    componentDidMount() {
        //get selected classes
        if(this.props.exam) {
            let exam = this.props.exam;
            let durationArr = [0, 5, 10, 15, 30, 45, 60];
            let trialsArr = [0,1,2,3,4,5];
            //this.props.getSelectedExamClasses(exam.id);
            // this.props.getSelectedExamTests(exam.id);
            this.getSelectedClasses(exam.id);
            this.getSelectedTests(exam.id)
            this.setState({
                _id: exam.id,
                title: exam.title,
                errors: {},
               // selectedClassList: ,
                //selectedTestList: [],
                //testList: [],
                isMarkSaved: exam.isMarked,
                startEntryTime: exam.startEntryTime,
                endEntryTime: exam.endEntryTime === '0000-00-00 00:00:00' ? '' : exam.endEntryTime,
                duration: exam.duration,
                durationSelectionValue: !durationArr.includes(exam.duration) ? -1 : exam.duration,
                trials: exam.trials,
                trialsSelectionValue: !trialsArr.includes(exam.trials) ? -1 : exam.trials,
            });
        }
        //get selected tests
        //this.props.getSelectedExamTests(this.state._id);
        //set state for edit exam
    }

    handleMarkSave = (e) => {
        if(e.target) {
            console.log(e.target.value)
            this.setState({isMarkSaved: e.target.value});
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.props.exam) {
            let date = new Date();
            const exam = {
                id: this.state._id,
                teacherId: this.props.user.userId,
                title: this.state.title,
                startEntryTime: this.state.startEntryTime ? this.state.startEntryTime : '0000-00-00 00:00:00',
                endEntryTime: this.state.endEntryTime ? this.state.endEntryTime : '0000-00-00 00:00:00',
                duration: this.state.duration,
                trials: this.state.trials,
                code: '',
                isMarked: Number(this.state.isMarkSaved) ? true : false,
                dateUpdated: new Date(date.getTime() - date.getTimezoneOffset()*60000).toJSON().slice(0, 19).replace(/T/g, ' ')
            }
            const selectedClassList = this.state.selectedClassList;
            const selectedTestList = this.state.selectedTestList;
            this.props.deleteExamClasses(this.state._id);
            this.props.deleteExamTests(this.state._id);
            this.props.updateExam(exam, selectedClassList,selectedTestList);
        } else {
            let date = new Date();
            const exam = {
                teacherId: this.props.user.userId,
                title: this.state.title,
                startEntryTime: this.state.startEntryTime ? this.state.startEntryTime : '0000-00-00 00:00:00',
                endEntryTime: this.state.endEntryTime ? this.state.endEntryTime : '0000-00-00 00:00:00',
                duration: this.state.duration,
                trials: this.state.trials,
                code: '',
                isMarked: Number(this.state.isMarkSaved) ? true : false,
                dateCreated: new Date(date.getTime() - date.getTimezoneOffset()*60000).toJSON().slice(0, 19).replace(/T/g, ' '),
                dateUpdated: new Date(date.getTime() - date.getTimezoneOffset()*60000).toJSON().slice(0, 19).replace(/T/g, ' ')
            }
            const selectedClassList = this.state.selectedClassList;
            const selectedTestList = this.state.selectedTestList;
            this.props.createExam(exam, selectedClassList,selectedTestList);
            this.resetForm();
        }
    }

    resetForm = () => {
        this.setState({
            _id: 0,
            title: '',
            errors: {},
            selectedClassList: [],
            selectedTestList: [],
            testList: [],
            isMarkSaved: '0',
            startEntryTime: '',
            endEntryTime: '',
            duration: 0,
            durationSelectionValue: 0,
            trials: 0,
            trialsSelectionValue: 0,
        });
    }

    handleDeleteTest = (e) => {
        if(e.target) {
            let testId = Number(e.target.value);
            let selectedTestList = this.state.selectedTestList;
            if(selectedTestList) {
                let testIndex = selectedTestList.findIndex(item => item ? item.id === testId : false);
                if(testIndex !== -1) {
                    this.setState({selectedTestList: this.state.selectedTestList.filter(item => item ? item.id !== testId : false)});
                }
            }
        }
    }

    updateSelectedClasses = (selectedClassList) => {
        this.setState({selectedClassList});
    }

    updateSelectedTests = (selectedTestList) => {
        this.setState({selectedTestList});
    }

    updateSelectedStartEntryTime = (selectedSartEntryTime) => {
        if(this.state.endEntryTime) {
            let selectedStartTime = new Date(selectedSartEntryTime);
            let endTime = new Date(this.state.endEntryTime);
            if(selectedStartTime > endTime) {
                this.setState({endEntryTime: ''})
            }
        }
        this.setState({startEntryTime: selectedSartEntryTime});
    }

    updateSelectedEndEntryTime = (selectedEndEntryTime) => {
        this.setState({endEntryTime: selectedEndEntryTime});
    }

    handleChange = (e) => {
        // if (!!this.state.errors[e.target.name]) {
        //     let errors = Object.assign({}, this.state.errors);
        //     delete errors[e.target.name];
        //     this.setState({ [e.target.name]: e.target.value, errors });
        // } else {
        if(e.target) {
            this.setState({
                [e.target.name]: e.target.value
            })
        }
        //}

    }

    handleDurationChange = (e) => {
        if(e.target) {
            this.setState({durationSelectionValue: e.target.value})
            if (e.target.value !== -1) 
                this.setState({duration: e.target.value})
        }
    }

    handleDurationOtherChange = (e) => {
        if(e.target) 
            this.setState({duration: Number(e.target.value)})
    }

    handleTrialsChange = (e) => {
        if(e.target) {
            this.setState({trialsSelectionValue: e.target.value})
            if (e.target.value !== -1) 
                this.setState({trials: e.target.value})
        }
    }

    handleTrialsOtherChange = (e) => {
        if(e.target) 
            this.setState({trials: Number(e.target.value)})
    }

    render() {
        const { classes } = this.props;
        const { errors } = this.state;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <div>
                    <form noValidate autoComplete="off" onSubmit={this.handleSubmit}>
                        <div className="blue-text">Thông tin cơ bản</div>
                        <div className="row required" style={{marginTop: "20px"}}>
                            <label htmlFor="title" className="col s2 inputLabel" style={{paddingLeft: 0}}>
                                Chủ đề:
                            </label>
                            <input
                                id="title"
                                type="text"
                                name="title"
                                className={classnames("form-control form-control-lg col s10",{
                                    "is-invalid": errors.examTitle
                                })}
                                style={{height: 'fit-content'}}
                                value={this.state.title}
                                onChange={this.handleChange}
                                />
                            {errors.examTitle && (
                                <div className="invalid-feedback">
                                    {errors.examTitle}
                                </div>
                            )}
                        </div>
                        <div className="row required">
                            <label htmlFor="forClass" className="col s2 inputLabel" style={{paddingLeft: 0}}>Lớp:</label>
                            <div>
                                { this.state.selectedClassList.length === 0 &&
                                    <a href={"#chooseClasses" + this.state._id}
                                        className="modal-trigger"
                                    ><input
                                        id="class"
                                        name="classes"
                                        disabled
                                        type="text"
                                        className="col s10 clickable"
                                        style={{height: 'fit-content', width: 'fit-content', display: 'flex', borderBottom: 0}}
                                        placeholder="Chọn lớp"
                                    /></a>
                                }
                                { this.state.selectedClassList.length !== 0 &&
                                    <div className="col s10 no-padding">
                                        <div className="col s11 no-padding">
                                        { this.state.selectedClassList.map( (item, index) => 
                                            <span key={item.id}>{item.name}{index !== this.state.selectedClassList.length - 1 ? ", " : ''}</span>
                                        )
                                        }</div>
                                        <div className="col s1 no-padding">
                                            <a href={"#chooseClasses" + this.state._id}
                                                className="col s2 modal-trigger" >Sửa</a>
                                        </div>
                                    </div>
                                }
                                <div>
                                    <Modal id={"chooseClasses" + this.state._id}  options={{ preventScrolling: true}}  
                                    actions={<Button style={{display: 'none'}}></Button>}
                                    style={{ width: "20vw", minHeight: "30vh", overflow: "hidden" }}  >
                                        <div className="modal-content" style={{
                                                position: "absolute",
                                                top: "0",
                                                bottom: "0",
                                                left: "0",
                                                right: "-17px", /* Increase/Decrease this value for cross-browser compatibility */
                                                overflowY: "scroll"
                                            }}>
                                            <h5 className="center" style={{marginTop: 0}}>Chọn lớp</h5>
                                            <Divider style={{marginBottom: "1vw"}}/>
                                            <div>
                                                <ClassSelector 
                                                    selectedClasses={this.state.selectedClassList} 
                                                    updateSelectedClass={this.updateSelectedClasses} 
                                                    />
                                            </div>
                                        </div>
                                    </Modal>
                                </div>
                            </div>
                        </div>
                        <Divider style={{marginBottom: "1vw"}}/>
                        <div className="blue-text">Cấu hình giờ kiểm tra</div>
                        <div style={{
                        position: 'relative',
                        marginTop: '10px',
                        marginLeft: '-24px',
                        marginRight: '-24px'
                        //margin:'-10px'
                        }}>
                        <ExpansionPanel square >
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
                                <Typography>Cài đặt phát bài</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={classes.details} style={{display: 'block'}}>
                            <div className="row">
                                <div className="row" >
                                    <label htmlFor="title" className="col s3 inputLabel" style={{paddingLeft: 0}}>Thời gian làm bài (Phút):</label>
                                    <FormControl className="col s3" style={{paddingLeft: 0}}>
                                        <Select value={this.state.durationSelectionValue} 
                                        disableEnforceFocus
                                        onChange={this.handleDurationChange} 
                                        displayEmpty className={classes.selectEmpty}>
                                            <MenuItem value={0}>
                                                <em>Không giới hạn</em>
                                            </MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={10}>10</MenuItem>
                                            <MenuItem value={15}>15</MenuItem>
                                            <MenuItem value={30}>30</MenuItem>
                                            <MenuItem value={45}>45</MenuItem>
                                            <MenuItem value={60}>60</MenuItem>
                                            <MenuItem value={-1}>Khác</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <input type="text" 
                                        size="5" 
                                        value={this.state.duration} 
                                        onChange={this.handleDurationOtherChange} 
                                        style = {this.state.durationSelectionValue === -1 ? {padding: '4px 0px 7px', marginBottom: 0,  height: 'fit-content', width: 'fit-content', display: 'flex'} : {}}
                                        className={this.state.durationSelectionValue === -1 ? "show-input col s5" : "hide-input col s5"}/>
                                </div>
                                <div className="row" style={{marginTop: "20px"}}>
                                    <label htmlFor="title" className="col s3 inputLabel" style={{paddingLeft: 0}}>Số lần làm bài:</label>
                                    <FormControl className="col s3" style={{paddingLeft: 0}}>
                                        <Select value={this.state.trialsSelectionValue} onChange={this.handleTrialsChange} disableEnforceFocus displayEmpty className={classes.selectEmpty}>
                                            <MenuItem value={0}>
                                                <em>Không giới hạn</em>
                                            </MenuItem>
                                            <MenuItem value={1}>1</MenuItem>
                                            <MenuItem value={2}>2</MenuItem>
                                            <MenuItem value={3}>3</MenuItem>
                                            <MenuItem value={4}>4</MenuItem>
                                            <MenuItem value={5}>5</MenuItem>
                                            <MenuItem value={-1}>Khác</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <input type="text" 
                                        size="5" 
                                        value={this.state.trials} 
                                        style = {this.state.trialsSelectionValue === -1 ? {padding: '4px 0px 7px', marginBottom: 0, height: 'fit-content', width: 'fit-content', display: 'flex'} : {}}
                                        onChange={this.handleTrialsOtherChange} 
                                        className={this.state.trialsSelectionValue === -1 ? "show-input col s5" : "hide-input col s5"}/>
                                </div>
                                <div className="row" style={{marginTop: "20px"}}>
                                    <label htmlFor="title" className="col s3 inputLabel" style={{paddingLeft: 0}}>Thời gian phát:</label>
                                    <input type="text" placeholder="hh:mm:ss, dd-mm-yyyy" value={this.state.startEntryTime ? new Date(this.state.startEntryTime).toLocaleString("vi-VN") : ''} readOnly className="col s5" style={{height: 'fit-content', width: 'fit-content', textDecorationLine: 'none'}}/>
                                    <div className="col s5">
                                        <a href={"#dateTimePicker1" + this.state._id} className="modal-trigger" style={{borderBottom: '1px solid'}}>Cài đặt</a>
                                        <a href="#" onClick={() => this.setState({startEntryTime: ''})} style={{marginLeft: '15px', borderBottom: '1px solid'}}>Reset</a>
                                        <Modal id={"dateTimePicker1" + this.state._id} className="fit-modal fit-content" style={{backgroundColor: '#fff'}} options={{ preventScrolling: false }} actions={<Button style={{display: 'none'}}></Button>}> 
                                            <div className="fit-content">
                                                <h5 className="center" style={{marginTop: 0}}>Cài đặt thời gian phát</h5>
                                                <Divider />
                                                <DatetimePicker type={"START"} selectedDate={this.state.startEntryTime} updateSelectedStartEntryTime={this.updateSelectedStartEntryTime}/>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                                { this.state.startEntryTime &&
                                <div className="row" style={{marginTop: "20px"}}>
                                    <label htmlFor="title" className="col s3 inputLabel" style={{paddingLeft: 0}}>Thời gian đóng:</label>
                                    <input type="text" placeholder="hh:mm:ss, dd-mm-yyyy" value={this.state.endEntryTime ? new Date(this.state.endEntryTime).toLocaleString("vi-VN") : ''} readOnly className="col s5" style={{height: 'fit-content', width: 'fit-content',textDecorationLine: 'none'}}/>
                                    <div className="col s5">
                                        <a href={"#dateTimePicker2" + this.state._id} className="modal-trigger" style={{borderBottom: '1px solid'}}>Cài đặt</a>
                                        <a href="#" onClick={() => this.setState({endEntryTime: ''})} style={{marginLeft: '15px', borderBottom: '1px solid'}}>Reset</a>
                                        <Modal id={"dateTimePicker2" + this.state._id} className="fit-modal fit-content"  style={{backgroundColor: '#fff'}}  options={{ preventScrolling: false }} actions={<Button style={{display: 'none'}}></Button>}> 
                                            <div className="fit-content">
                                                <h5 className="center" style={{marginTop: 0}}>Cài đặt thời gian đóng</h5>
                                                <Divider/>
                                                <DatetimePicker 
                                                    type={"END"} 
                                                    startTime={this.state.startEntryTime} 
                                                    selectedDate={this.state.endEntryTime}
                                                    updateSelectedEndEntryTime={this.updateSelectedEndEntryTime}/>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                                }
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <Divider />
                        <ExpansionPanel square >
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
                                <Typography>Cài đặt đề kiểm tra</Typography>
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
                            { this.state.selectedTestList && this.state.selectedTestList.map((test, index) => 
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
                                        <div className={classes.column} style={{width: '6.33%'}}>
                                            <button value={test.id} onClick={this.handleDeleteTest} 
                                            className="no-background"
                                            style={{float: "right", background: "none", border: "none", padding: "0", cursor: "pointer", color: '#e32', fontWeight: 'bold'}}>Xóa</button>
                                            {/* <input type="text" size="5" style={{height: 'fit-content', width: 'fit-content', display: 'flex'}}/> */}
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
                                </div>
                            )}
                            <ExpansionPanelDetails>
                                <div>
                                    <a href={"#testSelector" + this.state._id} className="modal-trigger">+ Chọn đề / bộ đề</a>
                                    <Modal id={"testSelector" + this.state._id}  options={{ preventScrolling: false}}  actions={<Button style={{display: 'none'}}></Button>}> 
                                        <div>
                                            <h5 className="center" style={{marginTop: 0}}>Chọn đề / bộ đề</h5>
                                            <Divider style={{marginBottom: "1vw"}}/>
                                            <TestSelector 
                                                selectedTests={this.state.selectedTestList} 
                                                updateSelectedTests={this.updateSelectedTests} 
                                                />
                                        </div>
                                    </Modal>
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <Divider />
                        <ExpansionPanel square>
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel2d-content" id="panel2d-header">
                                <Typography>Cài đặt thu bài</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails style={{display: 'block'}}>
                                <div className="row center-content">
                                    <div className="col s2" style={{padding: 0}}>
                                        <label htmlFor="title" className="inputLabel" style={{paddingLeft: 0}}>Vào điểm:</label>
                                    </div>
                                    <div className="col s10" style={{padding: 0}}>
                                    <FormControl component="fieldset">
                                        <RadioGroup aria-label="mark" name="isMarkSaved" value={this.state.isMarkSaved} 
                                                    style={{display: 'inline-block'}}
                                                    onChange={this.handleMarkSave}>
                                            <FormControlLabel value="0" control={<Radio color="primary" />} label="Không" />
                                            <FormControlLabel value="1" control={<Radio color="primary" />} label="Có" />
                                        </RadioGroup>
                                    </FormControl>
                                    </div>
                                </div>
                                <div className="row" style={{marginTop: "20px"}}>
                                    <label htmlFor="title" className="col s2 inputLabel" style={{paddingLeft: 0}}>Gửi thông báo sau kiểm tra:</label>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        className="col s10"
                                        style={{height: 'fit-content'}}
                                        value={this.state.title}
                                        onChange={this.handleChange}
                                    />
                                </div>
                                <div className="row" style={{marginTop: "20px"}}>
                                    <label htmlFor="title" className="col s2 inputLabel" style={{paddingLeft: 0}}>Gửi lời giải sau kiểm tra:</label>
                                    <FormControl required component="fieldset" className={classes.formControl}>
                                        <FormGroup>
                                        <FormControlLabel
                                            control={<CustomCheckbox value="send" />}
                                            label="File word qua mail"
                                        />
                                        </FormGroup>
                                    </FormControl>
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        </div>
                        <div>
                            <Divider/>
                            <a className=" modal-action modal-close black-text lighten-1" style={{ marginTop: "1vw", float: "left", fontSize: "1vw" }}>Hủy thao tác</a>
                            <button type="submit" className=" modal-action modal-close blue-text lighten-1" 
                            style={{ marginTop: "1vw", float: "right", background: "none", border: "none", padding: "0", cursor: "pointer", fontSize: "1vw" }}>Hoàn tất</button>
                        </div>
                    </form>
                </div>
            </MuiPickersUtilsProvider>
        )
    }
}

ExamForm.propTypes = {
    classes: PropTypes.object.isRequired,
    createExam: PropTypes.func.isRequired,
    updateExam: PropTypes.func.isRequired,
    getSelectedExamTests: PropTypes.func.isRequired,
    getSelectedExamClasses: PropTypes.func.isRequired,
    deleteExamTests: PropTypes.func.isRequired,
    deleteExamClasses: PropTypes.func.isRequired,
    errors: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    selectedTestList: PropTypes.array.isRequired,
    selectedClassList: PropTypes.array.isRequired
  };

const mapStateToProps = state => ({
    errors: state.errors,
    user: state.user,
    selectedTestList: state.examTest.selectedTestList,
    selectedClassList: state.exam.selectedClassList
})
  
  export default connect(
      mapStateToProps,
      { createExam, updateExam, getSelectedExamTests, getSelectedExamClasses, deleteExamTests, deleteExamClasses }
  )(withStyles(styles)(ExamForm));