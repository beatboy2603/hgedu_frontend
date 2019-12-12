let initialState = {

}
const folderReducer = (state = initialState, action) => {
    switch (action.type) {
        case "UPDATE_FOLDERS":
            return {
                ...state,
                folders: action.payload,
            }
        default: return state;
    }
}

export default folderReducer;