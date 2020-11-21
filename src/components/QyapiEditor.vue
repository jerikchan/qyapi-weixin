<template>
  <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
    <a-form-item label="时间表">
      <a-table rowKey="id" bordered :data-source="dataSource" :columns="columns">
        <template #online="{ record }">
          <div v-if="record.online" :style="{ color: '#52c41a' }" >
            <CheckOutlined />
            在线
          </div>
          <div v-else :style="{ color: '#f5222d' }" >
            <CloseOutlined />
            停止
          </div>
        </template>
         <template #open="{ record }">
          <a-switch v-model:checked="record.open" />
        </template>
        <template #time="{ record }">
          <a-date-picker show-time :value="moment(record.time)" @change="record.time = $event" placeholder="Select Time" />
        </template>
        <template #repeat="{ record }">
          <a-switch v-model:checked="record.useRepeat"></a-switch>
          <a-select v-model:value="record.repeat" v-show="record.useRepeat">
            <a-select-option :value="1">每1周</a-select-option>
            <a-select-option :value="2">每2周</a-select-option>
            <a-select-option :value="3">每3周</a-select-option>
            <a-select-option :value="4">每4周</a-select-option>
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
import { nanoid } from 'nanoid';
import moment from 'moment';
import axios from 'axios';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'
import { ref, reactive, watch, onMounted, toRaw, nextTick } from 'vue';
import { message } from 'ant-design-vue';

function syncAry(prev, next) {
  Array.prototype.splice.call(prev, 0, prev.length, ...next);
  return prev;
}

export default {
  components: {
    CheckOutlined,
    CloseOutlined,
  },
  setup() {
    const dataSource = reactive([]);
    const modified = ref(false);
    const loading = ref(true);

    const handleTest = async (record) => {
      const response = await axios({
        method: 'post',
        url: '/api/schedule/send',
        data: record,
      })
      if (response.status === 200) {
        message.success('保存成功');
      }
    };
    const handleDelete = (id) => {
      const index = dataSource.find(item => item.id === id);
      dataSource.splice(index, 1);
    };
    const handleAdd = () => {
      const newData = {
        id: nanoid(),
        time: moment(),
        message: `默认任务`,
        useRepeat: false,
        repeat: 1,
        webhook: '',
        online: false,
        open: false,
      };
      dataSource.push(newData);
    };
    const handleCommit = async () => {
      const data = toRaw(dataSource);
      console.table(data);

      loading.value = true;
      const response = await axios({
        method: 'post',
        url: '/api/plan/save',
        data,
      });
      
      if (response.status === 200) {
        message.success('保存成功');
        syncAry(dataSource, response.data);
        nextTick(() => {
          nextTick(() => {
            modified.value = false;
          });
        });
      }

      loading.value = false;
    }

    onMounted(async () => {
      const response = await axios({
        url: '/api/plan/list'
      });
      
      syncAry(dataSource, response.data);

      watch(dataSource, () => {
        modified.value = true;
      });

      loading.value = false;
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
          dataIndex: 'online',
          slots: { customRender: 'online' },
        },
        {
          title: '开启',
          dataIndex: 'open',
          slots: { customRender: 'open' },
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
