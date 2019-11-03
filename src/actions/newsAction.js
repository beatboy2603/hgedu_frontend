import axios from 'axios';
 
const _addNews = (news) => ({
    type: 'ADD_NEWS',
    news
});
 
export const addNews = (newsData = {
    title: '',
    shortDescription: '',
    modId: '',
    dateCreated: '',
    thumbnail: '',
    content: []
}) => {
    return (dispatch) => {
        const news = {
            title: newsData.title,
            shortDescription: newsData.shortDescription,
            modId: newsData.modId,
            dateCreated: newsData.dateCreated,
            content: newsData.content,
            thumbnail: newsData.thumbnail
        };
 
        return axios.post('create-news', news).then(result => {
            dispatch(_addNews(result.data));
        });
    };
};