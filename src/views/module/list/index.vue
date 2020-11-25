<template>
    <a-layout style="padding: 40px 0px 0px 24px;">
        <a-layout-content class="con">
            <div class="table-header">
                自建模块列表
            </div>
            <div class="content-box">
                <div class="search-box">
                    <div class="search-box-left">
                        <a-form-model layout="inline">
                            <a-form-model-item label="模块名称">
                                <a-input
                                    v-model="form.title"
                                    class="search-input"
                                    placeholder="请输入模块名称"
                                >
                                    <a-icon
                                        v-show="form.title"
                                        slot="suffix" type="close-circle" theme="filled"
                                        @click="handleClear"
                                    />
                                </a-input>
                            </a-form-model-item>
                            <a-form-model-item label="关联模块名称">
                                <a-input
                                    v-model="relateModule"
                                    class="search-input"
                                    placeholder="请输入关联模块名称"
                                >
                                    <a-icon
                                        v-show="relateModule"
                                        slot="suffix" type="close-circle" theme="filled"
                                        @click="relateModule=''"
                                    />
                                </a-input>
                            </a-form-model-item>
                            <a-form-model-item>
                                <a-button
                                    type="primary"
                                    @click="handleSearch"
                                >
                                    搜索
                                </a-button>
                            </a-form-model-item>
                        </a-form-model>
                    </div>
                    <div class="search-box-right">
                        <a-button
                            type="primary"
                            shape="round"
                            icon="plus"
                            class="new-btn"
                            @click="handleEdit"
                        >
                            新建模块
                        </a-button>
                    </div>
                </div>
                <a-table
                    :columns="columns"
                    :row-key="recorder => recorder.id"
                    :data-source="tableData"
                    :pagination="pagination"
                    :loading="loading"
                    class="custom-table"
                    @change="handleTableChange"
                >
                    <span slot="relateModule">--</span>

                    <template slot="action" slot-scope="text, record">
                        <a class="table-action" @click="handleSet(record)">编辑</a>
                        <a class="table-action" @click="handleDelete(record)">删除</a>
                    </template>
                </a-table>
            </div>
        </a-layout-content>
        <tableDataModal
            :visible="tableDataModalVisible"
            :table-config="tableConfig"
            @close="closeModal"
        />
        <deleteConfirm 
            :visible="visible"
            :loading="confirmLoading"
            @handle-ok="handleOk"
            @cancel="visible=false"
        />
    </a-layout>
</template>

<script>
    import tableDataModal from './modal/tableDataModal';
    import deleteConfirm from '@/components/public/deleteConfirm';
    import { getModuleList, delModule} from '@/api/module';
    import {checkModule} from '@/api/business';
    import {generateApiName} from "@/lib/field";

    export default {
        name: "ModuleList",
        components: {
            tableDataModal,
            deleteConfirm,
        },
        data: ()=>{
            return {
                tableDataModalVisible: false,
                confirmLoading: false,
                loading: false,
                tableName: '',
                form: {
                    title: '',
                    pageSize: 10,
                },
                tableConfig: null,
                columns: [
                    {
                        title: '模块名称',
                        dataIndex: 'title',
                        key: 'title',
                        scopedSlots: { customRender: 'titles' },
                        ellipsis: true
                    },
                    {
                        title: 'API名称',
                        dataIndex: 'apiName',
                        key: 'apiName',
                    },
                    {
                        title: '描述',
                        key: 'description',
                        dataIndex: 'description',
                        scopedSlots: { customRender: 'description' },
                        ellipsis: true
                    },
                    // {
                    //     title: '关联模块',
                    //     key: 'relateModule',
                    //     dataIndex: 'relateModule',
                    //     scopedSlots: { customRender: 'relateModule' },
                    // },
                    {
                        title: '操作',
                        key: 'action',
                        dataIndex: 'action',
                        scopedSlots: { customRender: 'action' },
                    },
                ],
                tableData: [
                ],
                visible: false,
                deleteId: '',
                pagination: {
                    current: 1,
                    pageSize: 10,
                    total: 0,
                },
                relateModule: '',
            }
        },
        created() {
            this.getModuleListFn(1);
        },
        methods: {
            handleClear() {
                this.form.title = '';
                this.getModuleListFn(1);
            },
            getModuleListFn: async function(currentPage) {
                this.loading = true;
                try {
                    const result = await getModuleList(this.form.title, this.form.pageSize, currentPage);
                    this.loading = false;
                    this.tableData = result.result;
                    this.pagination.total = result.total;
                    this.pagination.current = currentPage;
                } catch(e) {
                    this.$message.error(e.msg || '获取数据失败');
                    this.loading = false;
                }
            },
            handleTableChange(pagination) {
                this.pagination = {
                    ...this.pagination,
                    current: pagination.current
                };
                this.getModuleListFn(pagination.current);
            },
            async handleOk() {
                this.confirmLoading = true;
                try{
                    const result = await delModule(this.deleteId);
                    this.getModuleListFn(1);
                    this.confirmLoading = false;
                    this.visible = false;
                }catch(e){
                    this.$message.error(e.msg || '删除数据失败');
                    this.confirmLoading = false;
                }
                
            },
            handleDelete: async function(record) {
                try{
                    const checkresult = await checkModule(record.id);
                    if (!checkresult) {
                        this.deleteId = record.id;
                        this.visible = true;
                    } else {
                        this.$message.warning('此module已产生数据，无法删除');
                    }
                }catch(e){
                    this.$message.error(e.msg || '删除数据失败');
                }
            },
            handleEdit: function(){
                // 新建模块
                const apiName = generateApiName('module');
                const mainField_apiName = generateApiName('mainField');
                this.tableConfig = {
                    title: '',
                    apiName,
                    iconType: 1,
                    description: '',
                    // 主属性信息，必填
                    mainField_title: '',
                    mainField_apiName,
                    mainField_fieldType: 'TEXT',
                    // 字段属性 attr
                    mainField_attr_maxLength: 15,
                    mainField_attr_unique: 1, 
                }
                this.tableDataModalVisible = true;
            },
            handleSearch() {
                this.getModuleListFn(1);
            },
            handleSet(record) {
                this.$router.push({
                    path: `/customModule/config/${record.id}`
                });
            },
            closeModal: function(msg){
                this.tableDataModalVisible = false;
                if (msg === 'success') {
                    this.getModuleListFn(1);
                }
            },
        },
    }
</script>

<style lang="less" scoped>
    @import '../../../less/variables.less';
    .con{
        margin: 0;
        min-height: 280px;
        display: flex;
        flex-direction: column;
        .table-header{
            margin-bottom: 24px;
            font-size:18px;
            font-weight:500;
            color: @mainFontColor85;
        }
        .content-box{
            background: #fff;
            padding: 24px;
            flex: 1;
            border-radius:4px;
            .search-box {
                margin-bottom: 40px;
                overflow: hidden;
                .search-box-left{
                    float: left;
                }
                .search-box-right{
                    float: right;
                }
                .search-input {
                    width: 200px;
                    margin-right: 24px;
                }
                .new-btn{
                    float: right;
                }
            }
        }
    }
</style>
