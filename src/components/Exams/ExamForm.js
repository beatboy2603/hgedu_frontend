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
import { createExam, updateExam } from '../../actions/examAction';
import { getSelectedExamTests, deleteExamTests } from '../../actions/examTestAction';
import { getSelectedExamClasses, deleteExamClasses } from '../../actions/examClassAction';
import classnames from 'classnames';
import Link from '@material-ui/core/Link';
import {CustomCheckbox} from '../common/CustomCheckbox';
import axios from 'axios';
import {serverUrl} from '../common/common';
import viLocale from "date-fns/locale/vi";

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
            errors: {title: '', code: '', duration: '', trials: '', startTime: '', classes: '', tests: ''},
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
            powers: [],
            isShowAnswers: '0',
            isShowExplanation: '0',
            selectedPower: 1,
            examCode: ''
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
        this.handleShowAnswers = this.handleShowAnswers.bind(this);
        this.handleShowExplanation = this.handleShowExplanation.bind(this);
        this.handlePowerChange = this.handlePowerChange.bind(this);
        this.handleCodeChange = this.handleCodeChange.bind(this);
        this.resetForm = this.resetForm.bind(this);

        this.getSelectedClasses = this.getSelectedClasses.bind(this);
        this.getSelectedTests = this.getSelectedTests.bind(this);

        this.getPowers = this.getPowers.bind(this);

        this.endTimeRef = React.createRef();
    }

    classes = {
        root: {
          display: 'flex',
        },
        formControl: {
          margin: '24px',
        },
        column: {
            flexBasis: '33.33%',
            fontStyle: 'bold'
            //width: '33.33%'
          },
        details: {
        alignItems: 'center',
        },
      };

    checkValidSubmit = () => {
        if(this.state.title && this.state.startEntryTime && this.state.selectedClassList.length !== 0 && this.state.selectedTestList.length !== 0) {
            return true;
        }
        return false;
    }

    componentDidUpdate() {
        if(this.state.selectedClassList.length === 0 && !this.state.errors.classes) {
            let errors = this.state.errors;
            errors.classes = 'Hãy chọn ít nhất một lớp.'
            this.setState({errors});
        }
        if(this.state.selectedTestList.length === 0 && !this.state.errors.tests) {
            let errors = this.state.errors;
            errors.tests = 'Hãy chọn ít nhất một bài kiểm tra.'
            this.setState({errors});
        }
        if(this.state.selectedTestList.length !== 0 && this.state.errors.tests) {
            let errors = this.state.errors;
            errors.tests = ''
            this.setState({errors});
        }
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
        axios.get(serverUrl + "api/examClass/classes/" + examId + "/all")
            .then(res => {
                let result = [];
                if(res.data) {
                    res.data.map(item => result.push({id: item.id, name: item.name}))
                }
                this.setState({selectedClassList: result})
            })
    }

    getSelectedTests = (examId) => {
        axios.get(serverUrl + "api/examTest/tests/" + examId + "/all")
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
                errors: {title: '', code: '', duration: '', trials: ''},
               // selectedClassList: ,
                //selectedTestList: [],
                //testList: [],
                isMarkSaved: exam.isMarked ? '1' : '0',
                isShowAnswers: exam.isShowAnswers ? '1' : '0',
                isShowExplanation: exam.isShowExplanation ? '1' : '0',
                examCode: exam.code,
                selectedPower: exam.powerLevel,
                startEntryTime: exam.startEntryTime,
                endEntryTime: exam.endEntryTime === '0000-00-00 00:00:00' ? '' : exam.endEntryTime,
                duration: exam.duration,
                durationSelectionValue: !durationArr.includes(exam.duration) ? -1 : exam.duration,
                trials: exam.trials,
                trialsSelectionValue: !trialsArr.includes(exam.trials) ? -1 : exam.trials,
            });
        }
        //get powers
        this.getPowers();
        //get selected tests
        //this.props.getSelectedExamTests(this.state._id);
        //set state for edit exam
    }

    handleMarkSave = (e) => {
        if(e.target) {
            //console.log(e.target.value)
            this.setState({isMarkSaved: e.target.value});
        }
    }

    handleShowAnswers = (e) => {
        if(e.target) {
            //console.log(e.target.value)
            this.setState({isShowAnswers: e.target.value});
        }
    }

    handleShowExplanation = (e) => {
        if(e.target) {
            //console.log(e.target.value)
            this.setState({isShowExplanation: e.target.value});
        }
    }

    handlePowerChange = (e) => {
        if(e.target) {
            //console.log(e.target.value)
            this.setState({selectedPower: e.target.value});
        }
    }

    handleCodeChange = (e) => {
        let errors = this.state.errors;
        if(/^([A-Za-z0-9]{1,}([.]|[-]|[_]])?)+[A-Za-z0-9]*$/.test(e.target.value)) {
            errors.code = ''
        } else {
            errors.code = 'Mã bài thi không được có dấu cách và ký tự đặc biệt'
        }
        this.setState({
            examCode: e.target.value,
            errors
        })
    }

    getPowers = async () => {
        await axios.get(serverUrl + "api/powers")
        .then(res => {
            //console.log("powers", res.data)
            this.setState({powers: res.data})
        })
        .catch(error => console.log(error));
    }

    handleSubmit = (e) => {
        e.preventDefault();
        if(this.props.exam) {
            let date = new Date();
            const exam = {
                id: this.state._id,
                teacherId: this.props.user.uid,
                title: this.state.title,
                startEntryTime: this.state.startEntryTime ? this.state.startEntryTime : '0000-00-00 00:00:00',
                endEntryTime: this.state.endEntryTime ? this.state.endEntryTime : '0000-00-00 00:00:00',
                duration: Number(this.state.duration),
                trials: Number(this.state.trials),
                code: this.state.examCode,
                powerLevel: Number(this.state.selectedPower),
                isShowExplanation: Number(this.state.isShowExplanation) ? true : false,
                isShowAnswers: Number(this.state.isShowAnswers) ? true : false,
                isMarked: Number(this.state.isMarkSaved) ? true : false,
                dateUpdated: new Date(date.getTime() - date.getTimezoneOffset()*60000).toJSON().slice(0, 19).replace(/T/g, ' ')
            }
            const selectedClassList = this.state.selectedClassList;
            const selectedTestList = this.state.selectedTestList;
            // this.props.deleteExamClasses(this.state._id);
            // this.props.deleteExamTests(this.state._id);
            this.props.updateExam(exam, selectedClassList,selectedTestList);
        } else {
            let date = new Date();
            const exam = {
                teacherId: this.props.user.uid,
                title: this.state.title,
                startEntryTime: this.state.startEntryTime ? this.state.startEntryTime : '0000-00-00 00:00:00',
                endEntryTime: this.state.endEntryTime ? this.state.endEntryTime : '0000-00-00 00:00:00',
                duration: Number(this.state.duration),
                trials: Number(this.state.trials),
                code: this.state.examCode,
                powerLevel: Number(this.state.selectedPower),
                isShowExplanation: Number(this.state.isShowExplanation) ? true : false,
                isShowAnswers: Number(this.state.isShowAnswers) ? true : false,
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
        this.endTimeRef.current.updateState(selectedSartEntryTime);
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
            let errors = this.state.errors;
            if(/^([A-Za-z0-9]{1,}([.,]|[-]| )?)+[A-Za-z0-9]*$/.test(e.target.value)) {
                errors.title = ''
            } else {
                errors.title = 'Chủ đề phải là chữ cái, số hoặc ký tự khác như: . , -'
            }
            this.setState({
                title: e.target.value,
                errors
            })
        }
        //}

    }

    handleDurationChange = (e) => {
        if(e.target) {
            this.setState({durationSelectionValue: e.target.value})
            if (e.target.value !== -1) {
                let errors = this.state.errors;
                errors.duration = ''
                this.setState({duration: e.target.value, errors})
            }
        }
    }

    handleDurationOtherChange = (e) => {
        if(e.target) {
            let errors = this.state.errors;
            if(/^[0-9]+$/.test(e.target.value)) {
                errors.duration = '';
            } else {
                errors.duration = "Hãy nhập số nguyên dương"
            }
            this.setState({duration: e.target.value, errors})
        }
    }

    handleTrialsChange = (e) => {
        if(e.target) {
            this.setState({trialsSelectionValue: e.target.value})
            if (e.target.value !== -1) {
                let errors = this.state.errors;
                errors.trials = ''
                this.setState({trials: e.target.value, errors})
            }
        }
    }

    handleTrialsOtherChange = (e) => {
        let errors = this.state.errors;
        if(/^[0-9]+$/.test(e.target.value)) {
            errors.trials = '';
        } else {
            errors.trials = "Hãy nhập số nguyên dương"
        }
        this.setState({trials: e.target.value, errors})
    }

    render() {
        //const { classes } = this.props;
        const { errors } = this.state;
        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={viLocale}>
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
                                    "is-invalid": errors.title
                                })}
                                style={{height: 'fit-content', marginBottom: 0}}
                                value={this.state.title}
                                onChange={this.handleChange}
                                />
                            {errors.title && (
                                <div className="invalid-feedback col s10" style={{padding: 0}}>
                                    {errors.title}
                                </div>
                            )}
                        </div>
                        <div className="row" style={{marginTop: "20px"}}>
                            <label htmlFor="power" className="col s2 inputLabel" style={{paddingLeft: 0}}>
                                Điểm hệ số:
                            </label>
                            <select
                                id="power"
                                name="power"
                                className="col s10"
                                style={{display: 'block', width: 'fit-content', height: 'fit-content'}}
                                // className={classnames("form-control form-control-lg col s10",{
                                //     "is-invalid": errors.examTitle
                                // })}
                                //style={{height: 'fit-content'}}
                                value={this.state.selectedPower}
                                onChange={this.handlePowerChange}
                            >
                                {this.state.powers && this.state.powers.map( item => <option value={'' + item.value}>{item.name}</option>) }
                            </select>
                            {/* {errors.examTitle && (
                                <div className="invalid-feedback">
                                    {errors.examTitle}
                                </div>
                            )} */}
                        </div>
                        <div className="row" style={{marginTop: "20px"}}>
                            <label htmlFor="code" className="col s2 inputLabel" style={{paddingLeft: 0}}>
                                Mã bài thi:
                            </label>
                            <input
                                id="code"
                                name="code"
                                type="text"
                                className={classnames("form-control form-control-lg col s10",{
                                    "is-invalid": errors.code
                                })}
                                value={this.state.examCode}
                                onChange={this.handleCodeChange}
                                style={{height: 'fit-content', width: 'fit-content', marginBottom: 0}}
                            />
                            {errors.code && (
                                <div className="invalid-feedback col s10" style={{padding: 0}}>
                                    {errors.code}
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
                                        className={classnames("form-control form-control-lg col s10 clickable",{
                                            "is-invalid": errors.classes
                                        })}
                                        style={{height: 'fit-content', width: 'fit-content', display: 'flex', borderBottom: 0}}
                                        placeholder="Chọn lớp"
                                    />
                                    {errors.classes && (
                                        <div className="invalid-feedback col s10" style={{padding: 0}}>
                                            {errors.classes}
                                        </div>
                                    )}
                                    </a>
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
                            <ExpansionPanelDetails className={this.classes.details} style={{display: 'block'}}>
                            <div className="row">
                                <div className="row" >
                                    <label htmlFor="title" className="col s3 inputLabel" style={{paddingLeft: 0}}>Thời gian làm bài (Phút):</label>
                                    <FormControl className="col s3" style={{paddingLeft: 0}}>
                                        <Select value={this.state.durationSelectionValue} 
                                        disableEnforceFocus
                                        onChange={this.handleDurationChange} 
                                        displayEmpty className={this.classes.selectEmpty}>
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
                                        className={classnames(this.state.durationSelectionValue === -1 ? "form-control form-control-lg show-input col s5" : "form-control form-control-lg hide-input col s5",{
                                            "is-invalid": errors.duration
                                        })}/>
                                    {errors.duration && (
                                        <div className="invalid-feedback col s3">
                                            {errors.duration}
                                        </div>
                                    )}
                                </div>
                                <div className="row" style={{marginTop: "20px"}}>
                                    <label htmlFor="title" className="col s3 inputLabel" style={{paddingLeft: 0}}>Số lần làm bài:</label>
                                    <FormControl className="col s3" style={{paddingLeft: 0}}>
                                        <Select value={this.state.trialsSelectionValue} onChange={this.handleTrialsChange} disableEnforceFocus displayEmpty className={this.classes.selectEmpty}>
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
                                        className={classnames(this.state.trialsSelectionValue === -1 ? "form-control form-control-lg show-input col s5" : "form-control form-control-lg hide-input col s5",{
                                            "is-invalid": errors.trials
                                        })}/>
                                    {errors.trials && (
                                        <div className="invalid-feedback col s3">
                                            {errors.trials}
                                        </div>
                                    )}
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
                                {/* { this.state.startEntryTime && */}
                                <div className="row" style={{marginTop: "20px", display: this.state.startEntryTime ? 'block' : 'none'}}>
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
                                                    ref={this.endTimeRef}
                                                    type={"END"} 
                                                    startTime={this.state.startEntryTime} 
                                                    selectedDate={this.state.endEntryTime}
                                                    updateSelectedEndEntryTime={this.updateSelectedEndEntryTime}/>
                                            </div>
                                        </Modal>
                                    </div>
                                </div>
                                {/* } */}
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <Divider />
                        <ExpansionPanel square >
                            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1d-content" id="panel1d-header">
                                <Typography>Cài đặt đề kiểm tra</Typography>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails className={this.classes.details} style={{paddingBottom: 0}}>
                                <div className={this.classes.column + " blue-text text-darken-3 bold"} style={{width: '33.33%'}}>
                                    Mã đề thi
                                </div>
                                <div className={this.classes.column + " blue-text text-darken-3 bold"} style={{width: '33.33%'}}>
                                    Tên bài kiểm tra
                                </div>
                                <div className={this.classes.column + " blue-text text-darken-3 bold"} style={{width: '33.33%'}}>
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
                                    <ExpansionPanelDetails className={this.classes.details} style={{paddingBottom: 0}}>
                                        <div className={this.classes.column} style={{width: '33.33%'}}>
                                            {test.testCode}
                                        </div>
                                        <div className={this.classes.column} style={{width: '60.33%'}}>
                                            {test.title}
                                            {/* <a href="#dateTimePicker" className="modal-trigger" style={{textDecorationLine: 'underline'}}>Cai dat thoi gian phat</a>
                                            <Modal id="dateTimePicker" options={{ preventScrolling: false }} actions={<Button style={{display: 'none'}}></Button>}> 
                                                <div>
                                                    <h5 className="center" style={{marginTop: 0}}>Cai dat thoi gian phat</h5>
                                                    <Divider style={{marginBottom: "1vw"}}/>
                                            </Modal> */}
                                        </div>
                                        <div className={this.classes.column} style={{width: '6.33%'}}>
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
                                {errors.tests && (
                                        <div className="invalid-feedback" style={{padding: 0}}>
                                            {errors.tests}
                                        </div>
                                    )}
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
                                            <FormControlLabel value="0" className="exam-radio-primary" control={<Radio color="primary" />} label="Không" />
                                            <FormControlLabel value="1" className="exam-radio-primary" control={<Radio color="primary" />} label="Có" />
                                        </RadioGroup>
                                    </FormControl>
                                    </div>
                                </div>
                                {/* <div className="row" style={{marginTop: "20px"}}>
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
                                </div> */}
                                <div className="row center-content" style={{marginTop: "20px"}}>
                                    <div className="col s2" style={{padding: 0}}>
                                        <label htmlFor="title" className="inputLabel" style={{paddingLeft: 0}}>Hiển thị đáp án:</label>
                                    </div>
                                    <div className="col s10" style={{padding: 0}}>
                                        <FormControl component="fieldset">
                                            <RadioGroup aria-label="mark" name="isMarkSaved" value={this.state.isShowAnswers} 
                                                        style={{display: 'inline-block'}}
                                                        onChange={this.handleShowAnswers}>
                                                <FormControlLabel value="0" className="exam-radio-primary" control={<Radio color="primary" />} label="Không" />
                                                <FormControlLabel value="1" className="exam-radio-primary" control={<Radio color="primary" />} label="Có" />
                                            </RadioGroup>
                                        </FormControl>
                                    </div>
                                    {/* <FormControl required component="fieldset" className={classes.formControl}>
                                        <FormGroup>
                                        <FormControlLabel
                                            control={<CustomCheckbox value="send" />}
                                            label="File word qua mail"
                                        />
                                        </FormGroup>
                                    </FormControl> */}
                                </div>
                                {this.state.isShowAnswers === '1' && 
                                    <div className="row center-content" style={{marginTop: "20px"}}>
                                        <div className="col s2" style={{padding: 0}}>
                                            <label htmlFor="title" className="inputLabel" style={{paddingLeft: 0}}>Hiển thị lời giải:</label>
                                        </div>
                                        <div className="col s10" style={{padding: 0}}>
                                            <FormControl component="fieldset">
                                                <RadioGroup aria-label="mark" name="isMarkSaved" value={this.state.isShowExplanation} 
                                                            style={{display: 'inline-block'}}
                                                            onChange={this.handleShowExplanation}>
                                                    <FormControlLabel value="0" className="exam-radio-primary" control={<Radio color="primary" />} label="Không" />
                                                    <FormControlLabel value="1" className="exam-radio-primary" control={<Radio color="primary" />} label="Có" />
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                    </div>
                                }
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                        </div>
                        <div>
                            <Divider/>
                            <a className=" modal-action modal-close black-text lighten-1" style={{ marginTop: "1vw", float: "left", fontSize: "1vw" }}>Hủy thao tác</a>
                            {this.checkValidSubmit() &&
                                <button type="submit" className=" modal-action modal-close blue-text lighten-1" 
                                style={{ marginTop: "1vw", float: "right", background: "none", border: "none", padding: "0", cursor: "pointer", fontSize: "1vw" }}>Hoàn tất</button>
                            }
                        </div>
                    </form>
                </div>
            </MuiPickersUtilsProvider>
        )
    }
}

ExamForm.propTypes = {
    //classes: PropTypes.object.isRequired,
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
  )(ExamForm);