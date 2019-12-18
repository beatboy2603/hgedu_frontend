import axios from 'axios';

// export const axiosPost = (config) => {
//     return axios.post('http://localhost:8084/hgedu_server/api', config);
// }

export const serverUrl = 'https://hgedu-server.herokuapp.com/';
// export const serverUrl = 'http://localhost:8084/';

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

export const getAuthenCookie = () => {
    let authenticated = getCookie("authenticated");
    if (authenticated === "true") {
        setCookie("authenticated", "true", 1);
        return true;
    }
    return false;
}

export const getCurrentDate = () => {
    let date = new Date();
    return formatDate(date);
}

export const formatDate = (date) => {
    return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toJSON().slice(0, 19).replace(/T/g, ' ');
}