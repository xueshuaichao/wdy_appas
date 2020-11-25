<template>
    <a-modal
        title="创建记录"
        :visible="visible"
        :confirm-loading="confirmLoading"
        ok-text="确定"
        cancel-text="取消"
        :destroy-on-close="true"
        @ok="submit"
        @cancel="close"
    >
        <a-spin :spinning="isDefaultValueComputing" tip="默认值计算中..." :delay="200">
            <a-form-model
                ref="form" class="custom-form" :model="form"
                layout="horizontal"
                :colon="false"
            >
<!--                <relationForm-->
<!--                    ref="fieldForm"-->
<!--                    key="1"-->
<!--                    :form="form"-->
<!--                    :initial-data="{}"-->
<!--                    :attr="{title:'1',apiName: '123',relationModuleId: 139}"-->
<!--                    :is-depended="false"-->
<!--                    :is-update="false"-->
<!--                    @validateField="handleValidate"-->
<!--                ></relationForm>-->
                <component
                    :is="item.fieldType.toLowerCase() + 'Form'"
                    v-for="item in moduleFieldList"
                    ref="fieldForm"
                    :key="item.id"
                    :form="form"
                    :initial-data="initialForm[item.attr.apiName]"
                    :attr="item.attr"
                    :is-depended="item.isDepended"
                    :is-update="isUpdate"
                    @validateField="handleValidate"
                />
            </a-form-model>
        </a-spin>
    </a-modal>
</template>

<script>
    import textForm from '@/components/moduleFields/textForm';
    import datetimeForm from "@/components/moduleFields/datetimeForm";
    import phoneForm from '@/components/moduleFields/phoneForm';
    import identity_cardForm from '@/components/moduleFields/identity_cardForm';
    import imagesForm from "@/components/moduleFields/imagesForm";
    import fileForm from "@/components/moduleFields/fileForm";
    import videoForm from "@/components/moduleFields/videoForm";
    import emailForm from '@/components/moduleFields/emailForm';
    import regionForm from "@/components/moduleFields/regionForm";
    import urlForm from '@/components/moduleFields/urlForm';
    import textareaForm from '@/components/moduleFields/textareaForm';
    import editorForm from '@/components/moduleFields/editorForm';
    import integerForm from '@/components/moduleFields/integerForm';
    import dropdown_radioForm from "@/components/moduleFields/dropdown_radioForm";
    import dropdown_checkboxForm from "@/components/moduleFields/dropdown_checkboxForm";
    import radioForm from "@/components/moduleFields/radioForm";
    import checkboxForm from "@/components/moduleFields/checkboxForm";
    import relationForm from "@/components/moduleFields/relationForm";

    import _ from 'lodash';
    import {caculateDefaultValue,saveData} from '@/api/business';
    import {Observer,EVENT_NAME} from "@/lib/observer";
    import {computedFieldDepend} from "@/lib/field";
    import moment from 'moment';
    export default {
        name: "ModuleDataModal",
        components: {
            textForm,
            datetimeForm,
            phoneForm,
            identity_cardForm,
            imagesForm,
            fileForm,
            videoForm,
            emailForm,
            regionForm,
            urlForm,
            textareaForm,
            editorForm,
            integerForm,
            dropdown_radioForm,
            dropdown_checkboxForm,
            radioForm,
            checkboxForm,
            relationForm
        },
        props: ["visible","initialModuleFieldList","moduleId","initialForm","isUpdate"],
        data: function(){
            return {
                form: {},
                confirmLoading: false,
                moduleFieldList: [],
                isDefaultValueComputing: false  //默认值计算中
            }
        },
        computed: {
            // isUpdate: function(){
            //     return typeof this.form.id != 'undefined';
            // }
        },
        watch: {
            visible: function(value){
                if(!value) return;

                this.moduleFieldList = computedFieldDepend(_.cloneDeep(this.initialModuleFieldList))

                let initialForm = this.initialForm;
                let form = {};
                let hasDefaultExpress = false;
                this.moduleFieldList.forEach((item)=>{
                    if(item.attr.defaultValue && item.attr.defaultValue.type == 2) hasDefaultExpress = true;
                    let type = item.type;
                    let fieldType = item.fieldType;
                    let apiName = item.attr.apiName;

                    let datetime = '';
                    switch (type) {
                        case 'INTEGER':
                            if (this.isUpdate) {
                                form[apiName] = initialForm[apiName]
                            } else {
                                form[apiName] = item.attr.defaultValue.type == 1 && item.attr.defaultValue.value? parseInt(item.attr.defaultValue.value) : null
                            }
                            break;
                        case 'FILE':
                        case 'IMAGES':
                        case 'VIDEO':
                            form[apiName] = {
                                ADD: [],
                                DEL: []
                            };
                            break;
                        case 'REGION':
                            if (this.isUpdate && initialForm[apiName] instanceof Array) {
                                let len = initialForm[apiName].length;
                                form[apiName] = initialForm[apiName][len-1].treePath;
                            } else {
                                form[apiName] = item.attr.defaultValue.type == 1? item.attr.defaultValue.value : '';
                            }
                            break;
                        case 'RADIO':
                        case 'DROPDOWN_RADIO':
                            if (this.isUpdate) {
                                form[apiName] = initialForm[apiName].treePath
                            } else {
                                form[apiName] = item.attr.defaultValue.value? item.attr.defaultValue.value : undefined;
                            }
                            break;
                        case 'CHECKBOX':
                        case 'DROPDOWN_CHECKBOX':
                            if (this.isUpdate) {
                                form[apiName] = initialForm[apiName].map(item=>item.treePath);
                            } else {
                                form[apiName] = item.attr.defaultValue.value;
                            }
                            break;
                        case 'DATETIME':
                            if (this.isUpdate) {
                                datetime = initialForm[apiName]
                            } else {
                                datetime = item.attr.defaultValue && item.attr.defaultValue.type == 1? item.attr.defaultValue.value : null
                            }
                            form[apiName] = datetime ? moment(datetime) : null;
                            break;
                        case 'RELATION':
                            form[apiName] = initialForm[apiName]? initialForm[apiName].id : '';
                            break;
                        default:
                            if (this.isUpdate) {
                                form[apiName] = initialForm[apiName];
                            } else {
                                form[apiName] = item.attr.defaultValue && item.attr.defaultValue.type == 1? item.attr.defaultValue.value : null
                            }
                    }
                })

                if(initialForm.id){
                    form.id = initialForm.id
                }

                this.form = form;
                if(hasDefaultExpress && !initialForm.id) this.handleDefaultValueCompute();
            }
        },
        created() {
            Observer.on(EVENT_NAME.FIELD_DEFAULT_VALUE_COMPUTE,this.handleDefaultValueCompute)
            Observer.on(EVENT_NAME.FIELD_CLEAR_DEPENDENCE,this.handleFieldClearDependence)
        },
        beforeDestroy() {
            Observer.off(EVENT_NAME.FIELD_DEFAULT_VALUE_COMPUTE,this.handleDefaultValueCompute)
            Observer.off(EVENT_NAME.FIELD_CLEAR_DEPENDENCE,this.handleFieldClearDependence)
        },
        methods: {
            handleValidate(val) {
                this.$refs.form.validateField([val]);
            },
            submit: function(){
                this.$refs.form.validate(async(valid) => {
                    if (valid) {
                        this.confirmLoading = true;
                        const param = {
                            ...this.form,
                        }
                        Object.keys(this.form).forEach(item=>{
                            if (item.startsWith('DATETIME') && this.form[item]){
                                param[item] = this.form[item].format('YYYY-MM-DD HH:mm:ss')
                            } else {
                                param[item] = param[item] ? param[item] : null;
                            }
                        })

                        try{
                            await saveData(this.moduleId,param,this.moduleFieldList)
                            this.confirmLoading = false;
                            this.close(null,true);
                        }catch (e) {
                            if(e.code == -606){
                                let data = e.data;
                                if(data.displayMode == 'POPUP'){
                                    this.$message.error(data.hint || e.msg || '添加数据失败');
                                }else{
                                    let apiName = data.displayApiName;
                                    this.$refs.fieldForm.forEach((item)=>{
                                        if(item.attr.apiName == apiName){
                                            item.setValidateErrorMsg(data.hint || e.msg || '添加数据失败')
                                        }
                                    })
                                }
                            }else{
                                this.$message.error(e.msg || '添加数据失败');
                            }

                            this.confirmLoading = false;
                        }
                    }
                });
            },
            close: function(event,isRefreshData){
                this.$emit('close',isRefreshData);
            },
            handleFieldClearDependence: function(apiName){
                let filedConfig = this.moduleFieldList.find((item)=> item.attr.apiName == apiName)
                if(filedConfig){
                    filedConfig.isManual = true;
                    filedConfig.attr.defaultValue.referFields = [];
                }
                this.moduleFieldList = computedFieldDepend(this.moduleFieldList);
            },
            handleDefaultValueCompute: async function () {
                try{
                    this.isDefaultValueComputing = true;
                    let data = {};
                    for(let [key,value] of Object.entries(this.form)){
                        let field = this.moduleFieldList.find((item)=>item.attr.apiName == key)
                        //如果是表达式，且没有人为干预过，则不纳入计算提供的初始数据之中。主要解决这种场景：
                        //总共3个数字字段（数字1，数字2，数字3），其中数字2是数字1的克隆，数字3是数字1数字2之和
                        //第一次填数字1 值为1，则计算数字2为1，数字3暂不计算。第二次更改数字1值为12，期望计算后数字2为12，数字3为24
                        //但如果没有这些代码的话，则提交给后端的值是，数字1为12，数字2为1（上一步留下的），后端算出的结果为数字2 值12，数字3 值13（12+1得出来的）
                        if(field.attr.defaultValue.type == 2 && !field.isManual){
                            continue;
                        }
                        if (key.startsWith('DATETIME') && value){
                            data[key] = value.format('YYYY-MM-DD HH:mm:ss')
                        } else {
                            data[key] = value
                        }

                    }
                    let result = await caculateDefaultValue(this.moduleId,data,this.moduleFieldList);
                    this.isDefaultValueComputing = false;
                    for(let key in result){
                        let field = this.moduleFieldList.find((item)=>item.attr.apiName == key);
                        if(!field.isManual){
                            if(field.fieldType == 'REGION'){
                                let vdom = this.$refs.fieldForm.find((_vdom)=> _vdom.attr.apiName == field.attr.apiName)
                                vdom.setValue(result[key]);
                            }else if(field.type == 'DATETIME'){

                                this.form[key] = result[key] ? moment(result[key]) : null;
                            }else{
                                this.form[key] = result[key];
                            }
                        }
                    }
                }catch (e) {
                    console.error('计算默认值出错');
                }
            }
        }
    }
</script>

<style scoped>

</style>
