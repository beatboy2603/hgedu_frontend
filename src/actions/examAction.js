import axios from 'axios';
import {GET_ERRORS, GET_SELECTED_EXAM_CLASSES, GET_EXAMS_CURRENT, GET_EXAMS_HISTORY} from './types'

export const createExam = (exam, selectedClassList, selectedTestList, history) => { 
    return async dispatch => {
        try {
            const examRes = await axios.post("http://localhost:8084/api/exam", exam)
            if(examRes.data) {
                let createdExam = examRes.data;
                //create exam class
                let classExamList = selectedClassList.map(function(cls){return({classId: cls.id, examId: createdExam.id})});
                const classExamRes = await axios.post("http://localhost:8084/api/examClass", classExamList);
                //create exam test
                let examTestList = selectedTestList.map(function(test){return({testId: test.id, examId: createdExam.id})});
                const examTestRes = await axios.post("http://localhost:8084/api/examTest", examTestList);
            }
            history.push("/testManagement")
        } catch (error) {
            dispatch({
                type: GET_ERRORS,
                payload: error.response ? error.response.data : []
            })
        }
    }
}

export const updateExam = (exam, selectedClassList, selectedTestList, history) => { 
    return async dispatch => {
        try {
            const examRes = await axios.put("http://localhost:8084/api/exam", exam)
            if(examRes.data) {
                let updatedExam = examRes.data;
                //create exam class
                let classExamList = selectedClassList.map(function(cls){return({classId: cls.id, examId: updatedExam.id})});
                const classExamRes = await axios.post("http://localhost:8084/api/examClass", classExamList);
                //create exam test
                let examTestList = selectedTestList.map(function(test){return({testId: test.id, examId: updatedExam.id})});
                const examTestRes = await axios.post("http://localhost:8084/api/examTest", examTestList);
            }
            history.push("/testManagement")
        } catch (error) {
            dispatch({
                type: GET_ERRORS,
                payload: error.response ? error.response.data : []
            })
        }
    }
}

export const getExamCurrent = (teacherId) => async dispatch => {
    const res = await axios.get("http://localhost:8084/api/exam/schedule/" + teacherId + "/all");
    dispatch({
        type: GET_EXAMS_CURRENT,
        payload: res.data
    })
}

export const getExamHistory = (teacherId) => async dispatch => {
    const res = await axios.get("http://localhost:8084/api/exam/history/" + teacherId + "/all");
    dispatch({
        type: GET_EXAMS_HISTORY,
        payload: res.data
    })
}

// export const getSelectedExamClasses = () => async dispatch => {
//     // const res = await axios.get("http://localhost:8084/api//")
// }

