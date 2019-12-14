let initialState = {}
const questionReducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_QUESTIONS":
            return {
                ...state,
                questions: action.payload,
            }
        default: return state;
    }
}

export default questionReducer;