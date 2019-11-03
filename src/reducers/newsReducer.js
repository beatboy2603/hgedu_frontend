const newsInitialState = [];
 
export default (state = newsInitialState, action) => {
    switch (action.type) {
        case 'ADD_NEWS':
            return [
                ...state,
                action.news
            ];
        case 'REMOVE_NEWS':
            return state.filter(({ id }) => id !== action.id);
        case 'EDIT_NEWS':
            return state.map((news) => {
                if (news.id === action.id) {
                    return {
                        ...news,
                        ...action.updates
                    };
                } else {
                    return news;
                }
            });
        case 'GET_NEWS_LIST':
            return action.news_list;
        default:
            return state;
    }
};