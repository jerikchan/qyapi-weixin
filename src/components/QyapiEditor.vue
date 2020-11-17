<template>
  <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
    <a-form-item label="时间表">
      <a-table rowKey="id" bordered :data-source="dataSource" :columns="columns">
        <template #status="{ record }">
          <CheckOutlined v-if="record.online" :style="{ color: '#52c41a' }" />
          <CloseOutlined v-else :style="{ color: '#f5222d' }"/>
        </template>
        <template #time="{ record }">
          <a-date-picker show-time :value="moment(record.time)" @change="record.time = $event" placeholder="Select Time" />
        </template>
        <template #repeat="{ record }">
          <a-switch v-model:checked="record.useRepeat"></a-switch>
          <a-select v-model:value="record.repeat" v-show="record.useRepeat">
            <a-select-option :value="0">每1周</a-select-option>
            <a-select-option :value="1">每2周</a-select-option>
            <a-select-option :value="2">每3周</a-select-option>
            <a-select-option :value="3">每4周</a-select-option>
          </a-select>
        </template>
        <template #message="{ record }">
          <a-textarea v-model:value="record.message" :auto-size="{ minRows: 4, maxRows: 4 }" allowClear></a-textarea>
        </template>
        <template #webhook="{ record }">
          <a-input v-model:value="record.webhook"></a-input>
        </template>
        <template #operation="{ record }">
          <a style="margin-right: 10px;" @click="handleTest(record)">
            测试
          </a>
          <a-popconfirm
            v-if="dataSource.length"
            title="Sure to delete?"
            @confirm="handleDelete(record.key)"
          >
            <a>删除</a>
          </a-popconfirm>
        </template>
      </a-table>
    </a-form-item>
    <a-form-item :wrapper-col="{ span: 4, offset: 2 }">
      <a-button class="editable-add-btn" @click="handleAdd">
        新增任务
      </a-button>
      <a-button :disabled="!modified" :loading="loading" style="margin-left: 10px;" type="primary" @click="handleCommit">
        保存
      </a-button>
    </a-form-item>
  </a-form>
</template>
<script>
import moment from 'moment';
import { nanoid } from 'nanoid';
import axios from '@/utils/axios';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { ref, reactive, watch, onMounted, toRaw } from 'vue';
import { message } from 'ant-design-vue';

export default {
  components: {
    CheckOutlined,
    CloseOutlined,
  },
  setup() {
    const dataSource = reactive([]);
    const modified = ref(false);
    const loading = ref(false);

    const handleTest = async (record) => {
      const response = await axios({
        method: 'post',
        url: '/api/qyapi/api/task/send',
        data: record,
      })
      if (response.status === 200) {
        message.success('保存成功');
      }
    };
    const handleDelete = (id) => {
      dataSource.value = dataSource.filter(item => item.id !== id);
    };
    const handleAdd = () => {
      const newData = {
        id: nanoid(),
        time: moment(),
        message: `默认任务`,
        useRepeat: false,
        repeat: 0,
        webhook: '',
        online: false
      };
      dataSource.push(newData);
    };
    const handleCommit = async () => {
      console.table(toRaw(dataSource));

      loading.value = true;
      const response = await axios({
        method: 'post',
        url: '/api/qyapi/api/task/save',
        data: dataSource,
      });
      if (response.status === 200) {
        message.success('保存成功');
        dataSource.value = response.data;
      }
      loading.value = false;
      modified.value = false;
    }

    watch(dataSource, () => {
      modified.value = true;
    });

    onMounted(async () => {
      const response = await axios({
        url: '/api/qyapi/api/task/list'
      });
      
      dataSource.value = response.data.list;
    });

    return {
      handleTest,
      handleDelete,
      handleAdd,
      handleCommit,
      dataSource,
      modified,
      loading,
      moment,
      columns: [
        {
          title: '状态',
          dataIndex: 'status',
          slots: { customRender: 'status' },
        },
        {
          title: '时间',
          dataIndex: 'time',
          slots: { customRender: 'time' },
        },
        {
          title: '内容',
          dataIndex: 'message',
          slots: { customRender: 'message' },
        },
        {
          title: '是否循环',
          dataIndex: 'repeat',
          slots: { customRender: 'repeat' },
        },
        {
          title: '机器人地址',
          dataIndex: 'webhook',
          slots: { customRender: 'webhook' },
        },
        {
          title: '操作',
          dataIndex: 'operation',
          slots: { customRender: 'operation' },
        },
      ],
    };
  },
};
</script>
