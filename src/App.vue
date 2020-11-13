<template>
  <a-config-provider :locale="locale">
    <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
      <a-form-item label="时间表">
        <a-table bordered :data-source="dataSource" :columns="columns" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
          <template #time="{ record }">
            <a-date-picker show-time v-model:value="record.time" placeholder="Select Time" />
          </template>
          <template #repeat="{ record }">
            <a-switch v-model:checked="record.repeat"></a-switch>
            <a-select v-model:value="record.repeatRange" v-show="record.repeat">
              <a-select-option :value="0">每1周</a-select-option>
              <a-select-option :value="1">每2周</a-select-option>
              <a-select-option :value="2">每3周</a-select-option>
              <a-select-option :value="3">每4周</a-select-option>
            </a-select>
          </template>
          <template #message="{ record }">
            <a-textarea v-model:value="record.message" :autosize="{ minRows: 4, maxRows: 4 }" allowClear></a-textarea>
          </template>
          <template #webhook="{ record }">
            <a-input v-model:value="record.webhook"></a-input>
          </template>
          <template #operation="{ record }">
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
          新增时间
        </a-button>
        <a-button style="margin-left: 10px;" @click="handleCommit">
          立即测试
        </a-button>
        <a-button style="margin-left: 10px;" type="primary" @click="handleCommit">
          保存
        </a-button>
      </a-form-item>
    </a-form>
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import moment from 'moment';
import 'moment/dist/locale/zh-cn';
moment.locale('zh-cn');

export default {
  data() {
    return {
      moment,
      locale: zhCN,
      selectedRowKeys: [],
      dataSource: [
        {
          key: '0',
          time: moment(),
          message: `实时新增用户反馈<font color="warning">132例</font>，请相关同事注意。
> 类型:<font color="comment">用户反馈</font>
> 普通用户反馈:<font color="comment">117例</font>
> VIP用户反馈:<font color="comment">15例</font>`,
          repeat: false,
          repeatRange: 0,
          webhook: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=02f515cc-120d-4abe-b481-0524b4e2488f'
        },
      ],
      count: 2,
      columns: [
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
    onSelectChange(selectedRowKeys) {
      console.log('selectedRowKeys changed: ', selectedRowKeys);
      this.selectedRowKeys = selectedRowKeys;
    },
    onDelete(key) {
      const dataSource = [...this.dataSource];
      this.dataSource = dataSource.filter(item => item.key !== key);
    },
    handleAdd() {
      const { count, dataSource } = this;
      const newData = {
        key: count,
        time: moment()
      };
      this.dataSource = [...dataSource, newData];
      this.count = count + 1;
    },
    handleCommit() {
      console.table(JSON.parse(JSON.stringify(this.dataSource)));
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
