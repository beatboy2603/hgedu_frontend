import React, { Component } from 'react';
import { Link, NavLink, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ExpandableTable from './ExpandableTable';
import { Modal } from 'react-materialize'
import ExamForm from './ExamForm'
import Divider from '@material-ui/core/Divider';
import Button from 'react-materialize/lib/Button';
import { getStudentClasses } from '../../actions/classAction';
import { getExamsForClass } from '../../actions/examAction';
import PropTypes from 'prop-types';
import StudentExamsTable from './StudentExamsTable';
import ListFilter from '../../components/common/ListFilter'

class StudentExams extends Component {
    constructor(props) {
        super(props);

        this.state = {
            classList: [],
            examList: [],
            currentClassId: null,
            classId: null,
        }

        this.getStandardNumberString = this.getStandardNumberString.bind(this);
    }

    getStandardNumberString = (number) => {
        if(number < 10) {
            return '0' + number;
        } 
        return '' + number;
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.classList !== this.props.classList) {
            if(JSON.stringify(nextProps.classList) !== JSON.stringify(this.state.classList) ) {
                this.setState({classList: nextProps.classList})
            }
        }

        if(nextProps.classExamList !== this.props.examList) {
            if(JSON.stringify(nextProps.classExamList) !== JSON.stringify(this.state.examList) ) {
                console.log('examList',nextProps.classExamList);
                this.setState({examList: nextProps.classExamList})
            }
        }
    }

    componentDidMount() {
        console.log("what the fuck", this.props);
        if(this.props.location.state) {
            this.setState({classId: this.props.location.state.id});
            this.props.getExamsForClass(this.props.location.state.id);
        }
        this.props.getStudentClasses(this.props.user.uid);
    }

    componentDidUpdate() {
        if(this.props.location.state === undefined && this.state.classList.length !== 0) {
            let firstClass = this.state.classList[0];
            this.props.history.push({pathname: '/studentExams/class/' + firstClass.name.replace(/\s/g,'-'), state: {id: firstClass.id}})
        }
        if(this.props.location.state) {
            let classId = this.props.location.state.id;
            if(classId !== this.state.classId) {
                this.setState({classId});
                this.props.getExamsForClass(classId);
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
                        <Link to='/studentExams'><h5 className="blue-text text-darken-3 bold">Kiểm tra</h5></Link>
                        <Divider />
                        {this.state.classList && this.state.classList.map(item => 
                            <div key={item.id} className="space-top link-event">
                                <NavLink to={{pathname: '/studentExams/class/' + item.name.replace(/\s/g,'-'), state: {id: item.id, name: item.name}}} activeClassName="link-active">
                                    <div className="icon-text-center">
                                        <i className="material-icons icon-space icon-color-black">
                                            description
                                        </i>
                                        <span className="icon-text-center">
                                            {item.name}
                                        </span>
                                    </div>
                                </NavLink>
                            </div>
                        )}
                        {/* <Route exact path={'/testManagement'} render={ () => <TestManagement type="CURRENT"/>} />
                        <Route path={'/testManagement/history'} render={(props) => <KnowledgeGroup {...props} setQuestionFolderId={this.setQuestionFolderId} />} /> */}
                    </div>
                </div>
                {/* filler for navigation bar */}
                <div className="col s3 z-depth-3 grey lighten-5"></div>
                {/* main content */}
                <div className="row col s9 no-padding">
                    <div className="row col s12 no-padding">
                        <div className="col s3 container min-height-60 knowledgeGroup-header">
                            <h5 className="blue-text text-darken-3 bold">D.S. kiểm tra</h5>
                            <p className='grey-text text-darken-1'>{this.state.examList ? this.getStandardNumberString(this.state.examList.length) : '00'} bài kiểm tra</p>
                        </div>
                        <div className="col s9 container z-depth-1">
                            Quảng cáo
                        </div>
                    </div>
                    <div className="col s12 no-padding center">
                        <ListFilter/>
                    </div>
                    <div className="col s12 no-padding center">
                        <StudentExamsTable examList={this.state.examList} studentClass={this.props.location&&this.props.location.state ? this.props.location.state : {}}/>
                    </div>
                </div>
            </div>
        )
    }
}

StudentExams.propTypes = {
    getStudentClasses: PropTypes.func.isRequired,
    getExamsForClass: PropTypes.func.isRequired,
    classList: PropTypes.array.isRequired,
    user: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    examsCurrentMap: state.exam.examsCurrentMap,
    classList: state.class._classList,
    classExamList: state.exam.classExamList,
    user: state.user
})

export default connect(mapStateToProps, { getStudentClasses, getExamsForClass })(withRouter(StudentExams));