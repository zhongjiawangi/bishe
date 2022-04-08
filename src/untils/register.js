import axios from 'axios'

const register = axios.create({
  // baseURL: 'http://112.74.49.147:3007'
  baseURL: 'http://127.0.0.1:3007'
})

register.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

export default register