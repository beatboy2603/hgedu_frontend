import {GET_SELECTED_EXAM_CLASSES, GET_ERRORS} from "./types";
import axios from 'axios';
import {serverUrl} from '../components/common/common';

export const getSelectedExamClasses = (examId) => async dispatch => {
    const res = await axios.get(serverUrl + "api/examClass/classes/" + examId + "/all");
    dispatch({
        type: GET_SELECTED_EXAM_CLASSES,
        payload: res.data
    })
}

export const deleteExamClasses = (examId, history) => { 
    return async dispatch => {
        try {
            const result = await axios.delete(serverUrl + "api/examClass/" + examId);
            history.push("/testManagement")
        } catch (error) {
            dispatch({
                type: GET_ERRORS,
                payload: error.response ? error.response.data : []
            })
        }
    }
}