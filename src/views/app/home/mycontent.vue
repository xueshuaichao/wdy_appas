<template>
    <a-layout style="padding: 24px 24px 0">
        <a-layout-content class="con">
            <a-row type="flex" justify="space-between" class="table-header">
                <a-col :span="15">
                    <span class="title" :title="moduleName">{{ moduleName }}</span>
                </a-col>
                <a-col :span="4">
                    <a-row type="flex" justify="end">
                        <a-button icon="plus" @click="addData">记录</a-button>
                    </a-row>
                </a-col>
            </a-row>
            <module-data-list
                ref="moduleDataList"
                :module-id="moduleId"
                :module-field-list="moduleFieldList"
                :get-data="getModuleData"
                :edit-fn="editData"
            />
        </a-layout-content>
        <moduleDataModal
            :visible="moduleDataModalVisible" :initial-module-field-list="formModuleFieldList" :module-id="moduleId"
            :initial-form="initialForm"
            :is-update="isUpdate"
            @close="closeModal"
        />
    </a-layout>
</template>

<script>
    import _ from 'lodash';
    import { getModuleConfig } from '@/api/module';
    import { getDataList } from '@/api/business';
    import moduleDataModal from "@/components/public/moduleDataModal";
    import {fieldDataServer2FE} from '@/lib/field';
    import moduleDataList from "@/components/public/moduleDataList";

    export default {
        name: "Mycontent",
        components: {
            moduleDataList,
            moduleDataModal
        },
        props: ['moduleId'],
        data: ()=>{
            return {
                moduleDataModalVisible: false,
                moduleName: '',
                moduleFieldList: [],
                initialForm: {},
                isUpdate: false,
            }
        },
        computed: {
            formModuleFieldList: function(){
                return this.moduleFieldList.filter((item)=>{
                    return item.fieldSource == 1
                })
            }
        },
        watch: {
            moduleId: async function(){
                this.loading = true;
                try{
                    await this.getModuleFieldList();
                }catch (e) {
                    this.$message.error('获取模块字段数据失败')
                }finally {
                    this.loading = false;
                }
            }
        },
        methods: {
            addData: function(){
                this.initialForm = {};
                this.isUpdate = false;
                this.moduleDataModalVisible = true;
            },
            closeModal: function(isRefreshData){
                this.moduleDataModalVisible = false;
                if(isRefreshData){
                    this.$refs.moduleDataList.getModuleData();
                }
            },
            getModuleFieldList: async function(){
                let {title,fieldList} = await getModuleConfig(this.moduleId);
                let moduleFieldList = [];

                for(let item of fieldList){
                    moduleFieldList.push(fieldDataServer2FE(item));
                }

                this.moduleName = title;
                this.moduleFieldList = moduleFieldList;
            },
            getModuleData: async function(page,pageSize){
                let res = await getDataList(this.moduleId,{
                    page,
                    pageSize
                });
                return res;
            },
            editData: function(data){
                this.moduleDataModalVisible = true;
                this.initialForm = _.cloneDeep(data);
                this.isUpdate = true;
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../../../less/variables';
    .con{
        background: @mainWhiteBackgroundColor;
        padding: 24px;
        margin: 0;
        min-height: 280px;
        flex-shrink: 0;
        .title {
            text-overflow:ellipsis;
            overflow: hidden;
            white-space: nowrap;
            width: 100%;
            display: block;
        }
        .table-header{
            padding: 0 10px;
            margin-bottom: 10px;
        }
    }
</style>
