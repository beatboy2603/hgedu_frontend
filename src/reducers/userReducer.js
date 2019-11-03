let initialState = {}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CHANGE_ROLE":
            return {
                ...state,
                role: action.payload,
            }
        default: return state;
    }
}

export default userReducer;