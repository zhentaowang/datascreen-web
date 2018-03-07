import { hashHistory } from 'react-router';

import { message } from 'antd';
import 'whatwg-fetch';

function parseJSON(response) {
    return response.json();
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;
    throw error;
}

function checkLogin(data) {
    if(data.code == 102){
        message.error(data.display_message);
        hashHistory.push('login');
    }
    return data;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
    return fetch(url, options)
        .then(checkStatus)
        .then(parseJSON)
        .then(checkLogin)
        .catch((err) => console.error(err));
}
