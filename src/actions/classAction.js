import { GET_CLASSES, GET_STUDENT_CLASSES, GET_ERRORS} from "./types";
import axios from 'axios';
import {serverUrl} from '../components/common/common';

export const getClasses = (userId) => async dispatch => {
    const res = await axios.get(serverUrl + "api/class/" + userId);
    dispatch ({
        type: GET_CLASSES,
        payload: res.data
    })
}

export const getStudentClasses = (userId) => async dispatch => {
    const res = await axios.get(serverUrl + "api/class/student/" + userId);
    dispatch ({
        type: GET_STUDENT_CLASSES,
        payload: res.data
    })
}