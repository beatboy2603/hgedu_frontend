import React, { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import SimpleTable from "../common/TempTable2";
import SimpleTable2 from "../common/TempTable3";
import SimpleTable4 from "../common/TempTable4";
import SimpleTable5 from "../common/TemplateTable5";
import { Modal, Button } from "react-materialize";
import GmailTreeView from "./Folder";
import TreeViewParent from "./TreeView";
import PropTypes from "prop-types";
import StudentList from '../StudentClassManagement/StudentList'
import TeacherList from "../StudentClassManagement/TeacherList"
import axios from 'axios';
import {
  getClasses1,
  createClass,
  deleteClass,
  getStudents,
  deleteStudent,
  getGrade,
  getClassStudents,
  getParent,
  getStudentTeacher,
  getConnnectedStudent,
  deleteStudentTeacher,
  getStudentTeacher1,
  getConnnectedTeacher,
  getClassesByStudentId,
  getTeacher,
  getClassStudentsByStudentId,
  getExamByClassId,
  getStudentsByParentId,
  parentGetTeacherByStudentId
} from "../../actions/classAction";
import {serverUrl} from '../common/common'

class StudentManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      className: "Danh sách",
      treeStatus: false,
      name: "",
      teacherId: "",
      errors: {},
      classes: [],
      students: [],
      grade: [],
      classStudent: [],
      isUpdate: true,
      parent: {},
      studentTeacher: [],
      connectedStudent: [],
      teacher: "",
      exams: [],
      studentByParentId: [],
      parentGetTeacher: [],
      filteredStudentTeacher:[],
      currentClassId: ""
    };

    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onClickABC = this.onClickABC.bind(this);
    this.onClickABC2 = this.onClickABC2.bind(this);
    this.submidAddStudent = this.submidAddStudent.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({ errors: nextProps.errors });
    }

    // if (
    //   JSON.stringify(nextProps.classes) !== JSON.stringify(this.props.classes)
    // ) {
      if (
        JSON.stringify(nextProps.classes) !== JSON.stringify(this.state.classes)
      ) {
        console.log("cai dm");
        this.setState({
          classes: nextProps.classes
        });
      }
    // }

    if (JSON.stringify(nextProps.grade) !== JSON.stringify(this.state.grade)) {
      this.setState({
        grade: nextProps.grade
      });
    }
    if (
      JSON.stringify(nextProps.connectedStudent) !==
      JSON.stringify(this.state.connectedStudent)
    ) {
      this.setState({
        connectedStudent: nextProps.connectedStudent
      });
    }
    if (
      JSON.stringify(nextProps.parentGetTeacher) !==
      JSON.stringify(this.state.parentGetTeacher)
    ) {
      this.setState({
        parentGetTeacher: nextProps.parentGetTeacher
      });
    }

    if (
      JSON.stringify(nextProps.studentByParentId) !==
      JSON.stringify(this.state.studentByParentId)
    ) {
      this.setState({
        studentByParentId: nextProps.studentByParentId
      });
    }

    if (nextProps.students !== this.props.students) {
      this.setState({
        students: nextProps.students
      });
    }

    if (nextProps.teacher !== this.state.teacher) {
      this.setState({
        teacher: nextProps.teacher
      });
    }

    if (
      JSON.stringify(nextProps.classStudent) !==
      JSON.stringify(this.state.classStudent)
    ) {
      this.setState({
        classStudent: nextProps.classStudent
      });
    }

    if (
      JSON.stringify(nextProps.studentTeacher) !==
      JSON.stringify(this.state.studentTeacher)
    ) {
      this.setState({
        studentTeacher: nextProps.studentTeacher
      });
    }

    if (JSON.stringify(nextProps.exams) !== JSON.stringify(this.state.exams)) {
      this.setState({
        exams: nextProps.exams
      });
    }

    if (nextProps.parent !== this.state.parent) {
      this.setState({
        parent: nextProps.parent
      });
    }
  }

  componentDidUpdate() {
    console.log(this.state.errors);
  }

  changeClassName = value => {
    this.setState({
      className: value
    });
  };

  changeCurrentClassId = value => {
    this.setState({
      currentClassId: value
    });
  };

  

  changeTeacherState = value => {
    this.props.getTeacher(value);
  };

  changeTreeStatus = value => {
    this.setState({
      treeStatus: value
    });
  };

  filterStudentTeacher = () => {
    let filteredStudentTeacher = this.state.studentTeacher.filter((el, i)=>{
      let found = false;
      this.state.students.map((subEl, i)=>{
        if(el.studentId== subEl.userId){
          found = true;
        }
      })
      if(!found){
        return el;
      }
    })
    this.setState({
      filteredStudentTeacher
    })
  }

  componentDidMount() {
    console.log("ROLEI_ID", this.props.user.userRoleId);
    if (this.props.user.userRoleId == 1) {
      console.log("ROLEI_ID_1", this.props.user.userRoleId);
      this.props.getStudentTeacher(this.props.user.uid);
      this.props.getConnnectedStudent(this.props.user.uid);
      this.props.getClasses1(this.props.user.uid);
    } else if (this.props.user.userRoleId == 2) {
      console.log("ROLEI_ID_2", this.props.user.userRoleId);
      this.props.getStudentTeacher1(this.props.user.uid);
      this.props.getConnnectedTeacher(this.props.user.uid);
      this.props.getClassesByStudentId(this.props.user.uid);
      this.props.getClassStudentsByStudentId(this.props.user.uid);
      this.props.getExamByClassId();
    } else {
      console.log("ROLEI_ID_3", this.props.user.userRoleId);
      this.props.getStudentsByParentId(this.props.user.uid);
    }
  }

  onChange(e) {
    const  id  = this.props.user.uid;
    this.setState({
      name: e.target.value,
      teacherId: id
    });
  }

  onClickABC() {
    console.log(this.state.classes);
  }

  onClickABC2() {
    console.log(this.state.classes);
  }

  onSubmit(e) {
    e.preventDefault();
    const newClass = {
      name: this.state.name,
      teacherId: this.props.user.uid,
    };
    let classes = this.state.classes;
    if (classes) {
      let check = classes.filter(class1 => {
        return class1.name == newClass.name;
      });
      if (check.length != 0) {
        window.confirm("Trùng tên");
      } else {
        this.setState({
          classes: [...classes, newClass]
        })
        // this.props.createClass(newClass);
        axios.post(serverUrl+"api/classManagement/", newClass).then(res=>{
          this.props.getClasses1(this.props.user.uid);
        })
        
        // });
      }
    }
  }

  submidAddStudent = e => {
    console.log("ABC", this.state.filteredStudentTeacher);
    console.log(".zzzz")
    e.preventDefault();

    let classStudent = this.state.classStudent;
    let list = this.state.filteredStudentTeacher.filter(student => {
      return student.status == true;
    });
    list.map(item => {
      let newElement = {
        classId: this.state.currentClassId,
        studentId: item.studentId
      };
      console.log("newStudent", newElement);
      this.setState({
        classStudent: 
        [...classStudent, newElement]
      })
      classStudent.push(newElement);
    });
    axios
      .post("http://localhost:8084/api/classManagement/addStudent/", classStudent)
      .then(res => {
        console.log("leu leu");
        this.props.getStudents(this.state.currentClassId);
        this.props.getClassStudents(this.state.currentClassId);
        console.log(this.state.classStudent);
      });
  };

  render() {
    const style = {
      folder: {
        display: {
          display: "flex",
          paddingTop: "4px",
          paddingBottom: "4px"
        },
        content: {
          margin: "0",
          marginLeft: "8px"
        }
      }
    };

    return (
      <div className="personalLibrary row">
        {/* folder navigation bar and modals*/}

        <div className="row col s3 z-depth-2 grey lighten-4 personalLibrary-nav">
          {/* filler */}
          <div className="col s2"></div>
          <div className="col s10">
            <Link to="/personalLibrary">
              <h5 className="blue-text text-darken-3 bold font-montserrat">
                Học sinh
              </h5>
            </Link>
            {/* modals */}
            <div>
              {/* modal for addFolder */}
              <div className="inline-block">
                {this.props.user.userRoleId == 1 ? (
                  <a href="#addFolder" className="modal-trigger">
                    <i className="material-icons grey-text text-darken-3">
                      create_new_folder
                    </i>
                  </a>
                ) : (
                  <i className="material-icons grey-text text-darken-3">
                    create_new_folder
                  </i>
                )}
                <Modal
                  id="addFolder"
                  options={{ preventScrolling: true }}
                  actions={[]}
                >
                  <div className="modal-content">
                    <h5 className="center">Thêm thư mục</h5>
                    <div className="line"></div>
                    <div className="row">
                      <form className="row col s12">
                        <div className="input-field inline col s12">
                          <input
                            id="folderNameInput"
                            type="text"
                            className="validate"
                            onChange={this.onChange}
                            value={this.state.name}
                          />
                          <label htmlFor="folderNameInput">Tên thư mục</label>
                        </div>
                      </form>
                    </div>
                    <a
                      className="modal-action modal-close black-text lighten-1"
                      style={{ margin: "0 1.5vw", float: "left" }}
                    >
                      Hủy thao tác
                    </a>
                    <a
                      id="buttonAddFolder"
                      className="modal-action modal-close blue-text lighten-1"
                      style={{ margin: "0 1.5vw", float: "right" }}
                      onClick={this.onSubmit}
                    >
                      Hoàn tất
                    </a>
                  </div>
                </Modal>
              </div>
            </div>
            <div className="line"></div>
            {this.props.user.userRoleId === 3 ? (
              <TreeViewParent
                dataItem={this.state.studentByParentId}
                parentGetTeacherFunc={this.props.parentGetTeacherByStudentId}
                changeName = {this.changeClassName}
              />
            ) : (
              <div>
              <GmailTreeView
                role={this.props.user.userRoleId}
                name1={this.changeClassName}
                test={this.state.classes}
                delete1={this.props.deleteClass}
                student={this.props.getStudents}
                classStudent={this.props.getClassStudents}
                changeTreeStatus={this.changeTreeStatus}
                changeTeacherState={this.changeTeacherState}
                changeCurrentClassId={this.changeCurrentClassId}
              />
              
              </div>
            )}
          </div>
        </div>
        {/* filler for navigation bar */}
        <div className="col s3 z-depth-3 grey lighten-5"></div>
        {/* main content */}
        {this.props.user.userRoleId === 3 && (
          <div className="row col s9 no-padding">
            <div className="col s4 container min-height-60 knowledgeGroup-header">
              <h5
                className="blue-text text-darken-3 bold font-montserrat"
                style={{ fontSize: "23px" }}
              >
                {this.state.className}
              </h5>

              <p
                className="grey-text text-darken-1"
                style={{ width: "1000px" }}
              >
                {this.state.parentGetTeacher.length == 0
                  ? "0 lớp học"
                  : this.state.parentGetTeacher.length + " lớp học"}
              </p>
            </div>
            <div className="col s8 container z-depth-1">Quảng cáo</div>
            <div className="col s12 no-padding center">
              <SimpleTable5
                rowData={this.state.parentGetTeacher}
                getGrade={this.props.getGrade}
                grade={this.state.grade}
              />
            </div>
          </div>
        )}
        {this.state.treeStatus ? (
          <div>
            {this.props.user.userRoleId === 1 && (
              <div className="row col s9 no-padding">
                <div className="col s3 container min-height-60 knowledgeGroup-header">
                  <h5
                    className="blue-text text-darken-3 bold font-montserrat"
                    style={{ fontSize: "23px" }}
                  >
                    {this.state.className}
                  </h5>
                  {this.state.students.length == 0 && (
                    <p className="grey-text text-darken-1">0 Học sinh</p>
                  )}
                  {this.state.students.length > 0 && (
                    <p className="grey-text text-darken-1">
                      {this.state.students.length} Học sinh
                    </p>
                  )}
                </div>
                <div className="col s9 container z-depth-1">Quảng cáo</div>
                <div className="col s12 no-padding center">
                  {this.state.students.length > 0 && (
                    <SimpleTable
                      role={this.props.user.userRoleId}
                      data={this.state.classStudent}
                      classStudent={this.state.students}
                      getGrade={this.props.getGrade}
                      grade={this.state.grade}
                      deleteStudent={this.props.deleteStudent}
                      parent={this.state.parent}
                      getParent={this.props.getParent}
                      currentClassId={this.state.currentClassId}
                    />
                  )}
                </div>
              </div>
            )}
            {this.props.user.userRoleId === 2 && (
              <div className="row col s9 no-padding">
                <div className="col s3 container min-height-60 knowledgeGroup-header">
                  <h5
                    className="blue-text text-darken-3 bold font-montserrat"
                    style={{ fontSize: "23px" }}
                  >
                    Danh sách lớp học
                  </h5>

                  <p
                    className="grey-text text-darken-1"
                    style={{ width: "1000px" }}
                  >
                    {this.state.classes.length == 0
                      ? "0 lớp học"
                      : this.state.classes.length + " lớp học"}
                  </p>
                </div>
                <div className="col s9 container z-depth-1">Quảng cáo</div>
                <div className="col s12 no-padding center">
                  {this.state.classes.length > 0 && (
                    <SimpleTable
                      role={this.props.user.userRoleId}
                      classStudent={this.state.classStudent}
                      getGrade={this.props.getGrade}
                      grade={this.state.grade}
                      parent={this.state.parent}
                      getParent={this.props.getParent}
                      classOfStudent={this.state.classes}
                      connectedStudent={this.state.connectedStudent}
                      exams={this.state.exams}
                    />
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {this.props.user.userRoleId === 1 && (
              <div className="col s9">
              <StudentList/>
              </div>
            )}
            {this.props.user.userRoleId === 2 && (
              <div className="row col s9">
                <TeacherList />
              </div>
            )}
          </div>
        )}
        <div>
          {this.props.user.userRoleId == 1 && this.state.treeStatus && (
            <a
              href="#addStudent"
              className="btn-floating btn-large blue my-floating-btn modal-trigger" onClick={()=>{this.filterStudentTeacher()}}
            >
              <i className="material-icons">add</i>
            </a>
          )}
          }
          <Modal
            id="addStudent"
            options={{ preventScrolling: true }}
            actions={[]}
            style={{
              width: "50%",
              height: "80%",
              maxHeight: "80%",
              borderRadius: "15px"
            }}
          >
            <div
              className="modal-content"
              style={{
                position: "absolute",
                top: "0",
                bottom: "0",
                left: "0",
                right: "0",
                overflowY: "scroll"
              }}
            >
              <h5 className="center">Thêm học sinh</h5>
              <div className="line" style={{ marginTop: "30px" }}></div>
              <SimpleTable4
                data={this.state.filteredStudentTeacher}
                connectedStudent={this.state.connectedStudent}
                deleteStudent={this.props.deleteStudentTeacher}
                parent={this.state.parent}
                getParent={this.props.getParent}
                filterStudentTeacher={this.state.filteredStudentTeacher}
              />
              <a
                className="modal-action modal-close black-text lighten-1"
                style={{ margin: "0 1.5vw", float: "left", marginTop: "30px" }}
              >
                Hủy thao tác
              </a>
              <a
                className="modal-action modal-close blue-text lighten-1"
                style={{ margin: "0 1.5vw", float: "right", marginTop: "30px" }}
                onClick={this.submidAddStudent}
              >
                Hoàn tất
              </a>
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

StudentManagement.propTypes = {
  classes: PropTypes.array.isRequired,
  getClasses: PropTypes.func.isRequired,
  createClass: PropTypes.func.isRequired,
  deleteClass: PropTypes.func.isRequired,
  getStudents: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  deleteStudent: PropTypes.func.isRequired,
  getStudent: PropTypes.func.isRequired,
  grade: PropTypes.array.isRequired,
  getClassStudents: PropTypes.func.isRequired,
  getParent: PropTypes.func.isRequired,
  getStudentTeacher: PropTypes.func.isRequired,
  getConnnectedStudent: PropTypes.func.isRequired,
  deleteStudentTeacher: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  teacher: state.class.teacher,
  classes: state.class.classes,
  students: state.class.students,
  grade: state.class.grade,
  errors: state.errors,
  classStudent: state.class.classStudent,
  parent: state.class.parent,
  studentTeacher: state.class.studentTeacher,
  connectedStudent: state.class.connectedStudent,
  exams: state.class.exams,
  studentByParentId: state.class.studentByParentId,
  parentGetTeacher: state.class.parentGetTeacher
});

export default connect(mapStateToProps, {
  getClasses1,
  createClass,
  deleteClass,
  getStudents,
  deleteStudent,
  getGrade,
  getClassStudents,
  getParent,
  getStudentTeacher,
  getConnnectedStudent,
  deleteStudentTeacher,
  getStudentTeacher1,
  getConnnectedTeacher,
  getClassesByStudentId,
  getTeacher,
  getClassStudentsByStudentId,
  getExamByClassId,
  getStudentsByParentId,
  parentGetTeacherByStudentId
})(StudentManagement);
