<template>
    <div id="app">
        <a-config-provider :locale="locale">
            <router-view />
        </a-config-provider>
    </div>
</template>

<script>
  import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN';
  export default {
    data() {
      return {
        locale: zhCN,
      };
    },
  };
</script>

<style lang="less">
  @import 'less/cssReset.css';
  @import 'less/public.less';

  html{
    height: 100%;
  }

  body{
      min-width: 1200px;
  }

  #app{
    height: 100%;
  }
</style>
