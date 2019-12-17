import { GET_CLASSES, GET_STUDENT_CLASSES } from '../actions/types'

const initialState = {
    _classList: [],
    _class: {}
};

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_CLASSES:
            return {
                ...state,
                _classList: action.payload
            }
        case GET_STUDENT_CLASSES:
            return {
                ...state,
                _classList: action.payload
            }
        default:
            return state;
    }
}


