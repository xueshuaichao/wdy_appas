<template>
    <a-form-model
        ref="form" layout="horizontal" :model="attr"
        class="custom-form" :label-col="labelCol" :wrapper-col="wrapperCol"
    >
        <a-spin :spinning="loading" :delay="200">
            <formItemWithHelp
                ref="formItem"
                label="字段名称"
                validate="title"
                :rules="[{ required: true, message: '请输入字段名称', trigger: 'blur' }]"
            >
                <a-input v-model="attr.title" class="from-item" @blur="$refs.formItem.$emit('blur')" />
            </formItemWithHelp>
            <formItemWithHelp
                ref="formItem1"
                label="API名称"
                validate="apiName"
                :help-txt="FIELD_HELP.API_NAME"
                :rules="apiNameRules"
            >
                <a-input
                    v-model="attr.apiName" :disabled="fieldDisabled" class="from-item"
                    @blur="$refs.formItem1.$emit('blur')"
                />
            </formItemWithHelp>
            <a-row class="custom-form-item">
                <a-col :span="8" :offset="5">
                    <a-checkbox :checked="!!attr.required" @change="handleRequiredChange">必填</a-checkbox>
                </a-col>
            </a-row>
            <formItemWithHelp
                label="关联模块"
                validate="relationModuleId"
                :rules="[
                    { required: true, message: '请选择关联模块'},
                ]"
            >
                <a-select
                    v-if="filterModuleList.length"
                    v-model="attr.relationModuleId"
                    show-search
                    placeholder="请选择关联模块"
                    :filter-option="false"
                    @search="handleRelationModuleSearch"
                    @change="handleRelationModuleChange"
                >
                    <a-select-option v-for="item in filterModuleList" :key="item.id" :value="item.id">
                        {{ item.title }}
                    </a-select-option>
                </a-select>
                <a-select v-else show-search placeholder="请选择关联模块" />
            </formItemWithHelp>
            <formItemWithHelp
                label="级联删除"
                validate="delStrategy"
                :help-txt="delStrategyHelp"
                :rules="[
                    { required: true, message: '请选择级联删除'},
                ]"
            >
                <a-radio-group v-model="attr.delStrategy" :disabled="delStrategyDisabled">
                    <a-radio :value="1">提示不允许删除</a-radio>
                    <a-radio :value="2">子模块此关联关系字段的数据被删除</a-radio>
                </a-radio-group>
            </formItemWithHelp>
            <formItemWithHelp
                label="关联列表"
                validate="showFields"
                :help-txt="showFieldsHelp"
                :rules="[
                    { required: true, message: '请选择父模块的列表展示字段'},
                ]"
            >
                <select-input :content="showFieldsTitle.join(',')" @click.native="handleVisibleShowFieldSelect" />
            </formItemWithHelp>
            <formItemWithHelp
                label="可选数据范围"
            >
                <a-radio-group :value="1" disabled>
                    <a-radio :value="1">全部数据</a-radio>
                    <a-radio :value="2">符合以下条件数据</a-radio>
                </a-radio-group>
            </formItemWithHelp>
            <formItemWithHelp label="默认提示" :help-txt="FIELD_HELP.PLACEHOLDER">
                <a-input v-model="attr.defaultPrompt" />
            </formItemWithHelp>
            <formItemWithHelp label="帮助文本" :help-txt="FIELD_HELP.HELP_TEXT">
                <a-textarea v-model="attr.hint" class="custom-textarea" />
            </formItemWithHelp>
            <formItemWithHelp label="字段描述" :help-txt="FIELD_HELP.DESC">
                <a-textarea v-model="attr.description" class="custom-textarea" />
            </formItemWithHelp>
        </a-spin>
        <a-modal
            title="关联列表"
            width="648px"
            :visible="showModal"
            :destroy-on-close="true"
            centered
            @ok="handleSubmitShowFieldSelect"
            @cancel="handleCancelShowFieldSelect"
        >
            <div class="show-fields-container">
                <a-transfer
                    :data-source="moduleFieldList"
                    :titles="['可选字段', '已选字段']"
                    :closable="false"
                    :target-keys="showFieldsKey"
                    :render="item => item.title"
                    @change="handleShowFiledsChange"
                />
            </div>
        </a-modal>
    </a-form-model>
</template>

<script>
    import fieldConfig from "@/mixin/fieldConfig";
    import selectInput from "@/components/public/selectInput"
    import {getSimpleModuleList, getModuleFieldList} from "@/api/module";

    export default {
        name: "RelationConfig",
        components: {
            selectInput
        },
        mixins: [fieldConfig],
        data: function(){
            return {
                loading: false,
                delStrategyHelp: '1.提示不允许删除-当删除关联模块的数据时，提示此数据存在相关联的业务数据，不允许删除 <br/> 2.此字段的数据被删除-当删除关联模块的数据时，与此数据存在相关联的业务数据的关联关系字段的值被清空，即解除数据间的关联关系',
                showFieldsHelp: '通过子模块的关联关系字段，打开的父模块的列表页所展示的字段',
                moduleSearch: '',
                moduleList: [],
                moduleFieldList: [],
                showModal: false,
                showFieldsKey: this.attr.showFields
            }
        },
        computed: {
            filterModuleList: function () {
                if(this.moduleSearch){
                    return this.moduleList.filter((item)=>{
                        return item.title.indexOf(this.moduleSearch) >= 0
                    })
                }else{
                    //只渲染10个，防止影响性能
                    let start = 0, end = 10;
                    if(this.attr.relationModuleId){
                        let index = this.moduleList.findIndex(item=>item.id == this.attr.relationModuleId);
                        if(index >= 10){
                            start = index - 9;
                            end = index + 1;
                        }
                    }
                    return this.moduleList.slice(start,end);
                }
            },
            showFieldsTitle: function(){
                return this.attr.showFields.map((key)=>{
                    let field = this.moduleFieldList.find((item)=>{
                        return item.key == key
                    })
                    return field? field.title : '';
                })
            },
            delStrategyDisabled: function(){
                return !!this.attr.required
            }
        },
        async mounted() {
            try{
                this.loading = true;
                let res = await getSimpleModuleList();
                this.moduleList = res.filter((item)=> item.id != this.moduleId);
            }catch (e) {
                this.$message.error('获取模块列表失败');
                this.loading = false;
                return;
            }

            if(this.attr.relationModuleId){
                await this.getFieldList(this.attr.relationModuleId);
            }

            this.loading = false;
        },
        methods: {
            getFieldList: async function(moduleId){
                try{
                    this.loading = true;
                    let res = await getModuleFieldList(moduleId);
                    this.moduleFieldList = res.map((item)=>{
                        return {
                            key: item.apiName,
                            title: item.title
                        }
                    });
                }
                catch (e) {}
                finally {
                    this.loading = false;
                }
            },
            handleRequiredChange: function($event){
                let checked = $event.target.checked;
                this.attr.required = Number(checked);
                if(checked){
                    this.attr.delStrategy = 1;
                }
            },
            handleRelationModuleSearch: function(value){
                this.moduleSearch = value;
            },
            handleRelationModuleChange: async function(moduleId){
                await this.getFieldList(moduleId);

                this.attr.showFields = [];
                this.showFieldsKey = [];
            },
            handleVisibleShowFieldSelect: function(){
                this.showModal = true;
            } ,
            handleShowFiledsChange: function(nextTargetKeys){
                this.showFieldsKey = nextTargetKeys;
            },
            handleSubmitShowFieldSelect: function(){
                this.attr.showFields = this.showFieldsKey;
                this.showModal = false;
            },
            handleCancelShowFieldSelect: function(){
                this.showFieldsKey = this.attr.showFields;
                this.showModal = false;
            }
        }
    }
</script>

<style lang="less" scoped>
@import '~@/less/variables.less';

.show-fields-container{
    display: flex;
    justify-content: center;
}
</style>
