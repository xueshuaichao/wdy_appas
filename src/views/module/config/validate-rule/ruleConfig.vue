<template>
    <div v-show="activeTab==='validate-rule'" class="filed-list">
        <a-row type="flex" justify="space-between">
            <a-col>
                <a-input
                    v-model="searchTxt" class="input-search" placeholder="搜索规则名称"
                >
                    <a-icon
                        v-show="searchTxt"
                        slot="suffix" type="close-circle" theme="filled"
                        @click="handleClear"
                    />
                </a-input>
                <a-button type="primary" @click="search">搜索</a-button>
            </a-col>
            <a-col>
                <a-button
                    icon="plus" shape="round" type="primary"
                    @click="addField"
                >
                    新建校验规则
                </a-button>
            </a-col>
        </a-row>
        <div class="table-box">
            <a-table
                class="custom-table" :loading="loading" :columns="columns"
                :data-source="customFiledList" row-key="id" :pagination="false"
            >
                <span
                    slot="name" slot-scope="text" :title="text"
                    class="first-col"
                >{{ text }}</span>
                <span
                    slot="displayMode" slot-scope="text,record" :title="text"
                >{{ text === 'POPUP' ? '页首提示' : `字段-${record.displayTitle}` }}</span>
                <template slot="action" slot-scope="text,record,index">
                    <a class="table-action" @click="editField(index)">编辑</a>
                    <a class="table-action" @click="handleDelete(index)">删除</a>
                </template>
            </a-table>
        </div>
        <ruleForm
            :module-id="moduleId"
            :initial-field-config="fieldConfig"
            :visible="fieldFormVisible"
            @close="closeFieldForm"
            @refresh="getModuleConfigData"
        />
        <deleteConfirm
            :visible="visible"
            :loading="confirmLoading"
            @handle-ok="handleOk"
            @cancel="visible=false"
        />
    </div>
</template>

<script>
    import ruleForm from './ruleForm';
    import deleteConfirm from '@/components/public/deleteConfirm';
    import { getExpresslist, delExpress } from '@/api/module';
    import { initValidateField } from '@/lib/field';

    export default {
        name: "ValidateConfig",
        components: {
            ruleForm,
            deleteConfirm
        },
        props: ['moduleId', 'activeTab'],
        data: ()=>{
            return {
                visible: false,
                confirmLoading: false,
                loading: false,
                fieldFormVisible: false,
                fieldConfig: {},    //当前编辑的字段
                searchTxt: '',
                columns: [
                    {
                        title: '校验规则名称',
                        dataIndex: 'name',
                        scopedSlots: { customRender: 'name' },
                        ellipsis: true
                    },
                    {
                        title: 'API名称',
                        dataIndex: 'apiName',
                        ellipsis: true
                    },
                    {
                        title: '错误信息',
                        dataIndex: 'hint',
                        ellipsis: true,
                    },
                    {
                        title: '错误信息显示位置',
                        dataIndex: 'displayMode',
                        scopedSlots: { customRender: 'displayMode' },
                        ellipsis: true,
                    },
                    {
                        title: '操作',
                        dataIndex: 'address',
                        width: 260,
                        scopedSlots: { customRender: 'action' },
                    }
                ],
                customFiledList: [],
                del_id: '',
                first_get_flag: false,
            }
        },
        watch: {
            activeTab: async function(val) {
                if (val === 'validate-rule' && !this.first_get_flag) {
                    await this.getModuleConfigData();
                }
            }
        },
        created() {
            this._customFiledList = [];
        },

        async mounted() {

        },

        methods: {
            getModuleConfigData: async function(){
                this.first_get_flag = true;
                try {
                    this.loading = true;
                    let id = this.$route.params.id;
                    let data = await getExpresslist(id);
                    let customFiledList = [];
                    if (data && data.length>0) {
                        data.forEach((item)=>{
                            customFiledList.push(item);
                        });
                    }
                    this.loading = false;
                    this._customFiledList = this.customFiledList = customFiledList;
                } catch (e) {
                    console.error(e);
                    this.loading = false;
                    this.$message.error('获取模块校验规则信息出错');
                }
            },
            search: function(){
                this.customFiledList = this._customFiledList.filter((attr)=>{
                    return attr.name.includes(this.searchTxt) || attr.description.includes(this.searchTxt)
                });
            },
            handleClear() {
                this.searchTxt = '';
                this.search();
            },
            addField: async function(){
                this.fieldConfig = await initValidateField('VALIDATE');
                this.fieldFormVisible = true;
            },
            editField: function(index){
                let data = this.customFiledList[index];
                this.fieldConfig = data;
                this.fieldFormVisible = true;
            },
            handleDelete(index) {
                this.visible = true;
                this.del_id = this.customFiledList[index].id;
            },
            handleOk: async function(){
                this.confirmLoading = true;
                try{
                    await delExpress(this.del_id);
                    this.confirmLoading = false;
                    this.visible = false;
                }catch (e) {
                    this.$message.error('删除失败')
                    return
                }

                try{
                    await this.getModuleConfigData();
                }catch (e) {
                    console.error(e);
                }
            },
            closeFieldForm: function(refeshData){
                this.fieldFormVisible = false;
                if(refeshData){
                    this.getModuleConfigData();
                }
            }
        }
    }
</script>

<style lang="less">
    @import '../../../../less/variables.less';
    .input-search{
        width: 264px;
        margin-right: 24px;
    }

    .filed-title{
        margin-top: 40px;
        margin-bottom: 24px;
        font-size:18px;
        font-weight:bold;
        line-height:25px;
        color: @mainFontColor100;
    }

    .filed-list{
        padding: 24px 48px 24px 24px;
    }
    .table-box{
        margin-top:32px;
    }
</style>
