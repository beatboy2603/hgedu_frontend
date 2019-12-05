import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import ExpandableTable from './ExpandableTable';
import { Modal } from 'react-materialize'
import ExamForm from './ExamForm'
import Divider from '@material-ui/core/Divider';
import Button from 'react-materialize/lib/Button';
import { getExamCurrent, getExamHistory } from '../../../actions/examAction';
import PropTypes from 'prop-types';

class TestManagement extends Component {
    constructor(props) {
        super(props);

        this.state = {
            examMap: [],
            type: ''
        }
    }

    componentWillReceiveProps(nextProps) {
        // if(nextProps.type !== this.props.type) {
        //     if(nextProps.type !== this.state.type)
        //         this.setState({type: nextProps.type})
        // }
        if(nextProps.examsCurrentMap !== this.props.examsCurrentMap) {
            console.log("current")
            if(this.state.type && this.state.type === 'SCHEDULE') {
                if(JSON.stringify(nextProps.examsCurrentMap) !== JSON.stringify(this.state.examMap) ) {
                    console.log("CHANGE SCHEDULE")
                    this.setState({examMap: nextProps.examsCurrentMap})
                }
            }
        }
        if(nextProps.examsHistoryMap !== this.props.examsHistoryMap) {
            console.log("history")
            if(this.state.type && this.state.type === 'HISTORY') {
                if(JSON.stringify(nextProps.examsHistoryMap) !== JSON.stringify(this.state.examMap) ) {
                    console.log("CHANGE HISTORY")
                    this.setState({examMap: nextProps.examsHistoryMap})
                }
            }
        }
    }

    componentDidMount() {
        if(this.props.type) {
            this.setState({type: this.props.type})
            if(this.props.type === 'SCHEDULE') {
                console.log(">>>>>>>CREATE SCHEDULE")
                this.props.getExamCurrent(this.props.user.userId);
            } else {
                console.log(">>>>>>>CREATE HISTORY");
                this.props.getExamHistory(this.props.user.userId);
            }
        } 
    }

    componentDidUpdate() {
        if(this.props.type) {
            console.log("loading update", this.props.type)
            console.log("now", this.state.type)
            if(this.props.type === 'SCHEDULE' && this.props.type !== this.state.type) {
                console.log(">>>>>>>UPDATE SCHEDULE")
                //if(this.props.examsCurrentMap )
                this.props.getExamCurrent(this.props.user.userId);
                this.setState({type: this.props.type})
            } else if (this.props.type === 'HISTORY' && this.props.type !== this.state.type) {
                console.log(">>>>>>>UPDATE HISTORY");
                this.props.getExamHistory(this.props.user.userId);
                this.setState({type: this.props.type})
            }
        } 
    }

    render() {
        return (
            <div className="personalLibrary row">
                {/* folder navigation bar and modals*/}
                <div className="row col s3 z-depth-2 grey lighten-4 personalLibrary-nav">
                    {/* filler */}
                    <div className="col s2"></div>
                    <div className="col s10">
                        <Link to='/testManagement'><h5 className="blue-text text-darken-3 bold">Kiểm tra</h5></Link>
                        <Divider />
                        <div className="space-top link-event">
                            <NavLink to='/testManagement/examHistory' activeClassName="link-active">
                                <div className="icon-text-center">
                                    <i className="material-icons icon-space icon-color-black">
                                        description
                                    </i>
                                    <span className="icon-text-center">
                                        Nhật kí
                                    </span>
                                </div>
                            </NavLink>
                        </div>
                        <div className="space-top link-event">
                            <NavLink to='/testManagement/examSchedule' activeClassName="link-active">
                                <div className="icon-text-center">
                                    <i className="material-icons icon-space icon-color-black">
                                        description
                                    </i>
                                    <span className="icon-text-center">
                                        Kế hoạch
                                    </span>
                                </div>
                            </NavLink>
                        </div>
                        {/* <Route exact path={'/testManagement'} render={ () => <TestManagement type="CURRENT"/>} />
                        <Route path={'/testManagement/history'} render={(props) => <KnowledgeGroup {...props} setQuestionFolderId={this.setQuestionFolderId} />} /> */}
                    </div>
                </div>
                {/* filler for navigation bar */}
                <div className="col s3 z-depth-3 grey lighten-5"></div>
                {/* main content */}
                <div className="row col s9 no-padding">
                    <div className="col s3 container min-height-60 knowledgeGroup-header">
                    { this.state.type && this.state.type === 'SCHEDULE' &&
                        <h5 className="blue-text text-darken-3 bold">D.S. kiểm tra</h5>
                    }
                    { this.state.type && this.state.type === 'HISTORY' &&
                        <h5 className="blue-text text-darken-3 bold">Nhật kí</h5>
                    }
                        <p className='grey-text text-darken-1'>08 bài kiểm tra</p>
                    </div>
                    <div className="col s9 container z-depth-1">
                        Quảng cáo
                    </div>
                    <div className="col s12 no-padding center">
                        <ExpandableTable examMap={this.state.examMap} type={this.state.type} />
                    </div>
                </div>
                <div>
                    <a href="#addExam" className="btn-floating btn-large blue my-floating-btn modal-trigger">
                        <i className="material-icons">add</i>
                    </a>
                    <Modal id="addExam" options={{ preventScrolling: false }} actions={<Button style={{display: 'none'}}></Button>}> 
                        <div>
                            <h5 className="center" style={{marginTop: 0}}>Tạo buổi kiểm tra</h5>
                            <Divider style={{marginBottom: "1vw"}}/>
                            <ExamForm />
                        </div>
                    </Modal>
                </div>
            </div>
        )
    }
}

TestManagement.propTypes = {
    getExamHistory: PropTypes.func.isRequired,
    getExamCurrent: PropTypes.func.isRequired,
    examsCurrentMap: PropTypes.object.isRequired,
    examsHistoryMap: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    examsCurrentMap: state.exam.examsCurrentMap,
    examsHistoryMap: state.exam.examsHistoryMap,
    user: state.user
})

export default connect(mapStateToProps, { getExamCurrent, getExamHistory })(TestManagement);