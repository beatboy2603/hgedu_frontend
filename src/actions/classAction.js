// import { GET_CLASSES, GET_ERRORS, GET_STUDENT_CLASSES } from "./types";
import axios from 'axios';
import { serverUrl } from '../components/common/common'
import {
  GET_STUDENT_CLASSES,
  GET_CLASSES,
  GET_CLASSES1, 
  GET_ERRORS,
  DELETE_CLASS,
  GET_STUDENTS,
  DELETE_STUDENT,
  GET_GRADE,
  GET_CLASSSTUDENT,
  GET_PARENT,
  GET_STUDENTTEACHER,
  GET_CONNECTED_STUDENT,
  DELETE_STUDENT_TEACHER,
  GET_STUDENTTEACHER_TEACHER,
  GET_CONNECTED_TEACHER,
  GGET_CLASSES_BY_STUDENT,
  GET_TEACHER,
  GET_CLASS_STUDENT_BY_STUDENTID,
  GET_EXAM_BY_CLASSID,
  GET_STUDENT_BY_PARENTID,
  PARENT_GET_TEACHER
} from "./types";

export const getClasses = (userId) => async dispatch => {
  const res = await axios.get(serverUrl + "api/class/" + userId);
  dispatch({
    type: GET_CLASSES,
    payload: res.data
  })
}

export const getStudentClasses = (userId) => async dispatch => {
  const res = await axios.get(serverUrl + "api/class/student/" + userId);
  dispatch({
    type: GET_STUDENT_CLASSES,
    payload: res.data
  })
}

export const getClasses1 = id => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/${id}`);
  dispatch({
    type: GET_CLASSES1,
    payload: res.data
  });
};

export const getTeacher = userId => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/teacher/${userId}`);
  dispatch({
    type: GET_TEACHER,
    payload: res.data
  })
}

export const getClassesByStudentId = studentId => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/studentClass/${studentId}`);
  dispatch({
    type: GGET_CLASSES_BY_STUDENT,
    payload: res.data
  });
};

export const getStudentsByParentId = parentId => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/parentStudent/${parentId}`);
  dispatch({
    type: GET_STUDENT_BY_PARENTID,
    payload: res.data
  });
};

export const getConnnectedStudent = teacherId => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/studentTeacher/connected/${teacherId}`);
  dispatch({
    type: GET_CONNECTED_STUDENT,
    payload: res.data
  })
}

export const getConnnectedTeacher = studentId => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/studentTeacher/connected/teacher/${studentId}`);
  dispatch({
    type: GET_CONNECTED_TEACHER,
    payload: res.data
  })
}

export const getStudentTeacher = teacherId => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/studentTeacher/${teacherId}`);
  dispatch({
    type: GET_STUDENTTEACHER,
    payload: res.data
  })
}

export const getStudentTeacher1 = studentId => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/studentTeacher/teacher/${studentId}`);
  dispatch({
    type: GET_STUDENTTEACHER_TEACHER,
    payload: res.data
  })
}

export const getParent = studentId => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/parent/${studentId}`);
  dispatch({
    type: GET_PARENT,
    payload: res.data
  })
}

export const getClassStudents = classId => async dispatch => {
  const res = await axios.get(
    serverUrl + `api/classManagement/classStudent/${classId}`
  );
  dispatch({
    type: GET_CLASSSTUDENT,
    payload: res.data
  });
};

export const getExamByClassId = () => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/exam`);
  dispatch({
    type: GET_EXAM_BY_CLASSID,
    payload: res.data
  })
}

export const parentGetTeacherByStudentId = studentId => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/parentFindTeacher/${studentId}`);
  dispatch({
    type: PARENT_GET_TEACHER,
    payload: res.data
  })
}



export const getClassStudentsByStudentId = studentId => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/classStudent/classes/${studentId}`);
  dispatch({
    type: GET_CLASS_STUDENT_BY_STUDENTID,
    payload: res.data
  })
}

export const getStudents = id => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/students/${id}`);
  dispatch({
    type: GET_STUDENTS,
    payload: res.data
  });
};

export const getGrade = id => async dispatch => {
  const res = await axios.get(serverUrl + `api/classManagement/student/${id}`);
  dispatch({
    type: GET_GRADE,
    payload: res.data
  });
};

export const createClass = class1 => async dispatch => {
  try {
    const res = await axios.post(serverUrl + "api/classManagement/", class1);
    dispatch({
      type: GET_ERRORS,
      payload: {}
    });
    // console.log(res.data)
  } catch (error) {
    dispatch({
      type: GET_ERRORS,
      payload: error.response.data
    });
  }
};

export const deleteClass = id => async dispatch => {
  if (window.confirm("Are you sure?")) {
    await axios.delete(serverUrl + `api/classManagement/${id}`);
    dispatch({
      type: DELETE_CLASS,
      payload: id
    });
  }
};

export const deleteStudent = id => async dispatch => {
  if (window.confirm("Are you sure?")) {
    await axios.delete(serverUrl + `api/classManagement/student/${id}`);
    dispatch({
      type: DELETE_STUDENT,
      payload: id
    });
  }
};

export const deleteStudentTeacher = studentId => async dispatch => {
  if (window.confirm("Are you sure?")) {
    await axios.delete(serverUrl + `api/classManagement/studentTeacher/${studentId}`);
    dispatch({
      type: DELETE_STUDENT_TEACHER,
      payload: studentId
    })
  }
}

