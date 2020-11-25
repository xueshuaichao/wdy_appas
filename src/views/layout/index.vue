<template>
    <a-layout style="height: 100%;background: #F1F1F5">
        <myheader />
        <a-layout class="main-con">
            <mymenu />
            <keep-alive :include="cacheList">
                <router-view />
            </keep-alive>
        </a-layout>
    </a-layout>
</template>

<script>
    import Myheader from './myheader';
    import Mymenu from './mymenu';

    export default {
        name: "Index",
        components: {
            Myheader,
            Mymenu,
        },
        data: ()=>{
            return {
                cacheList: ['customModule'],
            }
        },
        async created() {
            await this.$store.dispatch('module/getMainFieldTypeList');
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
