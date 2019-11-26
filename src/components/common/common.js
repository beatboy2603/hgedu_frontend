import axios from 'axios';

export const axiosPost = (config) => {
    return axios.post('http://localhost:8084/hgedu_server/api', config);
}

export const serverUrl = 'http://localhost:8084/';

export const setCookie = (key, value, expHours) => {
    var d = new Date();
    d.setTime(d.getTime() + (expHours * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = key + "=" + value + ";" + expires + ";path=/";
}

export const getCookie = (key) => {
    var name = key + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}