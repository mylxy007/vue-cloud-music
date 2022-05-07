import axios from 'axios'
import {
    Message
} from 'element-ui'
import {
    getToken
} from './token'
const baseURL = 'http://localhost:8080'
const request = axios.create({
    baseURL,
    timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(config => {
    // 添加token
    config.headers.Authorization = getToken();
    return config
}, err => Promise.reject(err))

// 响应拦截器
request.interceptors.response.use(res => {
    if (res.data.code === 401) {
        Message('无权操作')
    }
    if (res.data.code === 400) {
        Message('请求网络失败')
    }
    if (res.data.code === 404) {
        Message('请求网络失败')
    }
    return res.data;
}, err => {
    if (err) {
        Message('请求网络失败')
    }
    return Promise.reject(err)
})

export default request