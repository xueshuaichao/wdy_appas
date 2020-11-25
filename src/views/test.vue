<template>
    <div>
        <a-table
            class="custom-table"
            :columns="columns"
            :row-key="recorder => recorder.id"
            :data-source="moduleData"
            :loading="loading"
            :scroll="{x:500}"
        />
    </div>
</template>

<script>


    export default {
        name: "Test",
        data: ()=>{
            return {
                loading: true,
                moduleData: [],
                columns: []
            }
        },
        methods: {

        }
    }
</script>

<style scoped>
    /* you can make up upload button and sample style by using stylesheets */
    .ant-upload-select-picture-card i {
        font-size: 32px;
        color: #999;
    }

    .ant-upload-select-picture-card .ant-upload-text {
        margin-top: 8px;
        color: #666;
    }
</style>
