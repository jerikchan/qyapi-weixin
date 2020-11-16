import { createApp } from 'vue';
import Antd from 'ant-design-vue';
import App from './App';
import 'ant-design-vue/dist/antd.css';
import moment from 'moment';
import 'moment/dist/locale/zh-cn';

moment.locale('zh-cn');

const app = createApp(App);
app.config.productionTip = false;

app.use(Antd);

app.mount('#app')
