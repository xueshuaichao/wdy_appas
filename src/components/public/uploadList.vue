<template>
    <div class="file-list">
        <a
            v-if="fileObj.status == 'done'" class="title" :href="fileObj.url"
            :title="fileObj.name"
            target="_blank"
        >{{ fileObj.name }}</a>
        <span v-else class="title">{{ fileObj.name }}</span>
        <a-progress
            stroke-color="#6370FF" :percent="fileObj.percent" :status="translateStatus(fileObj.status)"
            class="percent"
        />
        <a href="javascript:void(0)" @click="handleRemove">删除</a>
    </div>
</template>

<script>
    import FileObj from "@/lib/fileObj";

    export default {
        name: "uploadList",
        props: {
            fileObj: FileObj
        },
        methods: {
            translateStatus: function(status){
                let _status;
                switch (status) {
                    case 'uploading':
                        _status = 'active';break;
                    case 'done':
                        _status = 'success';break;
                    case 'error':
                        _status = 'exception';break;
                }
            },
            handleRemove: function(){
                this.$emit('remove',this.fileObj);
            }
        }
    }
</script>

<style lang="less" scoped>
    .file-list{
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title{
            flex-basis: 130px;
            flex-grow: 0;
            flex-shrink: 0;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }

        .percent{
            margin: 0 16px;
            flex-grow: 1;
            width: auto;
        }

    }
</style>
