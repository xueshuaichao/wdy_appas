
import axios from 'axios';
import Host from '../const/host'

const request = axios.create({
    baseURL: `${Host.APAAS}/api/v1`,
    timeout: 10000
});

request.interceptors.response.use(function (response) {
    let res = response.data;
    if (res.code == 0){
        return res.data;
    } else {
        return Promise.reject({
            code: res.code,
            msg: res.message,
            data: res.data
        })
    }
}, function (error) {
    console.error(error);
    return Promise.reject({});
});

export default request;
