import { GET_CLASSES, GET_ERRORS} from "./types";
import axios from 'axios'

export const getClasses = (userId) => async dispatch => {
    const res = await axios.get("http://localhost:8084/api/class/" + userId);
    dispatch ({
        type: GET_CLASSES,
        payload: res.data
    })
}