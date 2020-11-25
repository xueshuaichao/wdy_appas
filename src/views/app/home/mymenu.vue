<template>
    <a-layout-sider width="200" style="background: #fff">
        <div class="con">
            <div class="table-list">
                <div
                    v-for="item in list" :key="item.id" class="table-item"
                    :class="{isActive: item.id == activeModuleId}" @click="onModuleSelect(item.id)"
                >
                    <div class="menu-item">
                        <a-icon type="file" /><span class="table-name">{{ item.title }}</span>
                    </div>
                </div>
            </div>
        </div>
    </a-layout-sider>
</template>

<script>
    import {getModuleList} from '@/api/module';

    export default {
        name: "Mymenu",
        props: ['activeModuleId'],
        data: ()=>{
            return {
                list: [],
                labelCol: {span: 5},
                wrapperCol: {span: 14,offset: 2},
            }
        },
        async mounted() {
            try {
                let {result} = await getModuleList();
                this.list = result;
            } catch (e) {
                this.$message.error('获取表格列表失败');
            }

            if(this.list.length){
                this.onModuleSelect(this.list[0].id);
            }
        },
        methods: {
            onModuleSelect: function(moduleId){
                this.$emit('switchModule',moduleId);
            },
        }
    }
</script>

<style lang="less" scoped>
    @import '../../../less/variables';

    .con{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;

        .table-list{
            flex-grow: 1;
            overflow: auto;

            .table-item{
                display: flex;
                height: 46px;
                cursor: pointer;
                margin: 4px 0 8px;
                padding: 0 19px 0 21px;
                align-items: center;
                font-size: 14px;
                justify-content: space-between;
                &.isActive{
                    background-color: @mainColorD0D4FF;
                    color: @mainColor6370FF;
                }

                &:hover{
                    color: @mainColor5B68FF;

                }
                .menu-item {
                    display: flex;
                    width: 100%;
                    .table-name{
                        margin-left: 10px;
                        text-overflow: ellipsis;
                        display: block;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                }
                
            }
        }

        .add-app{
            margin: 10px 5px;
        }
    }
</style>
