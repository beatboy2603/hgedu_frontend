import axios from 'axios';

export const axiosPost = (config) => {
    return axios.post('http://localhost:8084/hgedu_server/api', config);
}

export const serverUrl = 'http://localhost:8084/';