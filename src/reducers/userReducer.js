let initialState = {}

const userReducer = (state = initialState, action) => {
    if (action.type == "changeRole") {
        console.log("dispatched");
        return{
            ...state,
            role: action.payload,
        }
    }
    return state;
}

export default userReducer;