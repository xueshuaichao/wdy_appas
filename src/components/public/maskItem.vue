<template>
    <div class="editor-container">
        <a-row class="custom-form-item">
            <a-col :span="5" :offset="5">
                <a-checkbox style="margin-top:4px;float:left" :checked="!!attr.showMask" @change="checkboxChange('showMask',$event)">显示掩码</a-checkbox>
                <div style="margin-top:5px;float:left;">
                    <formHelp :offset-x="-12">{{ FIELD_HELP[`MASK_CODE_${type}`] }}</formHelp>
                </div>
            </a-col>
            <a-col :span="4">
                <a-input-number
                    v-show="attr.showMask"
                    v-model="attr.fromMask"
                    :formatter="limitDecimals"
                    :parser="limitDecimals"
                    class="from-item"
                    @blur="handleFromMaskBlur"
                    :min="1"
                    :class="{'custom-err-item': fromMaskAlert}"
                />
            </a-col>

            <a-col :span="1">
                <div v-show="attr.showMask" style="height: 32px;line-height:28px;margin-left:4px">
                    —
                </div>
            </a-col>
            <a-col :span="4">
                <a-input-number
                    v-show="attr.showMask"
                    v-model="attr.toMask" class="from-item"
                    :formatter="limitDecimals"
                    :parser="limitDecimals"
                    :class="{'custom-err-item': toMaskAlert}"
                    :min="1"
                    @blur="handleToMaskBlur"
                />
            </a-col>
            <a-col :span="1">
                <div v-show="attr.showMask" style="height: 32px;line-height:28px;margin-left:4px">
                    位
                </div>
            </a-col>
        </a-row>
        <a-row>
            <a-col :offset="5">
                <div v-show="fromMaskerrMsg || toMaskerrMsg" class="custom-err-msg" style="line-height: 22px;margin-top: 5px">
                    {{fromMaskerrMsg || toMaskerrMsg}}
                </div>
            </a-col>

        </a-row>

    </div>
</template>

<script>
    import formHelp from "@/components/public/formHelp";
    import TXT from "@/const/txt";
    import {limitDecimals} from "@/lib/utils";
    export default {
        name: "MaskItem",
        props: ['attr','type'],
        components: {
            formHelp
        },
        data: ()=>{
            return {
                FIELD_HELP: TXT.FIELD_HELP,
                fromMaskerrMsg: '',
                toMaskerrMsg: '',
                fromMaskAlert: false,
                toMaskAlert: false,
            }
        },
        methods: {
            limitDecimals,
            checkboxChange: function(type,$event){
                this.attr[type] = Number($event.target.checked)
                if (type === 'showMask') {
                    this.attr.fromMask = '';
                    this.attr.toMask = '';
                }
                if (type === 'showMask' && !$event.target.checked) {
                    this.handleFromMaskBlur();
                    this.handleToMaskBlur();
                }
            },
            async handleFromMaskBlur() {
                const { showMask, toMask, fromMask } = this.attr;
                if (showMask && !fromMask) {
                    this.fromMaskAlert = true;
                    this.fromMaskerrMsg = '掩码位数不能为空'
                    return false;
                }
                if (showMask && !/^[1-9]+[0-9]*$/.test(fromMask)) {
                    this.fromMaskAlert = true;
                    this.fromMaskerrMsg = '请输入正整数'
                    return false;
                }

                if (showMask && toMask && fromMask >= toMask) {
                    this.fromMaskAlert = true;
                    this.fromMaskerrMsg = '第一位数值必须小于第二位数值'
                    return false;
                }
                if (showMask && toMask && fromMask < toMask) {
                    this.toMaskAlert = false;
                    this.toMaskerrMsg = ''
                }
                this.fromMaskAlert = false;
                this.fromMaskerrMsg = ''
                return true;
            },
            async handleToMaskBlur() {
                const { showMask, toMask, fromMask } = this.attr;
                if (showMask && !toMask) {
                    this.toMaskAlert = true;
                    this.toMaskerrMsg = '掩码位数不能为空'
                    return false;
                }
                if (showMask && !/^[1-9]+[0-9]*$/.test(toMask)) {
                    this.toMaskAlert = true;
                    this.toMaskerrMsg = '请输入正整数'
                    return false;
                }
                if (showMask && fromMask && fromMask >= toMask) {
                    this.toMaskAlert = true;
                    this.toMaskerrMsg = '第二位数值必须大于第一位数值'
                    return false;
                }
                if (showMask && toMask && fromMask < toMask) {
                    this.fromMaskAlert = false;
                    this.fromMaskerrMsg = ''
                }
                this.toMaskAlert = false;
                this.toMaskerrMsg = ''
                return true;
            },
            validate: async function() {
                try{
                    const flag1 = await this.handleFromMaskBlur();
                    const flag2 = await this.handleToMaskBlur();
                    return flag1 && flag2;
                }catch(e){
                    this.$message.error(e || '校验失败');
                }

            }
        }
    }
</script>

<style lang="less" scoped>
    .editor-container{
        border-radius: 4px;
        margin-bottom: 12px;
        height: 44px;
        .custom-check-box-group {
            margin-bottom: 0;
        }
    }
</style>
