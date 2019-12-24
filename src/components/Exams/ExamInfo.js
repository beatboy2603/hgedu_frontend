import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Divider from '@material-ui/core/Divider';
import MuiExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import axios from 'axios';
import { Link, Prompt, withRouter } from 'react-router-dom';
import {CustomCheckbox} from '../common/CustomCheckbox'
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import {serverUrl} from '../common/common'

  const ExpansionPanelDetails = withStyles(theme => ({
    root: {
      backgroundColor: 'rgba(0, 0, 0, .03)',
      padding: '24px',
    },
  }))(MuiExpansionPanelDetails);

class ExamInfo extends Component {

    constructor(props) {
        super(props);

        this.state = {
            exam: {},
            trialsStatus: '',
            resultList: [],
            location: this.props.location,
            isBlocking: false,
            studentClass: {},
            isAccept: false
        }

        this.getExam = this.getExam.bind(this);
        this.getExamResult = this.getExamResult.bind(this);
        this.getExamStatus = this.getExamStatus.bind(this);
        this.getTrialStatus = this.getTrialStatus.bind(this);

        this.handleDoExam = this.handleDoExam.bind(this);
        this.showDoExamButton = this.showDoExamButton.bind(this);
        this.handleAccept = this.handleAccept.bind(this);
    }

    shouldReload = false;

    handleAccept = () => {
        this.setState({isAccept: !this.state.isAccept});
    }

    showDoExamButton = () => {
        let exam = this.state.exam;
        let resultList = this.state.resultList;
        let startTimeStr = exam.startEntryTime;
        let endTimeStr = exam.endEntryTime;
        let startTime = new Date(startTimeStr);
        let endTime = new Date(endTimeStr);

        //between start and end time
        if(startTime !== 'Invalid Date' && startTime <= new Date()) {
            if(endTimeStr === '0000-00-00 00:00:00' || (endTime !== 'Invalid Date' && new Date() <= endTime)) {
                //trials = 0 or nthTrial < trials
                if(exam.trials === 0 || resultList.length === 0 || resultList[0].nthTrial < exam.trials) {
                    return true;
                }
            }
        } else {
            return false;
        }
    }

    handleDoExam = () => {
        localStorage.setItem("exam", JSON.stringify(this.state.exam));
        localStorage.setItem("studentClass", JSON.stringify(this.state.studentClass));
        let nthTrial = -1;
        if(this.state.resultList) {
            if(this.state.resultList.length === 0) {
                nthTrial = 1;
            } else if(this.state.resultList[0].nthTrial < this.state.exam.trials) {
                nthTrial = this.state.resultList[0].nthTrial + 1;
            }
        }
        localStorage.setItem("nthTrial", nthTrial);
        window.open("/doExam", "_blank");
    }

    getExam = async (examId) => {
        const res = await axios.get(serverUrl + "api/exam/" + examId);
        if(res.data) {
            this.setState({exam: res.data});
        }
    }

    getExamResult = async (examId, userId, classId) => {
        const res = await axios.get(serverUrl + "api/exam/" + examId + "/result/" + classId + "/" + userId);
        if(res.data) {
            this.setState({resultList: res.data});
        }
    }

    getExamStatus = (startTime, endTime) => {
        let currentDateTime = new Date();
        if(currentDateTime < new Date(startTime)) {
            return 'Chưa mở';
        } else if (currentDateTime >= new Date(startTime) && (endTime === '0000-00-00 00:00:00' || currentDateTime < new Date(endTime))) {
                return 'Đang mở';
        } else {
            console.log(">>there")
            return 'Đã đóng';
        }
    }

    getTrialStatus = () => {
        let exam = this.state.exam;
        let resultList = this.state.resultList;
        if(exam && resultList) {
            if(exam.trials === 0) {
                return 'Không giới hạn';
            } else if (resultList.length === 0) {
                return 1 + ' / ' + exam.trials
            } else if (exam.trials === resultList[0].nthTrial) {
                return 'Hết lượt';
            } else {
                return (resultList[0].nthTrial + 1) + ' / ' + exam.trials
            }
        } else {
            return 'N/A';
        }
    }

    componentWillMount() {
    //     this.unlisten = this.props.history.listen((location, action) => {
    //         if(location !== this.state.location) {
    //             window.onbeforeunload = () => false
    //         }
    //     });
    //     this.unblock = this.props.history.block(targetLocation => {
    //         // take your action here     
    //         return false;
    //    });
      }
    
      componentWillUnmount() {
        // this.unlisten();
        //this.unblock();
        //window.onbeforeunload = null;
        clearInterval(this.reloadPage);
        console.log("unmounting")
    }

    shouldComponentUpdate() {
        if(localStorage.getItem("reloadResult")) {
            return true;
        }
        return true;
    }

    componentDidUpdate() {
        console.log(this.state.resultList);
    }

    componentDidMount() {
        this.reloadPage = setInterval(() => {
            window.onblur = () => {
                this.shouldReload = true;
            }
            if(this.shouldReload) {
                this.shouldReload = false;
                clearInterval(this.reloadPage)
                window.location.reload();
            }
            if(localStorage.getItem("reloadResult")) {
                localStorage.removeItem("reloadResult");
                clearInterval(this.reloadPage);
                window.location.reload();
            }
        }, 1000);
        if(this.props.location.state) {
            let examId = this.props.location.state.id;
            console.log("examId", examId);
            console.log("class", this.props.location.state.studentClass)
            let userId = this.props.user.uid;
            this.getExam(examId);
            this.getExamResult(examId, userId, this.props.location.state.studentClass.id);
            this.setState({studentClass: this.props.location.state.studentClass})
        }
    }

    render() {
        const {columnStyle} = this.props;
        return(
            <div className="padding-filler-nav" style={{width: '50%', margin: '0 auto'}}>
                <div className="row" style={{marginTop: "20px"}}>
                    <label htmlFor="title" className="col s2" style={{paddingLeft: 0, fontSize: '1rem'}}>
                        Chủ đề:
                    </label>
                    <div className="col s10">{this.state.exam ? this.state.exam.title : 'N/A'}</div>
                </div>
                <div className="row" style={{marginTop: "20px"}}>
                    <label htmlFor="title" className="col s2" style={{paddingLeft: 0, fontSize: '1rem'}}>
                        Mã bài thi:
                    </label>
                    <div className="col s10">{this.state.exam && this.state.exam.code ? (this.state.exam.code.trim() !== '' ? this.state.exam.code : 'N/A') : 'N/A'}</div>
                </div>
                <div className="row" style={{marginTop: "20px"}}>
                    <label htmlFor="title" className="col s2" style={{paddingLeft: 0, fontSize: '1rem'}}>
                        Thời lượng:
                    </label>
                    <div className="col s10">{this.state.exam ? (this.state.exam.duration === 0 ? 'Không giới hạn' : this.state.exam.duration) : 'N/A'} phút</div>
                </div>
                <div className="row" style={{marginTop: "20px"}}>
                    <label htmlFor="title" className="col s2" style={{paddingLeft: 0, fontSize: '1rem'}}>
                        Trạng thái:
                    </label>
                    <div className="col s10">{this.state.exam ? this.getExamStatus(this.state.exam.startEntryTime, this.state.exam.endEntryTime) : 'N/A'}</div>
                </div>
                <div className="row" style={{marginTop: "20px"}}>
                    <label htmlFor="title" className="col s2" style={{paddingLeft: 0, fontSize: '1rem'}}>
                        Lần làm bài:
                    </label>
                    <div className="col s10">{this.getTrialStatus()}</div>
                </div>
                <div className="row" style={{marginTop: "20px"}}>
                    <label htmlFor="title" className="col s2" style={{paddingLeft: 0, fontSize: '1rem'}}>
                        Thời gian mở đề:
                    </label>
                    <div className="col s10">{this.state.exam ? this.state.exam.startEntryTime : 'Không xác định'}</div>
                </div>
                <div className="row" style={{marginTop: "20px"}}>
                    <label htmlFor="title" className="col s2" style={{paddingLeft: 0, fontSize: '1rem'}}>
                        Thời gian đóng:
                    </label>
                    <div className="col s10">{this.state.exam && this.state.exam.endEntryTime !== '0000-00-00 00:00:00' ? this.state.exam.endEntryTime : 'Không xác định'}</div>
                </div>
                <div className="row" style={{marginTop: "20px", display: 'flex', justifyContent: 'center'}}>
                    {((this.state.exam && this.showDoExamButton())  &&
                        // <Link to='/doExam' onClick={() => {localStorage.setItem("exam", this.state.exam); window.close();}} target="_blank" >
                        this.state.exam.trials === 1) &&
                            <>
                                <div className="invalid-feedback" style={{padding: 0}}>
                                    Chú ý: Bài thi sẽ kết thúc nếu thí sinh mở tab hay ứng dụng khác trong quá trình làm bài.
                                </div>
                                <div className="button-primary">
                                    <FormControl component="fieldset">
                                        <FormControlLabel
                                            control={<CustomCheckbox />}
                                            label="Tôi đã đọc chú ý trên"
                                            onChange={this.handleAccept}
                                        />
                                    </FormControl>
                                    <Button variant="contained" color="primary" disabled={this.state.isAccept ? false : true} onClick={this.handleDoExam}>Làm bài thi</Button>
                                </div>
                            </>
                    }
                    {((this.state.exam && this.showDoExamButton())  &&
                        // <Link to='/doExam' onClick={() => {localStorage.setItem("exam", this.state.exam); window.close();}} target="_blank" >
                        this.state.exam.trials !== 1) &&
                            <div className="button-primary">
                                <Button variant="contained" color="primary" onClick={this.handleDoExam}>Làm bài thi</Button>
                            </div>
                        // </Link>
                    }
                </div>
                <div className="examTrialHistory">
                <ExpansionPanelDetails style={{paddingBottom: 0, backgroundColor: 'white'}}>
                    <div className=" blue-text text-darken-3 bold" style={columnStyle}>
                        Lần thi thứ
                    </div>
                    <div className=" blue-text text-darken-3 bold" style={columnStyle}>
                        Kết quả
                    </div>
                    <div className=" blue-text text-darken-3 bold" style={columnStyle}>
                        Trạng thái
                    </div>
                    <div className=" blue-text text-darken-3 bold" style={columnStyle}>
                        Đáp án
                    </div>
                </ExpansionPanelDetails>
                <Divider/>
                { this.state.resultList && this.state.resultList.map(item => 
                    <div key={item.id}>
                        <ExpansionPanelDetails style={{paddingBottom: 0}}>
                            <div style={columnStyle}>
                                {item.nthTrial}
                            </div>
                            <div style={columnStyle}>
                                {item.mark}
                             </div>
                            <div style={columnStyle}>
                                {item.isCompleted ? 'Hoàn tất' : 'Chưa hoàn tất'}
                            </div>
                            <div style={columnStyle}>
                                {//item.isCompleted ? <Link>Xem đáp án</Link> : 
                                'Không hỗ trợ'}
                            </div>
                        </ExpansionPanelDetails>
                        <Divider/>
                    </div> 
                )}
                </div>
                <Prompt
                    when={this.state.isBlocking}
                    message={location =>
                        `Are you sure you want to go to ${location.pathname}`
                    }
        />
            </div>
        )
    }
}

ExamInfo.propTypes = {
    user: PropTypes.object.isRequired,
    columnStyle: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    user: state.user,
    columnStyle: {
        width: '25%', 
        flexBasis: '25%', 
        fontStyle: 'bold',
        textAlign: 'center'
    }
})

export default connect(mapStateToProps)(withRouter(ExamInfo));