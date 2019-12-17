// import { GET_CLASSES, GET_STUDENT_CLASSES } from "../actions/types";
import {
  GET_STUDENT_CLASSES,
  GET_CLASSES,
  GET_CLASSES1,
  DELETE_CLASS,
  GET_STUDENTS,
  DELETE_STUDENT,
  DELETE_STUDENT_TEACHER,
  GET_GRADE,
  GET_CLASSSTUDENT,
  GET_PARENT,
  GET_STUDENTTEACHER,
  GET_CONNECTED_STUDENT,
  GET_STUDENTTEACHER_TEACHER,
  GET_CONNECTED_TEACHER,
  GGET_CLASSES_BY_STUDENT,
  GET_TEACHER,
  GET_CLASS_STUDENT_BY_STUDENTID,
  GET_EXAM_BY_CLASSID,
  GET_STUDENT_BY_PARENTID,
  PARENT_GET_TEACHER
} from ".././actions/types";

const initialState = {
  _classList: [],
  _class: {},
  classes: [],
  students: [],
  grade: [],
  classStudent: [],
  parent: {},
  studentTeacher: [],
  connectedStudent: [],
  teacher: {},
  exams: [],
  studentByParentId: [],
  parentGetTeacher: []
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_CLASSES:
      return {
        ...state,
        _classList: action.payload
      };
    case GET_STUDENT_CLASSES:
      return {
        ...state,
        _classList: action.payload
      };
    case GET_CLASSES1:
      return {
        ...state,
        classes: action.payload
      };
    case GET_STUDENT_BY_PARENTID:
      return {
        ...state,
        studentByParentId: action.payload
      };
    case GET_EXAM_BY_CLASSID:
      return {
        ...state,
        exams: action.payload
      };
    case GGET_CLASSES_BY_STUDENT:
      return {
        ...state,
        classes: action.payload
      };
    case PARENT_GET_TEACHER:
      return {
        ...state,
        parentGetTeacher: action.payload
      };
    case DELETE_CLASS:
      return {
        ...state,
        classes: state.classes.filter(class1 => class1.id !== action.payload)
      };
    case GET_STUDENTS:
      return {
        ...state,
        students: action.payload
      };
    case DELETE_STUDENT:
      return {
        ...state,
        students: state.students.filter(
          student => student.userId != action.payload
        )
      };
    case GET_GRADE:
      return {
        ...state,
        grade: action.payload
      };
    case GET_CLASSSTUDENT:
      return {
        ...state,
        classStudent: action.payload
      };
    case GET_CLASS_STUDENT_BY_STUDENTID:
      return {
        ...state,
        classStudent: action.payload
      };
    case GET_PARENT:
      return {
        ...state,
        parent: action.payload
      };
    case GET_STUDENTTEACHER:
      return {
        ...state,
        studentTeacher: action.payload
      };
    case GET_STUDENTTEACHER_TEACHER:
      return {
        ...state,
        studentTeacher: action.payload
      };
    case GET_CONNECTED_STUDENT:
      return {
        ...state,
        connectedStudent: action.payload
      };
    case GET_CONNECTED_TEACHER:
      return {
        ...state,
        connectedStudent: action.payload
      };
    case DELETE_STUDENT_TEACHER:
      return {
        ...state,
        studentTeacher: state.studentTeacher.filter(
          item1 => item1.studentId != action.payload
        )
      };
    case GET_TEACHER:
      return {
        ...state,
        teacher: action.payload
      };
    default:
      return state;
  }
}
