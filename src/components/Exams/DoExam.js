import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import PropTypes from 'prop-types';
import RadioGroup from '@material-ui/core/RadioGroup';
import axios from 'axios';
import ContentContainer from './ContentContainer';
import {serverUrl} from '../common/common';

class DoExam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            questionList: [],
            hour: 0,
            minute: 0,
            second: 0,
            studentAnswers: {},
            exam: {},
            studentClass: {},
            nthTrial: -1,
            trialStatus: '',
            counterSet: false,
            examResult: {},
            submitMessage: '',
        }

        this.handler = this.handler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeAnswer = this.handleChangeAnswer.bind(this);

        this.getExamAttempt= this.getExamAttempt.bind(this);
        this.getInitialCounter = this.getInitialCounter.bind(this);
        this.getTime = this.getTime.bind(this);
        this.getTest = this.getTest.bind(this);
    }

    executed = false;

    handleChangeAnswer = (e) => {
        if(e.target) {
            console.log("studentAnswers", this.state.studentAnswers)
            let questionId = e.target.name;
            let answerId = e.target.value;
            console.log(questionId, answerId)
            this.setState({studentAnswers: {...this.state.studentAnswers, [questionId]: answerId}});
        }
    }

    getTime = () => {
        const {hour, minute, second} = this.state;
        let timeStr = (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second);
        return timeStr;
    }

    getInitialCounter = (duration) => {
        console.log("come here")
        let hour = Math.floor(duration/60);
        let minute = duration%60;
        let second =  0;
        this.setState({hour, minute, second});
    }

    getExamAttempt = async (examId, userId) => {
        const res = await axios.get(serverUrl + "api/exam/" + examId + "/" + userId + "/latest");
        if(res.data) {
            this.setState({examResult: res.data});
        }
    }

    getTest = async (examId, nthTrial, userId, classId) => {
        console.log(examId, userId, nthTrial)
        const res = await axios.get(serverUrl + "api/doExam/" + examId + "/" + userId + '/' + classId + '/' + nthTrial);
        if(res.data) {
            if(res.data === 'Hết lượt') {

            } else {
                console.log("data", res.data);
                this.setState({questionList: res.data})
            }
        }
    }

    handleSubmit = () => {
        if(this.executed === false) {
            this.executed = true;
            clearInterval(this.myInterval);
            let examId = this.state.exam.id;
            let userId = this.props.user.uid;
            console.log("answers", this.state.studentAnswers)
            axios.post(serverUrl + "api/doExam/" + examId + "/" + userId, this.state.studentAnswers)
            .then(res => {
                if(res.data) {
                    console.log(res.data);
                    localStorage.setItem("reloadResult", 1);
                    this.setState({submitMessage: 'Nộp bài thành công!', questionList: []})
                }
            }).catch(error => {
                console.log(error);
            });
        }
    }

    handler = (ev) => 
    {  
        ev.preventDefault();
        return ev.returnValue = 'Are you sure you want to close?';
    }

    componentDidMount() {
        if(localStorage.getItem("exam") === undefined || 
            localStorage.getItem("studentClass") === undefined || 
            localStorage.getItem("nthTrial") === undefined) {
            console.log("here")
        } else {
            let exam = JSON.parse(localStorage.getItem("exam"));
            let studentClass = JSON.parse(localStorage.getItem("studentClass"));
            let nthTrial = Number(localStorage.getItem("nthTrial"));
            if(exam && studentClass && !Number.isNaN(nthTrial)) {
                // this.getExamAttempt(exam.id, this.props.user.uid);
                console.log("trial", nthTrial);
                //get exam checked
                if(nthTrial !== -1) {
                    //get hour, minute, second
                    this.getInitialCounter(exam.duration);
                    //get test 
                    console.log("get test")
                    this.getTest(exam.id, nthTrial, this.props.user.uid, studentClass.id);
                    this.setState({
                        exam,
                        studentClass,
                        nthTrial,
                    });
                }
                //get test 
                //get student checked
                //get class checked
                localStorage.removeItem("exam");
                localStorage.removeItem("studentClass");
                localStorage.removeItem("nthTrial");
            }
        }
        window.addEventListener("beforeunload",this.handler);
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
        
                document.querySelector(this.getAttribute('href')).scrollIntoView({
                    behavior: 'smooth'
                });
            });
        });
    }

    componentDidUpdate() {
        if(this.state.exam) {
            if(this.state.nthTrial === this.state.exam.trials) {
                
            } else if ((this.state.nthTrial + 1) === this.state.exam.trials) {

            }
        }
        if((this.state.hour !== 0 || this.state.minute !== 0 || this.state.second !== 0) && this.state.counterSet === false && JSON.stringify(this.state.questionList) !== JSON.stringify([])) {
            console.log("o day")
            this.setState({counterSet: true})
            this.getExamAttempt(this.state.exam.id, this.props.user.uid);
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
            
                    document.querySelector(this.getAttribute('href')).scrollIntoView({
                        behavior: 'smooth'
                    });
                });
            });
            this.myInterval = setInterval(() => {
                const { second, minute, hour } = this.state
                console.log("minute", minute)
                
                if (second > 0) {
                    this.setState(({ second }) => ({
                        second: second - 1
                    }))
                }
                if (second === 0) {
                    if (minute === 0) {
                        if (hour === 0) {
                            clearInterval(this.myInterval);
                            this.handleSubmit();
                        } else {
                            this.setState(({ hour }) => ({
                                hour: hour - 1,
                                minute: 59,
                                second: 59
                            }))
                        }
                    } else {
                        this.setState(({ minute }) => ({
                            minute: minute - 1,
                            second: 59
                        }))
                    }
                } 
            }, 1000)
        }
    }

    componentWillUnmount() {
        clearInterval(this.myInterval);
        window.removeEventListener("beforeunload", this.handler);
    }

    render() {
        return(
            <div>
                <div className="row" style={{marginBottom: 0, maxHeight: '100vh', overflow: 'hidden'}}>
                    <div className="col s10 no-padding expand-table">
                        <div className="ExamTitle" style={{textAlign: 'center', height: '100%', position: 'sticky', top: 0}}>
                            <h5 className="blue-text text-darken-3 bold" style={{paddingTop: '1vh', marginTop: 0, marginBottom: 0, paddingBottom: '1vh'}}>{this.state.exam ? this.state.exam.title : 'N/A'}</h5>
                        </div>
                        <div style={{overflow:'auto', top: '6vh', height: '94vh', left: 0}}>
                            {this.state.questionList && this.state.questionList.map((question, parentIndex) =>
                                <Paper id={"cau-" + (parentIndex + 1)} style={{width: '100%', marginBottom: '1vh'}}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell rowSpan={2} className="table-col-width-10" style={{borderRight: '0.1em solid #e0e0e0', position: 'relative'}}>
                                                    <h6 className="blue-text text-darken-3 bold" style={{top: 0, left: '16px', position: 'absolute'}}>Câu {parentIndex + 1}</h6>
                                                </TableCell>
                                                <TableCell>
                                                    <ContentContainer content={JSON.parse(question.mainQuestion.content ? question.mainQuestion.content.replace(/\n/g, "\\n") : question.mainQuestion.content)} />
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                {question.mainQuestion.questionParentId === 0 && question.mainAnswers &&
                                                    <TableCell>
                                                        <FormControl component="fieldset">
                                                            <RadioGroup aria-label="mark" name={question.mainQuestion.questionId} onChange={this.handleChangeAnswer}>
                                                                {question.mainAnswers && question.mainAnswers.map((answer, answerIndex) =>
                                                                    <FormControlLabel value={'' + answer.answerId} 
                                                                                    className="radio-primary" 
                                                                                    style={{alignItems: 'flex-start'}} 
                                                                                    control={<Radio color="primary" />} 
                                                                                    label={<ContentContainer content={JSON.parse(answer.content ? answer.content.replace(/\n/g, "\\n") : answer.content)} />}
                                                                    />
                                                                )}
                                                            </RadioGroup>
                                                        </FormControl>
                                                    </TableCell>
                                                }
                                                {question.mainAnswers === null && question.childQuestion &&  
                                                    <TableCell style={{padding: 0}}>
                                                        <Table>
                                                            <TableBody>
                                                                {question.childQuestion.map((child, childIndex) =>
                                                                <>
                                                                <TableRow>
                                                                    <TableCell rowSpan={2} className="table-col-width-10" style={{borderRight: '0.1em solid #e0e0e0', position: 'relative'}}>
                                                                        <h6 className="blue-text text-darken-3 bold" style={{top: 0, left: '16px', position: 'absolute'}}>Câu {parentIndex + 1} - {childIndex + 1}</h6>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <ContentContainer content={JSON.parse(child.mainQuestion.content ? child.mainQuestion.content.replace(/\n/g, "\\n") : child.mainQuestion.content)} />
                                                                    </TableCell>
                                                                </TableRow>
                                                                <TableRow>
                                                                    <TableCell>
                                                                        <FormControl component="fieldset">
                                                                            <RadioGroup aria-label="mark" name={child.mainQuestion.questionId} onChange={this.handleChangeAnswer}>
                                                                            {child.mainAnswers && child.mainAnswers.map((answer, answerIndex) =>
                                                                                <FormControlLabel value={'' + answer.answerId} 
                                                                                                className="radio-primary" 
                                                                                                style={{alignItems: 'flex-start'}} 
                                                                                                control={<Radio color="primary" />} 
                                                                                                label={<ContentContainer content={JSON.parse(answer.content ? answer.content.replace(/\n/g, "\\n") : answer.content)} />}
                                                                                />
                                                                            )}
                                                                            </RadioGroup>
                                                                        </FormControl>
                                                                    </TableCell>
                                                                </TableRow>
                                                                </>
                                                                )}
                                                            </TableBody>
                                                        </Table>
                                                    </TableCell>
                                                }
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Paper>
                            )}
                        </div>
                    </div>
                    <div className="col s2 z-depth-3 grey lighten-5"></div>
                    <div className="col s2 z-depth-2 grey lighten-4" style={{height: '100vh', position: 'sticky', top: 0}}>
                        {/* filler */}
                            <div className="blue-text" style={{marginTop: "20px"}}>Điều hướng câu hỏi</div>
                            <div className="QuizNavigation" style={{maxHeight: '40%', padding: '10px', overflow: 'auto'}}>
                                {this.state.questionList && this.state.questionList.map((question, parentIndex) =>
                                    <Button href={"#cau-" + (parentIndex + 1)} style={{minWidth: '40px'}}>
                                        {parentIndex + 1}
                                    </Button>
                                )}
                            </div>
                            <Divider />
                            <div className="space-top">
                                <div className="blue-text">Thời gian còn lại</div>
                                <div>
                                    <h4 className="blue-text text-darken-3 bold" style={{textAlign: 'center'}}>
                                        {this.getTime()}
                                    </h4>
                                </div>
                            </div>
                            <div className="space-top">
                                <div className="blue-text" style={{marginTop: "20px"}}>Thông tin cơ bản</div>
                                <div className="row" style={{marginTop: "10px", padding: '0 0.75rem', marginBottom: '10px'}}>
                                    <label htmlFor="title" className="col s4" style={{paddingLeft: 0, fontSize: '1rem'}}>
                                        Mã bài thi:
                                    </label>
                                    <div className="col s8">{this.state.exam ? this.state.exam.code : 'N/A'}</div>
                                </div>
                                <div className="row" style={{padding: '0 0.75rem', marginBottom: '10px'}}>
                                    <label htmlFor="title" className="col s4" style={{paddingLeft: 0, fontSize: '1rem'}}>
                                        Họ tên:
                                    </label>
                                    <div className="col s8">{this.props.user.name}</div>
                                </div>
                                <div className="row" style={{padding: '0 0.75rem', marginBottom: '10px'}}>
                                    <label htmlFor="title" className="col s4" style={{paddingLeft: 0, fontSize: '1rem'}}>
                                        Lớp:
                                    </label>
                                    <div className="col s8">{this.state.studentClass ? this.state.studentClass.name : 'N/A'}</div>
                                </div>
                                <div className="row" style={{padding: '0 0.75rem', marginBottom: '10px'}}>
                                    <label htmlFor="title" className="col s4" style={{paddingLeft: 0, fontSize: '1rem'}}>
                                        Lần thi:
                                    </label>
                                    <div className="col s">{this.state.exam ? (this.state.nthTrial !== -1 ? this.state.nthTrial + '/' + this.state.exam.trials : 'N/A') : 'N/A'}</div>
                                </div>
                            </div>
                            <div className="space-top button-primary" >
                                <Button variant="contained" size="large" color="primary" style={{minWidth: '100%'}} onClick={this.handleSubmit}>Nộp bài</Button>
                            </div>
                            <div className="space-top" >
                                <h6 className="blue-text text-darken-3 bold" style={{textAlign: 'center'}}>
                                    {this.state.submitMessage}
                                </h6>
                            </div>
                            {/* <Route exact path={'/testManagement'} render={ () => <TestManagement type="CURRENT"/>} />
                            <Route path={'/testManagement/history'} render={(props) => <KnowledgeGroup {...props} setQuestionFolderId={this.setQuestionFolderId} />} /> */}
                    </div>
                </div>
            </div>
        )
    }
}

DoExam.propTypes = {
    user: PropTypes.object.isRequired,
}

const mapStateToProps = state => ({
    user: state.user,
})

export default connect(
    mapStateToProps)(DoExam);