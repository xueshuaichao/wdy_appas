<template>
    <a-layout style="height: 100%">
        <myheader />
        <a-layout class="main-con">
            <myDetail />
        </a-layout>
    </a-layout>
</template>

<script>
    import Myheader from '../home/myheader';
    import MyDetail from './myDetail';

    export default {
        name: "Index",
        components: {
            Myheader,
            MyDetail
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
    .main-con {
        flex: 1 1;
    }
</style>
