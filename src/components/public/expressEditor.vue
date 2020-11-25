<template>
    <div class="express-editor">
        <p class="first-line">
            <span v-if="expressPurpose == 'validate'" class="first-line-info">示例：创建课程时，如果课程开始时间<当前时间，显示错误信息。</span>
            <span v-else class="first-line-express-type">
                <span>是否为计算公式: </span>
                <a-radio-group v-model="expressType" @change="handleChange">
                    <a-radio :value="2">是</a-radio>
                    <a-radio :value="1">否</a-radio>
                </a-radio-group>
            </span>
            <span v-show="expressType == 2" class="first-line-check" @click="checkExpress(true)">
                <img src="@/assets/page/validate.png">
                语法检查
            </span>
        </p>
        <div v-show="expressType == 1" class="default-value-container">
            <slot name="staticValue">
                <a-textarea
                    v-if="fieldType === 'TEXTAREA'"
                    class="custom-textarea"
                    v-model="staticValue" @change="handleChange"/>
                <a-input v-else v-model="staticValue" @change="handleChange"/>
            </slot>
            <div class="static-err custom-err-msg" v-show="staticVaLueErr">{{staticVaLueErr}}</div>
        </div>
        <div v-show="expressType == '2'" class="express-container">

            <div style="position:relative;">
                <div
                    v-show="messageVisible"
                    :class="messageInfo.type==='success'? 'result-info result-success': 'result-info result-error'"

                >
                    <img v-if="messageInfo.type === 'success'" src="@/assets/page/success-icon.png"/>
                    <img v-if="messageInfo.type === 'error'" src="@/assets/page/error-icon.png"/>
                    {{messageInfo.info}}
                </div>
                <a-textarea
                    ref="insertBox" v-model="expressValue" class="custom-textarea"
                    :spellcheck="false" :disabled="disableFnAndOperator"
                    @change="handleChange"
                />
            </div>

            <div class="button-box">

                <div tabindex="0" @click="insert1=!insert1">
                    <div class="insertField">
                        插入字段
                        <img v-show="insert1" src="@/assets/page/up.png">
                        <img v-show="!insert1" src="@/assets/page/down.png">
                    </div>

                    <div v-show="insert1" class="insert-field-box">
                        <div @click.stop>
                            <a-input v-model="searchVal" style="width:280px;" placeholder="请输入字段名称">
                                <a-tooltip slot="prefix">
                                    <img src="@/assets/page/search.png">
                                </a-tooltip>
                            </a-input>
                        </div>
                        <ul style="width:100%;">
                            <template v-if="operator1.length>0">
                                <li v-for="item in operator1" :key="item.id" @click="handleUlclick(`${item.refName}`)">
                                    {{ item.title }}
                                </li>
                            </template>
                            <template v-else>
                                <li style="text-align:center;">暂无数据</li>
                            </template>
                        </ul>
                    </div>
                </div>
                <div tabindex="0" @click="insert3=!insert3" @blur="insert3=false" :class="{hide:disableFnAndOperator}">
                    插入函数
                    <img v-show="insert3" src="@/assets/page/up.png">
                    <img v-show="!insert3" src="@/assets/page/down.png">
                    <div v-show="insert3" style="position:relative;">
                        <ul>
                            <li v-for="item in operator3" :key="item.groupId" @click.stop="handleUlchange(item)">
                                {{item.groupName}}
                            </li>
                        </ul>
                        <ul
                            style="position:absolute;top:0px;left:117px;"
                            v-if="secondOperator3.length>0"
                        >
                            <template v-for="item in secondOperator3">
                                <a-popover :getPopupContainer="getPopupContainer" :key="item.index" placement="rightTop" :mouse-leave-delay="0">
                                    <li @click="handleUlclick(item.content)">
                                        {{ item.name }}
                                    </li>
                                    <div slot="content" v-html="format(item.description)" style="width:90px;word-wrap:break-word;word-break:break-all;">
                                        <!-- {{item.description}} -->
                                    </div>
                                </a-popover>
                            </template>
                        </ul>
                    </div>
                </div>

                <div tabindex="0" @click="insert2=!insert2" @blur="insert2=false" :class="{hide:disableFnAndOperator}">
                    插入运算符
                    <img v-show="insert2" src="@/assets/page/up.png">
                    <img v-show="!insert2" src="@/assets/page/down.png">
                    <ul v-show="insert2">
                        <li v-for="item in operator2" :key="item.index" @click="handleUlclick(item.content)">
                            {{ item.name }}
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {getExpressFnList, getExpressOperationList} from "@/api/module";
import {expressVerify} from "@/api/business";

export default {
    name: "ExpressEditor",
    props: {
        expressPurpose: {
            validator: function (value) {
                return ['defaultValue', 'validate'].indexOf(value) !== -1
            },
            required: true
        },
        initialExpressType: {
            validator: function (value) {
                return [1, 2].indexOf(value) !== -1 //1静态 2表达式
            },
            required: true
        },
        initialValue: {
            type: undefined,
            required: true
        },
        moduleId: {
            type: undefined,
            required: true
        },
        disableFnAndOperator: {     //禁用函数和运算符，字段类型为电话，邮箱等时使用，此时表达式编辑区仅能选择字段。且不可编辑
            type: Boolean,
            default: false
        },
        customStaticValue: undefined, //当自己使用插槽staticValue时使用
        //下面的字段都是当expressPurpose为defaultValue时传递，fieldId插入字段过滤，其余fieldType，attr用于表达式校验
        fieldId: undefined,
        fieldType: String,
        attr: Object
    },
    data() {
        return {
            expressType: this.initialExpressType,
            staticValue: this.initialExpressType == 1? this.initialValue: '',
            expressValue: this.initialExpressType == 2? this.initialValue: '',
            insert1: false,
            insert2: false,
            insert3: false,
            operator2: [],
            operator3: [],
            secondOperator3: [],
            searchVal: '',
            staticVaLueErr: '',
            messageInfo: {
                type: '',
                info: ''
            },
            messageVisible: false,
            setId: '',
        }
    },
    computed: {
        operator1: function(){
            let filterList =  this.$store.state.module.fieldList.filter((item)=>{
                const blackFieldTypeList = ['DROPDOWN_RADIO','DROPDOWN_CHECKBOX','RADIO','CHECK_BOX','FILE','IMAGES','EDITOR','VIDEO'];

                if(this.expressPurpose == 'validate'){
                    return item.fieldSource == 1 && !blackFieldTypeList.includes(item.fieldType) && item.attr.title.includes(this.searchVal)
                }else{
                    //必须是自定义字段，不能是自己本身(编辑态时，通过fieldId区分)，且不是选项或者上传类型的，如果是电话这类禁用函数和运算符的字段，只能选择自己本身的字段类型
                    return item.fieldSource == 1 && (this.fieldId? item.id != this.fieldId : true) && !blackFieldTypeList.includes(item.fieldType)
                        && item.attr.title.includes(this.searchVal) && (this.disableFnAndOperator? item.fieldType == this.fieldType : true)
                }
            });

            let moduleApiName = this.$store.state.module.baseInfo.apiName;
            return filterList.map((item)=>{
                return {
                    id: item.id,
                    title: item.attr.title,
                    refName: `${moduleApiName}.${item.attr.apiName}`
                }
            })
        }
    },
    watch: {
        insert3: function(){
            this.secondOperator3 = [];
        }
    },
    async mounted() {
        this.popoverContainer = document.getElementById('field-config-form');
        this.expressValue = this.expressType == 2? this.initialValue: '';
        try {
            let res = await getExpressFnList();
            this.operator3 = res;
        } catch (e) {
            this.$message.error('获取表达式预制函数列表异常');
        }
        try {
            let res = await getExpressOperationList();
            this.operator2 = res;
        } catch (e) {
            this.$message.error('获取表达式预制运算符列表异常');
        }
        document.addEventListener('click',this.documentFunction);
    },
    beforeDestroy() {
        document.removeEventListener('click',this.documentFunction);
    },
    methods: {
        getPopupContainer: function(){
            return  this.popoverContainer
        },
        documentFunction(e) {
            if (e.target.className === 'insertField') {
                return;
            }
            this.insert1 = false;
        },
        handleUlclick(content) {
            if(this.disableFnAndOperator){
                this.expressValue = content
            }else{
                let textInput = this.$refs.insertBox.$el;
                let insert = textInput.selectionStart;
                this.expressValue = textInput.value.substr(0, insert) + content + textInput.value.substr(insert);
                const selectEnd = insert + content.length;
                setTimeout(()=>{
                    textInput.focus();
                    textInput.setSelectionRange(selectEnd,selectEnd);
                },1)
            }
            this.handleChange();
        },
        handleUlchange(item) {
            this.secondOperator3 = item.functions;
        },
        async checkExpress(flag) {  //flag 校验通过时是否显示提示
            if(this.expressType == 1){
                return true;
            }

            if(!this.expressValue){
                if (this.expressPurpose == 'validate') {
                    this.showMessage('error','请输入校验条件');
                } else {
                    this.showMessage('error','请输入计算公式');
                }

                return false;
            }

            try{
                // 接口code==0时校验通过，不为0时校验失败
                await expressVerify(this.expressValue,this.moduleId,this.fieldType,this.attr);

                if(flag) this.showMessage('success','表达式校验正确');
                return true;
            }catch (e) {
                this.showMessage('error',e.msg || '校验异常');
                return false;
            }
        },
        showMessage(type,msg) {
            this.messageInfo = {
                type,
                info: msg
            };

            clearTimeout(this.setId);
            this.messageVisible = true;
            this.setId = setTimeout(()=>{
                this.messageVisible = false;
            },2000);
        },
        handleChange(){
            this.$emit('change',{
                type: this.expressType,
                value: this.expressType == 1? this.customStaticValue? this.customStaticValue : this.staticValue : this.expressValue
            })
        },
        setStaticValueErr(err){
            this.staticVaLueErr = err;
        },
        reset(expressType){
            this.messageVisible = false;
            this.staticVaLueErr = '';
            this.expressType = expressType ? expressType : 1;
            this.staticValue = '';
            this.expressValue = '';
        },
        format(value) {
            const newvalue = value.replace(/\n/g,"<br/>")
            return newvalue;
        }
    }
}
</script>

<style scoped lang="less">
@import '../../less/variables';

.hide{
    display: none;
}

.express-editor {
    width: 100%;
    background: @mainColorECEEFF;
    border-radius: 4px;
    padding: 14px;

    .first-line {
        line-height: 24px;
        margin-bottom: 5px;

        .first-line-info {
            color: @mainFontColor45;
            font-size: 12px;
        }

        .first-line-express-type {
            color: rgba(51, 54, 103, 0.85);
            font-size: 14px;
        }

        .first-line-check {
            cursor: pointer;
            float: right;
            color: @mainColor6370FF;
            font-weight: 600;

            img {
                width: 18px;
                vertical-align: middle;
                margin-top: -5px;
            }
        }
    }

    .express-container {
        position: relative;
        .result-info{
            position:absolute;
            z-index: 999;
            height: 42px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: space-around;
            padding: 0 16px;
            left: 50%;
            top: 50%;
            transform: translate(-50%,-50%);
            transition: all .5s;
            font-size: 14px;
            color: @mainFontColor100;
            white-space: nowrap;
            // max-width: 370px;
            // overflow: hidden;
            // text-overflow: ellipsis;
            // display: -webkit-box;
            // -webkit-line-clamp: 2;
            // -webkit-box-orient: vertical;
            // padding-left: 38px;
            img {
                width: 18px;
                margin-right: 4px;
                // position: absolute;
                // top: 11px;
                // left: 13px;
            }
        }
        .result-success{
            border: 1px solid #52C41B;
            box-shadow: 0px 2px 8px 0px rgba(246, 255, 237, 0.6);
            background: #F6FFED;
        }
        .result-error{
            border: 1px solid #FFCCC8;
            background: #FFF2F0;
            box-shadow: 0px 2px 8px 0px rgba(253, 235, 173, 0.3);
        }
        .custom-textarea {
            height: 137px;
        }

        .button-box {
            user-select: none;
            display: flex;

            & > div {
                border: 1px solid @mainColor6370FF;
                color: #6370FF;
                width: 116px;
                height: 37px;
                line-height: 37px;
                border-radius: 4px;
                margin-right: 14px;
                text-align: center;
                margin-top: 12px;
                cursor: pointer;
                .insertField {
                    width: 116px;
                    height: 37px;
                }
                .insert-field-box {
                    width:310px;
                    background:#fff;
                    position:relative;
                    z-index:999;
                    box-shadow: 0px -1px 8px 0px rgba(15, 19, 77, 0.2);
                    border-radius: 4px;
                    &>div {
                        padding: 10px 16px 2px;
                    }
                    &>ul {
                        box-shadow: none;
                        position: relative;
                    }
                }
                img {
                    width: 13px;
                    vertical-align: middle;
                    margin-top: -3px;
                }

                ul {
                    list-style: none;
                    text-align: left;
                    position: absolute;
                    background: #fff;
                    box-shadow: 0px -1px 8px 0px rgba(15, 19, 77, 0.2);
                    border-radius: 4px;
                    width: 116px;
                    max-height: 176px;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    z-index: 999;
                    overflow-y: auto;

                    li {
                        font-size: 14px;
                        color: @mainFontColor45;
                        padding-left: 16px;
                        position: relative;
                        height: 40px;
                        line-height: 40px;

                        &:hover {
                            background: @mainColorECEEFF;
                            color: #0F134D;
                            font-weight: 400;
                        }

                        div {
                            box-shadow: 0px -1px 8px 0px rgba(15, 19, 77, 0.2);
                            position: absolute;
                            width: 200px;
                            top: 0;
                            right: 125px;
                            background: #fff;
                            line-height: 24px;
                            font-size: 14px;
                            padding: 10px;
                        }
                    }
                }
            }
        }
    }
}
</style>
