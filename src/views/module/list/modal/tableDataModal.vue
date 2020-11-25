<template>
    <a-modal
        class="modal-box"
        :title="form.id?'编辑模块':'新建模块'"
        width="648px"
        :visible="visible"
        centered
        @cancel="onCancel"
    >
        <a-form-model
            ref="form"
            class="custom-form"
            :label-col="{ span: 4 }"
            :wrapper-col="{ span: 20 }"
            :model="form"
            layout="horizontal"
        >
            <div class="title-name">模块基础信息设置</div>
            <formItemWithHelp
                ref="formItem"
                label="模块名称"
                validate="title"
                :rules="[
                    { required: true, message: '请输入模块名称', trigger: 'blur' },
                ]"
            >
                <a-input
                    v-model.trim="form.title"
                    @blur="$refs.formItem.$emit('blur')"
                />
            </formItemWithHelp>
            <formItemWithHelp
                ref="formItem1"
                label="API名称"
                validate="apiName"
                :help-txt="FIELD_HELP.API_NAME"
                :rules="apiNameRules"
            >
                <a-input
                    v-model="form.apiName"
                    :disabled="!!form.id"
                    @blur="$refs.formItem1.$emit('blur')"
                />
            </formItemWithHelp>
            <a-form-model-item
                :rules="[{ required: true, message: '请选择图标', trigger: 'blur' }]"
                label="选择图标" prop="iconType"
            >
                <iconSelect v-model="form.iconType" />
            </a-form-model-item>
            <formItemWithHelp
                label="模块描述"
                validate="description"
            >
                <a-input
                    v-model="form.description"
                    class="custom-textarea"
                    type="textarea"
                />
            </formItemWithHelp>
            <div class="title-name">主属性字段设置</div>
            <formItemWithHelp
                ref="formItem2"
                label="字段名称"
                validate="mainField_title"
                :rules="[
                    { required: true, message: '请输入主属性字段名称', trigger: 'blur' },
                ]"
            >
                <a-input
                    v-model.trim="form.mainField_title"
                    @blur="$refs.formItem2.$emit('blur')"
                />
            </formItemWithHelp>
            <formItemWithHelp
                ref="formItem3"
                label="API名称"
                validate="mainField_apiName"
                :help-txt="FIELD_HELP.API_NAME"
                :rules="apiNameRules"
            >
                <a-input
                    v-model="form.mainField_apiName"
                    :disabled="!!form.id"
                    @blur="$refs.formItem3.$emit('blur')"
                />
            </formItemWithHelp>
            <formItemWithHelp
                class="field-type"
                label="字段类型"
                validate="mainField_fieldType"
                :rules="[{ required: true, message: '请选择主属性字段类型', trigger: 'blur' }]"
            >
                <a-select v-model="form.mainField_fieldType">
                    <a-select-option v-for="item in fieldTypeList" :key="item.index" :value="item.value">
                        {{ item.name }}
                    </a-select-option>
                </a-select>
            </formItemWithHelp>
            <a-row class="custom-form-item">
                <a-col :span="8" :offset="4">
                    <a-checkbox :checked="!!form.mainField_attr_unique" @change="checkboxChange('mainField_attr_unique',$event)">不允许重复</a-checkbox>
                </a-col>
            </a-row>
        </a-form-model>
        <div slot="footer" class="footer">
            <a-button
                style="width:134px"
                @click="onCancel"
            >
                取消
            </a-button>
            <a-button
                type="primary"
                style="margin-left:36px;width:134px"
                :loading="confirmLoading"
                @click="onSubmit"
            >
                保存
            </a-button>
        </div>
    </a-modal>
</template>

<script>
    import {addModule, updateModule, checkModuleApiName} from '@/api/module';
    import iconSelect from '@/components/public/iconSelect.vue'
    import TXT from "@/const/txt"
    import formItemWithHelp from "@/components/public/formItemWithHelp";

    export default {
        name: "TableDataModal",
        components: {
            iconSelect,
            formItemWithHelp
        },
        filters: {
            trimFormat(val) {
                return val.trim();
            }
        },
        props: ["visible","tableConfig"],
        data: ()=>{
            return {
                FIELD_HELP: TXT.FIELD_HELP,
                form: {},
                rules: {
                    title: [
                    { required: true, message: '请输入模块名称', trigger: 'blur' },
                    ],
                    apiName: [
                    { required: true, message: '请输入API名称', trigger: 'blur' },
                    ],
                    iconType: [
                    { required: true, message: '请选择图标', trigger: 'blur' },
                    ],
                },
                confirmLoading: false,
                apiNameRules: [],
                isShow: false,
                fieldTypeList: [],
            }
        },
        watch: {
            tableConfig: function(tableConfig){
                this.form = tableConfig;
            },
            visible: function(visible){
                if (visible) {
                    this.fieldTypeList = this.$store.getters['module/useInTitle']
                }
            },
        },
        mounted() {
        },
        created(){
            this.apiNameRules = [
                        { required: true, message: '请输入API名称', trigger: 'blur' },
                        {
                            message: '8-30位字符，只能包含大小写字母、数字、下划线，不能以下划线开头和结尾',
                            validator: (rule, value) => {
                                return value.length >= 8 && value.length <= 30 && !/[^0-9a-zA-Z_]/.test(value) && !value.startsWith('_') && !value.endsWith('_')
                            },
                            trigger: 'blur'
                        },
                        {
                            asyncValidator: (rule,value)=>{
                                return new Promise( (resolve, reject) => {
                                    if(this.form.id){
                                        resolve();
                                        return;
                                    }
                                    checkModuleApiName(value).then((flag)=>{
                                        if(!flag){
                                            resolve();
                                        } else {
                                            reject('API名称重复');
                                        }
                                    }).catch(()=>resolve())
                                })
                            }
                        }]
        },
        methods: {
            onSubmit: function(){
                this.$refs.form.validate(async(valid) => {
                    if (valid) {
                        this.confirmLoading = true;
                        try{
                            const {title,apiName,iconType,description,mainField_title,
                            mainField_apiName,mainField_fieldType,mainField_attr_maxLength} = this.form;
                            const param = {
                                title,
                                apiName,
                                iconType,
                                description,
                                // 主属性信息，必填
                                primaryField: {
                                    title: mainField_title,
                                    apiName: mainField_apiName,
                                    fieldType: mainField_fieldType,
                                    attr: {
                                        maxLength:mainField_attr_maxLength
                                    }
                                },
                                parentId: '-1'
                            }
                            const result = await addModule(param);
                            this.confirmLoading = false;
                            this.$emit('close', 'success');
                        }catch (e) {
                            this.$message.error(e.msg || '添加数据失败');
                            this.confirmLoading = false;
                        }
                    }
                });
            },
            onCancel: function(){
                this.$refs.form.resetFields();
                this.confirmLoading = false;
                this.$emit('close');
            },
            checkboxChange: function(type,$event){
                this.form[type] = Number($event.target.checked)
            },
        }
    }
</script>

<style lang="less">
@import '@/less/variables';

    .title-name {
        font-size: 16px;
        font-weight: 500;
        color: @mainFontColor100;
        line-height: 24px;
    }

</style>
