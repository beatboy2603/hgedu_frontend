import axios from 'axios';
import {GET_TESTS_AND_FOLDERS, GET_TESTS_ROOT, GET_SELECTED_EXAM_TESTS, UPDATE_SELECTED_EXAM_TESTS, GET_ERRORS} from './types';
import {serverUrl} from '../components/common/common';

export const getTestsAndFolders = (folderId, teacherId) => async dispatch => {
    const res = await axios.get(serverUrl + "api/examTest/" + folderId + "/" + teacherId + "/all");
    dispatch({
        type: GET_TESTS_AND_FOLDERS,
        payload: res.data
    })
}

export const getTestsRootFolder = (teacherId) => async dispatch => {
    const res = await axios.get(serverUrl + "api/folder/testRoot/" + teacherId);
    dispatch({
        type: GET_TESTS_ROOT,
        payload: res.data
    })
}

export const getSelectedExamTests = (examId) => async dispatch => {
    const res = await axios.get(serverUrl + "api/examTest/tests/" + examId + "/all");
    dispatch({
        type: GET_SELECTED_EXAM_TESTS,
        payload: res.data
    })
}

export const updateSelectedExamTests = (selectedTestList) => async dispatch => {
    dispatch({
        type: UPDATE_SELECTED_EXAM_TESTS,
        payload: selectedTestList
    })
}

export const deleteExamTests = (examId, history) => { 
    return async dispatch => {
        try {
            const result = await axios.delete(serverUrl + "api/examTest/" + examId);
            history.push("/testManagement")
        } catch (error) {
            dispatch({
                type: GET_ERRORS,
                payload: error.response ? error.response.data : []
            })
        }
    }
}