let initialState = {}
const abbreviationReducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_ABBREVIATIONS":
            return {
                ...state,
                abbreviations: action.payload,
            }
        default: return state;
    }
}

export default abbreviationReducer;