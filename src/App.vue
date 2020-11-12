<template>
  <a-config-provider :locale="locale">
    <a-form :label-col="{ span: 4 }" :wrapper-col="{ span: 12 }">
      <a-form-item label="时间表">
        <a-table bordered :data-source="dataSource" :columns="columns" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }">
          <template #time="{ record }">
            <a-date-picker show-time v-model:value="record.time" placeholder="Select Time" />
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
        <a-button class="editable-add-btn" @click="handleAdd">
          新增时间
        </a-button>
      </a-form-item>
      <a-form-item label="内容">
        <a-textarea v-model:value="message" auto-size></a-textarea>
      </a-form-item>
      <a-form-item label="webhook">
        <a-input v-model:value="webhook"></a-input>
      </a-form-item>
      <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
        <a-button @click="handleCommit">
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
      webhook: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=02f515cc-120d-4abe-b481-0524b4e2488f',
      moment,
      locale: zhCN,
      selectedRowKeys: [],
      dataSource: [
        {
          key: '0',
          time: moment()
        },
        {
          key: '1',
          time: moment()
        },
      ],
      count: 2,
      columns: [
        {
          title: 'time',
          dataIndex: 'time',
          slots: { customRender: 'time' },
        },
        {
          title: 'operation',
          dataIndex: 'operation',
          slots: { customRender: 'operation' },
        },
      ],
      message: `实时新增用户反馈<font color="warning">132例</font>，请相关同事注意。
> 类型:<font color="comment">用户反馈</font>
> 普通用户反馈:<font color="comment">117例</font>
> VIP用户反馈:<font color="comment">15例</font>`
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
