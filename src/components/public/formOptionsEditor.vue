<template>
    <div class="editor-container">
        <div class="header">
            <a-row type="flex" justify="space-between">
                <a-col :class="{'hide-template': !hasTemplate}">
                    <a-radio-group v-model="attr.optionsType" :disabled="isUpdate" @change="switchOptionsType">
                        <a-radio value="custom">添加选项</a-radio>
                        <a-radio value="template">添加通用选项</a-radio>
                    </a-radio-group>
                    <form-help placement="bottom">
                        <slot name="content">勾选后，可对设置好的通用选项直接进行导入</slot>
                    </form-help>
                </a-col>
                <a-col>
                    <a v-show="attr.optionsType == 'custom'" href="javascript:void(0);" @click="handleAddOption">添加选项</a>
                </a-col>
            </a-row>
        </div>
        <div class="content">
            <div ref="customOptions" v-show="attr.optionsType == 'custom'" class="custom-options">
                <div v-for="(item,index) in attr.optionList" :key="item.value" class="option">
                    <a-input v-model="item.label" class="options-text" :class="{update: isUpdate,'custom-err-item': item.hasError}" @focus="handleOptionFocus(item)"/>
                    <a-checkbox class="set-default" :checked="attr.defaultValue.value instanceof Array? attr.defaultValue.value.includes(item.value) : attr.defaultValue.value == item.value" @change="handleSetDefault(item.value,$event)">默认</a-checkbox>
                    <template v-if="isUpdate && !item.isNew">
                        <a-switch class="enable-switch" v-model="item.enable"/>
                        <span>{{ item.enable? '启用' : '禁用' }}</span>
                    </template>
                    <a v-if="item.isNew && index > 0" href="javascript:void(0);" @click="handleDelOption(item.value)">删除</a>
                </div>
            </div>
            <div v-show="attr.optionsType == 'template'" class="template-options">
                <a-select v-model="attr.templateId" class="template-select" :disabled="isUpdate" @change="handleTemplateChange">
                    <a-select-option
                        v-for="template in templateList"
                        :key="template.id"
                        :value="template.id"
                    >
                        {{ template.label }}
                    </a-select-option>
                </a-select>
                <div v-for="item in templateOptions" :key="item.value" class="option">
                    <a-input disabled :value="item.label" class="options-text"/>
                    <a-checkbox class="set-default" :checked="attr.defaultValue.value instanceof Array? attr.defaultValue.value.includes(item.value) : attr.defaultValue.value == item.value" @change="handleSetDefault(item.value,$event)">默认</a-checkbox>
                </div>
            </div>
        </div>
        <div v-show="errMsg" class="custom-err-msg" style="line-height: 22px;margin-top: 5px">{{errMsg}}</div>
    </div>
</template>

<script>
    import formHelp from "@/components/public/formHelp";
    import {getSelectTemplateList,getSeleteTemplateOptions} from '@/api/business';
    import {generateOptions} from "@/lib/field";

    export default {
        name: "DropdownFormOptionsEditor",
        props: ['attr','isUpdate','hasTemplate'],  //hasTemplate  是否包含通用选项
        components: {
            formHelp
        },
        data: ()=>{
            return {
                templateList: [],
                templateOptions: [],
                customOptionHasError: false,
                errMsg: ''
            }
        },
        async mounted() {
            if(this.hasTemplate){
                await this.initTemplateList();
                await this.initTemplateOptionList();
            }
        },
        methods: {
            handleAddOption: function(){
                let attr = this.attr;
                attr.optionList.push(generateOptions());

                this.$nextTick(()=>{
                    let ele = this.$refs.customOptions;
                    ele.scrollTop = ele.scrollHeight;
                })
            },
            handleDelOption: function(value){
                this.attr.optionList = this.attr.optionList.filter((item)=>{
                    return item.value != value
                });

                if(this.attr.defaultValue.value instanceof Array){
                    this.attr.defaultValue.value = this.attr.defaultValue.value.filter((_value)=> _value != value)
                }else{
                    if(this.attr.defaultValue.value == value){
                        this.attr.defaultValue.value = '';
                    }
                }
            },
            handleSetDefault: function(value,evt){
                let checked = evt.target.checked;
                if(this.attr.defaultValue.value instanceof Array){
                    if(checked){
                        this.attr.defaultValue.value.push(value);
                    }else{
                        this.attr.defaultValue.value = this.attr.defaultValue.value.filter((_value)=> _value != value)
                    }
                }else{
                    this.attr.defaultValue.value = checked? value : '';
                }
            },
            initTemplateList: async function(){
                try{
                    let res = await getSelectTemplateList();
                    this.templateList = res.map((item)=>{
                        return {
                            id: item.id,
                            label: item.label
                        }
                    });
                }catch (e) {
                    this.$message.error(e.msg || '获取通用选项失败');
                }
            },
            initTemplateOptionList: async function(){
                try{
                    let res = await getSeleteTemplateOptions(this.attr.templateId);
                    this.templateOptions = res;
                }catch (e) {
                    this.$message.error(e.msg || '获取通用选项失败');
                }
            },
            handleTemplateChange: function(){
                this.initTemplateOptionList();
            },
            handleOptionFocus: function(option){
                option.hasError = false;
            },
            switchOptionsType: function(){
                this.errMsg = '';
                this.attr.optionList.forEach((item)=>{
                    item.hasError = false;
                })
            },
            validate: function() {
                let {optionsType, optionList} = this.attr;

                if (optionsType == 'template') return true;

                let hasEmpty = false;
                let hasDuplicate = false;
                let obj = {};

                for (let option of optionList) {
                    let label = option.label;
                    if (label == '') {
                        option.hasError = true;
                        hasEmpty = true;
                    } else if (obj[label]) {
                        option.hasError = true;
                        obj[label].hasError = true;
                        hasDuplicate = true;
                    } else {
                        obj[label] = option;
                        option.hasError = false;
                    }
                }

                if (hasEmpty && hasDuplicate) {
                    this.errMsg = '选项值不允许为空和重复'
                } else if (hasEmpty) {
                    this.errMsg = '选项值不允许为空';
                } else if (hasDuplicate) {
                    this.errMsg = '选项值不允许重复';
                } else {
                    this.errMsg = ''
                }

                return this.errMsg == '';
            }
        }
    }
</script>

<style lang="less" scoped>
    @import '~@/less/variables.less';

    .editor-container{
        background: @mainColorECEEFF;
        border-radius: 4px;
        padding: 8px 16px 15px;

        .header{
            .hide-template{
                visibility: hidden;
            }
        }

        .content{
            margin-top: 8px;

            .custom-options{
                max-height: 140px;
                overflow-y: auto;
            }

            .template-options{
                max-height: 140px;
                overflow-y: auto;

                .template-select{
                    width: 224px;

                    &.update{
                        width: 202px
                    }
                }
            }



            .option{
                .options-text{
                    width: 224px;
                    margin-right: 8px;

                    &.update{
                        width: 202px
                    }
                }

                .set-default{
                    margin-right: 8px;
                }

                .enable-switch{
                    margin-right: 4px;
                }
            }
        }
    }
</style>
