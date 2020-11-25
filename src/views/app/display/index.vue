<template>
    <a-layout style="height: 100%">
        <myheader />
        <a-layout class="main-con">
            <a-layout style="padding: 24px 24px 0">
                <a-layout-content class="con">
                    <Step />
                    <BannerContent />
                </a-layout-content>
            </a-layout>
        </a-layout>
    </a-layout>
</template>

<script>
    import Myheader from '../home/myheader';
    import Step from './step';
    import BannerContent from './banner-content';

    export default {
        name: "Index",
        components: {
            Myheader,
            Step,
            BannerContent,
        },
        data: ()=>{
            return {
            }
        },
        methods: {
        }
    }
</script>

<style lang="less" scoped>
@import '../../../less/variables';
    .main-con {
        width: 1200px;
        flex: 1 1;
        margin: auto;
        .con{
            background: @mainWhiteBackgroundColor;
            padding: 24px;
            margin: 0;
            min-height: 280px;
            flex-shrink: 0;
        }
    }
</style>
