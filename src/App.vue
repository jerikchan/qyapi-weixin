<template>
  <a-config-provider :locale="locale">
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
            <a-button style="margin-right: 10px;" @click="handleTest(record)">
              测试
            </a-button>
            <a-popconfirm
              v-if="dataSource.length"
              title="Sure to delete?"
              @confirm="onDelete(record.key)"
            >
              <a>Delete</a>
            </a-popconfirm>
          </template>
        </a-table>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 4, offset: 2 }">
        <a-button class="editable-add-btn" @click="handleAdd">
          新增任务
        </a-button>
        <a-button :disabled="!changed" :loading="loading" style="margin-left: 10px;" type="primary" @click="handleCommit">
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import moment from 'moment';
import { nanoid } from 'nanoid';
import axios from 'axios';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons-vue'

export default {
  components: {
    CheckOutlined,
    CloseOutlined,
  },
  created() {
    axios({
      url: '/api/qyapi/api/task/list'
    }).then(response => {
      this.dataSource = response.data.list;
      this.$watch('dataSource', () => {
        this.changed = true;
      }, {
        deep: true
      });
    });
  },
  data() {
    return {
      changed: false,
      loading: false,
      moment,
      locale: zhCN,
      dataSource: [],
      count: 2,
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
  methods: {
    handleTest(record) {
      axios({
        method: 'post',
        url: '/api/qyapi/api/task/send',
        data: record,
      }).then(response => {
        if (response.status === 200) {
          this.$message.success('保存成功');
        }
      }).catch(err => {
        this.$message.error(err.response.data.message || err.message);
      });
    },
    onDelete(id) {
      const dataSource = [...this.dataSource];
      this.dataSource = dataSource.filter(item => item.id !== id);
    },
    handleAdd() {
      const { count, dataSource } = this;
      const newData = {
        id: nanoid(),
        time: moment(),
        message: `默认任务`,
        useRepeat: false,
        repeat: 0,
        webhook: '',
        online: false
      };
      this.dataSource = [...dataSource, newData];
      this.count = count + 1;
    },
    handleCommit() {
      console.table(JSON.parse(JSON.stringify(this.dataSource)));

      this.loading = true;
      axios({
        method: 'post',
        url: '/api/qyapi/api/task/save',
        data: this.dataSource,
      }).then(response => {
        if (response.status === 200) {
          this.$message.success('保存成功');
          this.dataSource = response.data;
        }
      }).catch(err => {
        this.$message.error(err.response.data.message || err.message);
      }).finally(() => {
        this.loading = false;
        this.changed = false;
      });
    }
  },
};
</script>
<style lang="less">
.editable-cell {
  position: relative;
  .editable-cell-input-wrapper,
  .editable-cell-text-wrapper {
    padding-right: 24px;
  }

  .editable-cell-text-wrapper {
    padding: 5px 24px 5px 5px;
  }

  .editable-cell-icon,
  .editable-cell-icon-check {
    position: absolute;
    right: 0;
    width: 20px;
    cursor: pointer;
  }

  .editable-cell-icon {
    line-height: 18px;
    display: none;
  }

  .editable-cell-icon-check {
    line-height: 28px;
  }

  .editable-cell-icon:hover,
  .editable-cell-icon-check:hover {
    color: #108ee9;
  }

  .editable-add-btn {
    margin-bottom: 8px;
  }
}
.editable-cell:hover .editable-cell-icon {
  display: inline-block;
}
</style>
