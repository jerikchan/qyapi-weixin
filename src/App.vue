<template>
  <a-config-provider :locale="locale">
    <QyapiEditor />
  </a-config-provider>
</template>
<script>
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import QyapiEditor from '@/components/QyapiEditor'

export default {
  components: {
    QyapiEditor,
  },
  setup() {
    return {
      locale: zhCN
    };
  },
};
</script>