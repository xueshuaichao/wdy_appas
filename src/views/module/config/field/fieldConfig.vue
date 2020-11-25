<template>
    <div class="filed-list">
        <a-row type="flex" justify="space-between">
            <a-col>
                <a-input
                    v-model="tmpSearchTxt" class="input-search" placeholder="请输入字段名称或描述"
                    allow-clear
                />
                <a-button type="primary" @click="search">搜索</a-button>
            </a-col>
            <a-col>
                <a-button
                    icon="plus" shape="round" type="primary"
                    @click="addField"
                >
                    新建自定义字段
                </a-button>
            </a-col>
        </a-row>
        <div>
            <p class="filed-title">自定义字段</p>
            <a-table
                class="custom-table" :loading="loading" :columns="columns"
                :data-source="customFiledList" row-key="id" :pagination="false"
            >
                <span
                    slot="name" slot-scope="text" :title="text"
                    class="first-col"
                >{{ text }}</span>
                <span
                    slot="isPrimaryAttr" slot-scope="text"
                >{{ text === 1 ? '是' : '否' }}
                </span>
                <span
                    slot="description" slot-scope="text,record"
                >{{ record.isPrimaryAttr === 1 ? '主属性字段' : text }}
                </span>
                
                <template slot="action" slot-scope="text,record,index">
                    <a @click="editField(index,'custom')">编辑</a>
                </template>
            </a-table>
            <p class="filed-title">标准字段</p>
            <a-table
                class="custom-table" :loading="loading" :columns="columns"
                :data-source="preFieldList" row-key="id" :pagination="false"
            >
                <span
                    slot="isPrimaryAttr" slot-scope="text"
                >{{ text === 1 ? '是' : '否' }}
                </span>
                <span
                    slot="description" slot-scope="text,record"
                >{{ record.isPrimaryAttr === 1 ? '主属性字段' : text }}
                </span>
                <span slot="name" slot-scope="text" class="first-col">{{ text }}</span>
                <template slot="action" slot-scope="text,record,index">
                    <a @click="editField(index,'pre')">编辑</a>
                </template>
            </a-table>
        </div>
        <filedForm
            :module-id="moduleId"
            :initial-field-config="fieldConfig"
            :types="types"
            :visible="fieldFormVisible"
            :is-primary-attr="isPrimaryAttr"
            @close="closeFieldForm"
            @refresh="getModuleConfigData"
        />
    </div>
</template>

<script>
    import filedForm from './fieldForm';

    import moduleFieldMap  from '@/lib/moduleFieldMap'
    import { getModuleFieldList } from '@/api/module';
    import {fieldDataServer2FE, generateFieldConfig} from '@/lib/field';

    export default {
        name: "FieldConfig",
        components: {
            filedForm
        },
        props: ['moduleId'],
        data: ()=>{
            return {
                loading: false,
                types: '',
                fieldFormVisible: false,
                fieldConfig: {},    //当前编辑的字段
                tmpSearchTxt: '',
                searchTxt: '',  //点击搜索的时候将 tmpSearchTxt赋值给searchTxt 之后通过计算属性得到过滤后的字段
                isPrimaryAttr: true,
                columns: [
                    {
                        title: '字段名称',
                        dataIndex: 'attr.title',
                        scopedSlots: { customRender: 'name' },
                        ellipsis: true
                    },
                    {
                        title: '主属性字段',
                        dataIndex: 'isPrimaryAttr',
                        scopedSlots: { customRender: 'isPrimaryAttr' },
                        ellipsis: true
                    },
                    {
                        title: 'API名称',
                        dataIndex: 'attr.apiName',
                        ellipsis: true
                    },
                    {
                        title: '字段类型',
                        dataIndex: 'fieldType',
                        customRender: (fieldType)=> moduleFieldMap[fieldType].name
                    },
                    {
                        title: '描述',
                        dataIndex: 'attr.description',
                        scopedSlots: { customRender: 'description' },
                        ellipsis: true,
                    },
                    {
                        title: '操作',
                        dataIndex: 'address',
                        width: 260,
                        scopedSlots: { customRender: 'action' },
                    }
                ]
            }
        },
        computed: {
            customFiledList: function(){
                return this.$store.state.module.fieldList.filter(({fieldSource,attr})=>{
                    return fieldSource == 1 && (attr.title.includes(this.searchTxt) || attr.description.includes(this.searchTxt))
                });
            },
            preFieldList: function(){
                return this.$store.state.module.fieldList.filter(({fieldSource,attr})=>{
                    return fieldSource != 1 && (attr.title.includes(this.searchTxt) || attr.description.includes(this.searchTxt))
                });
            }
        },
        async mounted() {
            await this.getModuleConfigData();
        },
        methods: {
            getModuleConfigData: async function(){
                try {
                    this.loading = true;
                    let id = this.$route.params.id;
                    await this.$store.dispatch('module/getFieldList',id);
                    this.loading = false;
                } catch (e) {
                    console.error(e);
                    this.loading = false;
                    this.$message.error('获取模块字段信息出错');
                }
            },
            search(){
                this.searchTxt = this.tmpSearchTxt;
            },
            addField: async function(){
                this.fieldConfig = await generateFieldConfig('TEXT');
                this.isPrimaryAttr = false;
                this.fieldFormVisible = true;
            },
            editField: function(index,type){
                let data = type == 'custom'? this.customFiledList[index] : this.preFieldList[index];
                this.types= type;
                this.isPrimaryAttr = !!data.isPrimaryAttr;
                this.fieldConfig = data;
                this.fieldFormVisible = true;
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

<style lang="less" scoped>
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
</style>
