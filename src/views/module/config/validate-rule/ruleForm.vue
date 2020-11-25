<template>
    <a-drawer
        :title="isUpdate? '编辑校验规则' : '新建校验规则' "
        :visible="visible"
        :drawer-style="drawerStyle"
        :header-style="headerStyle"
        :body-style="bodyStyle"
        :width="595"
        :destroy-on-close="true"
        @close="close()"
    >
        <div class="form-container">
            <div class="field-config-container">
                <div id="field-config-form" class="field-config-form" style="position: relative">
                    <ruleSheet
                        ref="config"
                        :attr="fieldConfig"
                        :module-id="moduleId"
                        :is-update="isUpdate"
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
import ruleSheet from './ruleSheet';
import _ from 'lodash';
import { addExpr } from '@/api/module'
import {validateDataFE2Server, initValidateField} from '@/lib/field';
import moduleFieldMap from '@/lib/moduleFieldMap';

    export default {
        name: "FieldForm",
        components: {
            ruleSheet,
        },
        props: ["moduleId","visible","initialFieldConfig"],
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
                fieldConfig: {
                    name: '',
                    type: 'TEXT',
                    attr: {}
                },
                screenWidth: window.screen.width,
            }
        },
        computed: {
            isUpdate: function(){
                return typeof this.fieldConfig.id != 'undefined';
            },
        },
        watch: {
            initialFieldConfig: function(val){
                this.fieldConfig = _.cloneDeep(val);
            },
        },
        methods: {
            onSave: function(continueFlag) {
                let form = this.$refs.config.$refs.form;
                this.buttonDisabled = true;
                form.validate(async(valid) => {
                    let customValidate = await this.$refs.config.customValidate();
                    if (valid && customValidate) {
                        let data = validateDataFE2Server(this.moduleId, this.fieldConfig);
                        try {
                            await addExpr(data);
                        } catch (res) {
                            this.$message.error(res.msg || '保存失败');
                            return;
                        } finally {
                            this.buttonDisabled = false;
                        }

                        if(continueFlag){
                            form.resetFields();
                            this.$refs.config.customReset(2);
                            this.fieldConfig = await initValidateField('VALIDATE');
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
                padding-top: 32px;
                .title{
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
