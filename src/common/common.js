import axios from 'axios';

export const axiosPost = (config) => {
    return axios.post('http://localhost:8084/hgedu_server/api', config);
}