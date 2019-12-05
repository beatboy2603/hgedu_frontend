import { GET_TESTS_AND_FOLDERS, GET_TESTS_ROOT, GET_SELECTED_EXAM_TESTS, UPDATE_SELECTED_EXAM_TESTS } from '../actions/types'

const initialState = {
    testRoot: {},
    folderTest: {},
    selectedTestList: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_TESTS_ROOT:
            return {
                ...state,
                testRoot: action.payload
            }
        case GET_TESTS_AND_FOLDERS:
            return {
                ...state,
                folderTest: action.payload
            }
        case GET_SELECTED_EXAM_TESTS:
            return {
                ...state,
                selectedTestList: action.payload
            }
        case UPDATE_SELECTED_EXAM_TESTS:
            return {
                ...state,
                selectedTestList: action.payload
            }
        default:
            return state;
    }
}