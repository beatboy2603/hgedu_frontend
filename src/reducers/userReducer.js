let initialState = {}

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case "CHANGE_ROLE":
            return {
                ...state,
                role: action.payload,
            }
        case "UPDATE_USER":
            return {
                ...state,
                ...action.payload,
            }
        case "UPDATE_JWT":
            return {
                ...state,
                jwt: action.payload,
            }
        default: return state;
    }
}

export default userReducer;