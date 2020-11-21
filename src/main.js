import { createApp } from 'vue';
import App from './App';
import { Table, Form, DatePicker, Switch, Select, Input, Button, Popconfirm, ConfigProvider } from 'ant-design-vue';
import axios from 'axios';
import { message } from 'ant-design-vue';

axios.defaults.baseURL = process.env.VUE_APP_BASE_URL;

axios.interceptors.response.use(response => {
  return response;
}, err => {
  message.error(err.message);
  return Promise.reject(err);
});

const app = createApp(App);
app.config.productionTip = false;
app.config.errorHandler = (err) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
};

[Table, Form, DatePicker, Switch, Select, Input, Button, Popconfirm, ConfigProvider].map((component) => {
  app.use(component);
});
app.config.globalProperties.$message = message;

app.mount('#app');

export default app;