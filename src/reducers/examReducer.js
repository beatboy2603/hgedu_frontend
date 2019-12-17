import { GET_SELECTED_EXAM_CLASSES, GET_EXAMS_CURRENT, GET_EXAMS_HISTORY, GET_EXAMS_CLASS } from '../actions/types'

const initialState = {
    selectedClassList : [],
    examsCurrentMap: {},
    examsHistoryMap: {},
    classExamList: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_SELECTED_EXAM_CLASSES:
            return {
                ...state,
                selectedClassList: action.payload
            }
        case GET_EXAMS_CURRENT:
            return {
                ...state,
                examsCurrentMap: action.payload
            }
        case GET_EXAMS_HISTORY:
            return {
                ...state,
                examsHistoryMap: action.payload
            }
        case GET_EXAMS_CLASS:
            return {
                ...state,
                classExamList: action.payload
            }
        default:
            return state;
    }
}