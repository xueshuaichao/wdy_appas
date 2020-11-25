<template>
    <div class="step">
        <div class="step01">
            首页
        </div>
        <div class="step02">
            详情
        </div>
    </div>
</template>

<script>

    export default {
        name: "Step",
        components: {
        },
        data: ()=>{
            return {
            }
        },
        computed: {
        },
        created(){
        },
        methods: {}
    }
</script>

<style lang="less" scoped>
@import '../../../less/variables';
    .step {
        overflow: hidden;
        .step01{
            width: 148px;
            height: 38px;
            background-image: url('../../../assets/page/step01.png');
            background-size: 100% 100%;
            line-height: 38px;
            text-align: center;
            float: left;
        }
        .step02{
            width: 148px;
            height: 38px;
            background-image: url('../../../assets/page/step02.png');
            background-size: 100% 100%;
            line-height: 38px;
            text-align: center;
            float: left;
            margin-left: -10px;
        }
    }
</style>
