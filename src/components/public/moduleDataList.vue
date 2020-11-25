<template>
    <div>
        <a-table
            class="custom-table"
            :columns="columns"
            :row-key="recorder => recorder.id"
            :data-source="moduleData"
            :loading="loading"
            :scroll="{x:500}"
            :row-selection="rowSelection"
            :pagination="pagination"
        >
            <template slot="EDITOR" slot-scope="text">
                <a class="table-action" href="#" @click="handleDisplayEditor(text)">查看</a>
            </template>
            <template slot="PHONE" slot-scope="text, record, index, column">
                {{ column.showMask === 1 ? showMask(text,column.fromMask,column.toMask) : text }}
            </template>
            <template slot="EMAIL" slot-scope="text, record, index, column">
                {{ column.showMask === 1 ? showMask(text,column.fromMask,column.toMask) : text }}
            </template>
            <template slot="IDENTITY_CARD" slot-scope="text, record, index, column">
                {{ column.showMask === 1 ? showMask(text,column.fromMask,column.toMask) : text }}
            </template>
            <template slot="RELATION" slot-scope="text, record, index, column">
                <a v-if="text" target="_blank" :href="`/myApp/detail?moduleId=${column.relationModuleId}&id=${text.id}`">{{text.value}}</a>
            </template>
            <template slot="IMAGES" slot-scope="text">
                <a
                    v-for="item in text"
                    :key="item.id"
                    class="file-item"
                    target="_blank"
                    :href="`${Host.OSS}/${item.objectName}`"
                >{{ item.fileName }}</a>
            </template>
            <template slot="FILE" slot-scope="text">
                <a
                    v-for="item in text"
                    :key="item.id"
                    class="file-item"
                    target="_blank"
                    :href="`${Host.OSS}/${item.objectName}`"
                >{{ item.fileName }}</a>
            </template>
            <template slot="VIDEO" slot-scope="text">
                <a
                    v-for="item in text"
                    :key="item.id"
                    class="file-item"
                    target="_blank"
                    :href="`${Host.ALI_VIDEO}/${item.objectName}`"
                >{{ item.fileName }}</a>
            </template>
            <template slot="REGION" slot-scope="text">
                {{ text instanceof Array? text.reduce((result,item)=> result + (result? ',' : '') + item.label,'') : '' }}
            </template>
            <template slot="DROPDOWN_RADIO" slot-scope="text">
                {{ text? text.label : '' }}
            </template>
            <template slot="DROPDOWN_CHECKBOX" slot-scope="text">
                {{ text instanceof Array? text.reduce((result,item)=> result + (result? ',' : '') + item.label,'') : '' }}
            </template>
            <template slot="RADIO" slot-scope="text">
                {{ text? text.label : '' }}
            </template>
            <template slot="CHECKBOX" slot-scope="text">
                {{ text instanceof Array? text.reduce((result,item)=> result + (result? ',' : '') + item.label,'') : '' }}
            </template>
            <template slot="action" slot-scope="text,record,index">
                <a v-if="typeof editFn == 'function'" class="table-action" href="#" @click="editFn(record)">编辑</a>
                <a v-if="showDel" class="table-action" href="#" @click="handlePreDel(index)">删除</a>
            </template>
        </a-table>
        <a-modal v-model="editorVisible" title="内容" @ok="this.editorVisible = false">
            <div v-html="editorText" />
        </a-modal>
        <deleteConfirm
            :visible="delConfirmVisible"
            :content="delConfirmMsg"
            @handle-ok="handleDel"
            @cancel="delConfirmVisible=false">
        </deleteConfirm>
    </div>
</template>

<script>
    import {showMask} from '@/lib/utils';
    import {checkDel,delData} from "@/api/business";
    import Host from "@/const/host";
    import deleteConfirm from "@/components/public/deleteConfirm";

    export default {
        name: "moduleDataList",
        components: {
            deleteConfirm
        },
        props: {
            moduleId: {
                type: [String,Number],
                required: true
            },
            moduleFieldList: {
                type: Array,
                required: true
            },
            getData: {          //获取业务数据的方法，function(pageNum:num,pageSize:num):Promise.resolve([data])
                type: Function,
                required: true
            },
            selectType: {
                type: String,
                validator: function(value){
                    return ['radio', 'checkbox'].indexOf(value) !== -1  //有此属性时才会显示表格选择，父组件通过getSelectedData()方法获取选择的数据
                }
            },
            initialSelectedRowKeys: Array,
            editFn: Function,   //编辑数据的的回调，入参为当前行数据，有此属性时才会显示编辑按钮
            showDel: {          //此属性为true时才会显示删除按钮
                type: Boolean,
                default: true
            },
            afterDelFn: Function //删除成功后的回调，入参为当前行数据
        },
        data: function(){
            return {
                Host,
                moduleData: [],
                columns: [],
                loadingBusinessData: false,
                selectedRowKeys: [],
                delConfirmVisible: false,
                delConfirmMsg: '',
                editorVisible: false,
                editorText: '',
                pagination: {
                    change: function(page, pageSize){
                        this.getModuleData(page, pageSize)
                    }
                }
            }
        },
        computed: {
            rowSelection: function(){
                return this.selectType? {type: this.selectType, selectedRowKeys: this.selectedRowKeys, onChange: this.onSelectChange } : null
            },
            loading: function(){
                return  this.columns.length == 0 || this.loadingBusinessData;
            }
        },
        watch: {
            moduleFieldList: {
                handler: async function(value){
                    if(!value.length) return;

                    this.initTableColumns();

                    try{
                        await this.getModuleData();
                    }catch (e) {
                        this.$message.error('获取数据失败')
                    }
                },
                immediate: true
            }
        },
        created() {
            this.selectedRows = [];
            this.preDelData = null;
        },
        methods: {
            showMask,
            initTableColumns: function(){
                let columns = [];

                for(let item of this.moduleFieldList){
                    let _column = {
                        title: item.attr.title,
                        dataIndex: item.attr.apiName,
                        width: 200,
                        fieldSource: item.fieldSource,
                        scopedSlots: { customRender: item.fieldType },
                    };


                    if (
                        item.fieldType === 'IDENTITY_CARD'
                        || item.fieldType === 'PHONE'
                        || item.fieldType === 'EMAIL'
                    ) {
                        _column.showMask = item.attr.showMask
                        _column.fromMask = item.attr.fromMask
                        _column.toMask = item.attr.toMask
                    }

                    if(item.fieldType == 'RELATION'){
                        _column.relationModuleId = item.attr.relationModuleId
                    }

                    columns.push(_column)
                }

                columns.sort((val1)=>{
                    if(val1.fieldSource == 0) return 1;
                    return -1;
                })

                if(this.showDel || typeof this.editFn == 'function'){
                    columns.push({
                        title: '操作',
                        dataIndex: 'address',
                        width: 260,
                        scopedSlots: { customRender: 'action' },
                    });
                }

                this.columns = columns;
            },
            getModuleData: async function(page=1, pageSize=10){
                try{
                    this.loadingBusinessData = true;
                    let {result} = await this.getData(page, pageSize);

                    this.moduleData = result;
                }catch (e) {
                    this.$message.error('获取业务数据失败')
                }finally {
                    this.loadingBusinessData = false;
                }
            },
            handleDisplayEditor(text) {
                this.editorText = text;
                this.editorVisible = true;
            },
            handlePreDel: async function(index){
                let data = this.moduleData[index];
                let id = data.id;

                try{
                    let result = await checkDel(this.moduleId,id);
                    if(!result.isAllowed){
                        this.$message.error(result.message)
                    }else{
                        this.preDelData = data;
                        this.delConfirmMsg = result.message;
                        this.delConfirmVisible = true;
                    }
                }catch (e) {
                    console.error('检查可否删除接口异常',e);
                }
            },
            handleDel: async function(){
                try{
                    await delData(this.moduleId,this.preDelData.id);
                }catch (e) {
                    this.$message.error('删除失败')
                    return
                }

                try{
                    await this.getModuleData();
                }catch (e) {
                    console.error(e);
                }

                if(this.afterDelFn) this.afterDelFn(this.preDelData);
                this.preDelData = null;
            },
            onSelectChange: function(selectedRowKeys,selectedRows){
                this.selectedRowKeys = selectedRowKeys;
                this.selectedRows = selectedRows;
            },
            getSelectedData: function(){
                return this.selectedRows;
            }
        }
    }
</script>

<style scoped>
    .file-item{
        display: inline-block;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        width: 100%;
    }
</style>
