import { createApp } from 'vue';
import App from './App';

// import Antd from 'ant-design-vue';
// import 'ant-design-vue/dist/antd.css';
import { Table, Form, DatePicker, Switch, Select, Input, Button, Popconfirm, ConfigProvider } from 'ant-design-vue';

import moment from 'moment';
import 'moment/dist/locale/zh-cn';

moment.locale('zh-cn');

const app = createApp(App);
app.config.productionTip = false;

// app.use(Antd);
[Table, Form, DatePicker, Switch, Select, Input, Button, Popconfirm, ConfigProvider].map(app.use);

app.config.errorHandler = (err) => {
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }
};

app.mount('#app');
