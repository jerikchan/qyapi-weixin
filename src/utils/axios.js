import axios from 'axios';
import { message } from 'ant-design-vue';

const instance = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL,
  // timeout: 5000,
});

instance.interceptors.response.use(response => {
  return response;
}, err => {
  // eslint-disable-next-line
  debugger
  message.error(err.message);
  return Promise.reject(err);
});

export default instance;