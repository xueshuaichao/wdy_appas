<template>
    <a-drawer
        :title="isUpdate? '编辑字段' : '新建字段' "
        :visible="visible"
        :drawer-style="drawerStyle"
        :header-style="headerStyle"
        :body-style="bodyStyle"
        :width="screenWidth>1440?781:720"
        :destroy-on-close="true"
        @close="close()"
    >
        <div class="form-container">
            <div class="module-model-list-container" :style="{width: screenWidth>1440?'200px':'163px'}">
                <p class="title">字段类型</p>
                <ul class="module-model-list">
                    <li
                        v-for="item in moduleFieldList"
                        :key="item.fieldType"
                        class="model-item"
                        :class="{isActives: item.fieldType == fieldConfig.fieldType, isDisabled: item.fieldType != fieldConfig.fieldType && (isUpdate || !isCustom)}"
                        @click="switchField(item.fieldType)"
                    >
                        {{ item.name }}
                    </li>
                </ul>
            </div>
            <div v-if="!isEmptyFieldConfig" class="field-config-container">
                <div id="field-config-form" class="field-config-form" style="position: relative">
                    <div class="title" :class="{'has-desc': !!fieldConfig.desc}">
                        <div>
                            {{ fieldConfig.name }}
                            <a-popover placement="bottomLeft" :mouse-leave-delay="0">
                                <span class="review">预览</span>
                                <template slot="content">
                                    <img
                                        v-if="fieldConfig.fieldType"
                                        :style="{
                                            width:fieldConfig.fieldType === 'FILE'
                                                || fieldConfig.fieldType === 'IMAGES'
                                                || fieldConfig.fieldType === 'VIDEO'
                                                ? '87px' : '246px'
                                        }"
                                        :src="require(`@/assets/review/${fieldConfig.fieldType}.png`)"
                                    >
                                </template>
                            </a-popover>
                        </div>
                        <p v-if="fieldConfig.desc" class="desc">
                            {{ fieldConfig.desc }}
                        </p>
                    </div>
                    <component
                        :is="fieldConfig.fieldType.toLowerCase() + 'Config'" ref="config"
                        :module-id="moduleId"
                        :field-id="fieldConfig.id"
                        :attr="fieldConfig.attr"
                        :is-update="isUpdate"
                        :is-custom="isCustom"
                        :is-primary-attr="isPrimaryAttr"
                    />
                </div>
                <div class="action">
                    <a-button :disabled="buttonDisabled" @click="close">取消</a-button>
                    <a-button
                        :type="isUpdate? 'primary' : 'default'"
                        :disabled="buttonDisabled"
                        @click="onSave(false)"
                    >
                        保存
                    </a-button>
                    <a-button
                        v-show="!isUpdate"
                        :disabled="buttonDisabled"
                        type="primary"
                        @click="onSave(true)"
                    >
                        保存并新建
                    </a-button>
                </div>
            </div>
        </div>
    </a-drawer>
</template>

<script>
import textConfig from '@/components/moduleFields/textConfig';
import datetimeConfig from '@/components/moduleFields/datetimeConfig';
import phoneConfig from '@/components/moduleFields/phoneConfig';
import urlConfig from '@/components/moduleFields/urlConfig';
import emailConfig from '@/components/moduleFields/emailConfig';
import identity_cardConfig from '@/components/moduleFields/identity_cardConfig';
import dropdown_radioConfig from "@/components/moduleFields/dropdown_radioConfig";
import dropdown_checkboxConfig from "@/components/moduleFields/dropdown_checkboxConfig";
import radioConfig from "@/components/moduleFields/radioConfig";
import checkboxConfig from "@/components/moduleFields/checkboxConfig";
import imagesConfig from "@/components/moduleFields/imagesConfig";
import fileConfig from "@/components/moduleFields/fileConfig";
import videoConfig from "@/components/moduleFields/videoConfig";
import regionConfig from "@/components/moduleFields/regionConfig";
import clerk_radioConfig from "@/components/moduleFields/clerk_radioConfig";
import textareaConfig from "@/components/moduleFields/textareaConfig";
import editorConfig from "@/components/moduleFields/editorConfig";
import integerConfig from "@/components/moduleFields/integerConfig";
import relationConfig from "@/components/moduleFields/relationConfig";
import formHelp from "@/components/public/formHelp";
import _ from 'lodash';
import { addOrUpdateField } from '@/api/module'
import {fieldDataFE2Server, generateFieldConfig} from '@/lib/field';
import moduleFieldMap from '@/lib/moduleFieldMap';

const _moduleFieldList = [
    'TEXT','TEXTAREA','VIDEO','FILE','IMAGES','DATETIME','DROPDOWN_RADIO','DROPDOWN_CHECKBOX',
    'RADIO','CHECKBOX','PHONE','EMAIL','IDENTITY_CARD','REGION','EDITOR', 'INTEGER',
     'URL','RELATION','CLERK_RADIO',
];
    export default {
        name: "FieldForm",
        components: {
            textConfig,
            datetimeConfig,
            phoneConfig,
            identity_cardConfig,
            dropdown_radioConfig,
            dropdown_checkboxConfig,
            radioConfig,
            checkboxConfig,
            imagesConfig,
            fileConfig,
            videoConfig,
            urlConfig,
            emailConfig,
            regionConfig,
            clerk_radioConfig,
            textareaConfig,
            editorConfig,
            integerConfig,
            relationConfig,
            formHelp
        },
        props: ["moduleId","visible","initialFieldConfig","types","isPrimaryAttr"],
        data: function(){
            return {
                buttonDisabled: false,
                drawerStyle: {
                    display: 'flex',
                    flexDirection: 'column'
                },
                headerStyle: {
                    background: '#F1F1F5',
                },
                bodyStyle: {
                    flexGrow: 1,
                    padding: 0
                },
                moduleFieldList: _moduleFieldList.map((moduleType)=>{
                    let field = moduleFieldMap[moduleType];
                    // debugger;
                    // console.log(field);
                    return {
                        fieldType: field.fieldType,
                        name: field.name
                    }
                }),
                fieldConfig: {
                },
                screenWidth: window.screen.width,
            }
        },
        computed: {
            isUpdate: function(){
                return typeof this.fieldConfig.id != 'undefined';
            },
            isCustom: function(){
                return this.fieldConfig.fieldSource == 1
            },
            isEmptyFieldConfig: function(){
                return _.isEmpty(this.fieldConfig);
            }
        },
        watch: {
            initialFieldConfig: function(val){
                this.fieldConfig = _.cloneDeep(val);
            },
            visible: function(val){
                if (val) {
                    setTimeout(()=>{
                        document.querySelector(".isActives").scrollIntoView()
                    },10)
                }
            }
        },
        methods: {
            switchField: async function(fieldType){
                if(this.isUpdate || !this.isCustom) return;
                this.fieldConfig = await generateFieldConfig(fieldType)
            },
            onSave: function(continueFlag) {
                // debugger;
                let form = this.$refs.config.$refs.form;
                this.buttonDisabled = true;
                form.validate(async(valid) => {
                    let customValidate
                    try{
                        customValidate = await this.$refs.config.customValidate();
                    }catch (e) {
                        this.$message.error('表单校验异常');
                        this.buttonDisabled = false;
                        return;
                    }
                    if (valid && customValidate) {
                        let data = fieldDataFE2Server(this.moduleId, this.fieldConfig);
                        try {
                            await addOrUpdateField(data);
                        } catch (res) {
                            this.$message.error(res.msg || '保存失败');
                            this.buttonDisabled = false;
                            return;
                        }

                        if(continueFlag){
                            form.resetFields();
                            this.$refs.config.customReset();
                            let fieldType = this.fieldConfig.fieldType;
                            this.fieldConfig = await generateFieldConfig(fieldType);
                            this.$emit('refresh');
                        } else {
                            this.close(true);
                        }
                    }
                    this.buttonDisabled = false;
                });
            },
            close: function(refeshData=false){
                this.$emit('close',refeshData)
            }
        },

    }
</script>

<style lang="less" scoped>
    @import '../../../../less/variables.less';
    .form-container{
        display: flex;
        height: calc(100vh - 55px);

        .module-model-list-container{
            display: flex;
            flex-direction: column;
            flex-grow: 0;
            background: @mainGrayBackgroundColor;
            align-items: center;

            .title{
                width: 120px;
                font-size:18px;
                font-weight:400;
                color:rgba(15,19,77,0.85);
                line-height:25px;
                text-align: left;
                margin-top: 32px;
            }

            .module-model-list{
                margin-top: 32px;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
                align-items: center;
                width: 100%;

                .model-item{
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 16px;
                    font-size:14px;
                    font-weight:500;
                    background-color: @mainColorDEE1FF;
                    line-height:20px;
                    width:120px;
                    height:40px;
                    border-radius:4px;
                    color: @mainFontColor100;
                    cursor: pointer;
                    flex-shrink: 0;

                    &.isActives{
                        background-color: @mainColor6370FF;
                        color: #FFFFFF;
                    }

                    &.isDisabled{
                        background-color: @mainColorF1F1F5;
                        color: rgba(136,136,136,1);
                        cursor: default;
                    }
                }
            }
        }

        .field-config-container{
            display: flex;
            flex-direction: column;
            flex-grow: 1;
            overflow-y: auto;

            .field-config-form{
                flex-grow: 1;
                overflow-y: auto;

                .title{
                    &.has-desc{
                        margin-bottom: 24px;
                    }

                    font-size:18px;
                    font-weight:400;
                    color:rgba(51,51,51,1);
                    line-height:25px;
                    margin: 30px 0 30px 40px;
                    .review {
                        display: inline-block;
                        width:38px;
                        height:20px;
                        border-radius:2px;
                        border:1px solid rgba(99,112,255,1);
                        font-size:11px;
                        color:rgba(99,112,255,1);
                        line-height:19px;
                        cursor: pointer;
                        margin-left: 11px;
                        text-align: center;
                        &:hover{
                            color: #7A85FF;
                            border-color: #7A85FF;
                        }
                    }
                    .preview-img {
                        transform: scale(0.5);
                    }

                    .desc{
                        font-size: 12px;
                        color: @mainFontColor45;
                        margin-top: 10px;
                    }
                }
            }

            .action{
                flex-basis: 63px;
                border-top: 1px solid #e9e9e9;
                padding:10px 16px;
                background: #fff;
                text-align: right;
                display: flex;
                justify-content: center;
                align-items: center;

                button{
                    width: 134px;
                    margin-right: 36px;
                }

                button:last-child{
                    margin-right: 0;
                }
            }
        }

    }

</style>
