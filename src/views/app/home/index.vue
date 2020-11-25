<template>
    <a-layout style="height: 100%">
        <myheader />
        <a-layout class="main-con">
            <mymenu :active-module-id="moduleId" @switchModule="switchModule" />
            <mycontent :module-id="moduleId" />
        </a-layout>
    </a-layout>
</template>

<script>
    import Myheader from './myheader';
    import Mymenu from './mymenu';
    import Mycontent from './mycontent';

    export default {
        name: "Index",
        components: {
            Myheader,
            Mymenu,
            Mycontent
        },
        data: ()=>{
            return {
                moduleId: ''
            }
        },
        methods: {
            switchModule: function(moduleId){
                this.moduleId = moduleId
            }
        }
    }
</script>

<style lang="less" scoped>
    .main-con {
        flex: 1 1;
    }
</style>
