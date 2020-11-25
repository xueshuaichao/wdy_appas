<template>
    <a-layout-header class="header">
        <a-row type="flex" justify="space-between">
            <a-col :span="4" class="appName">
                <div><span>{{ appName }}</span></div>
            </a-col>
        </a-row>
    </a-layout-header>
</template>

<script>
    export default {
        name: "Myheader",
        data: ()=>{
            return {
                appName: '我的应用'
            }
        }
    }
</script>

<style lang="less" scoped>
    @import '~@/less/variables.less';

    .header{
        background: url('../../../assets/menu/header-bg.png') 100% 100%;
        height: 64px;
        line-height: 64px;
        color: @mainFontColor100;
        box-shadow:0px 2px 4px 0px rgba(43,64,97,0.08);
        z-index: 999;
        font-size: 24px;;
    }

    .appName{
        >div {
            display: flex;
        }
    }



</style>
