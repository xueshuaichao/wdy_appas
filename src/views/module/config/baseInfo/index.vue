<template>
    <div class="filed-list">
        <div class="form-box">
            <a-form-model
                ref="form"
                class="custom-form"
                :label-col="{ span: 4 }"
                :wrapper-col="{ span: 20 }"
                :model="form"
                layout="horizontal"
            >
                <a-form-model-item
                    :rules="[{ required: true, message: '请输入模块名称', trigger: 'blur' }]"
                    label="模块名称" prop="title"
                >
                    <a-input
                        v-if="isUpdate"
                        v-model.trim="form.title"
                    />
                    <div v-else class="display-item-title">
                        {{ form.title }}
                    </div>
                </a-form-model-item>
                <a-form-model-item
                    :rules="apiNameRules"
                    label="API名称" prop="apiName"
                >
                    <a-input
                        v-if="isUpdate"
                        v-model="form.apiName"
                        :disabled="!!form.id"
                    />
                    <div v-else class="display-item">{{ form.apiName }}</div>
                </a-form-model-item>
                <a-form-model-item
                    :rules="[{ required: true, message: '请选择图标', trigger: 'blur' }]"
                    label="选择图标" prop="iconType"
                >
                    <div style="height:42px;">
                        <iconSelect v-if="isUpdate" v-model="form.iconType" />
                        <div v-else class="img-box display-item">
                            <img
                                class="select_img"
                                :src="require(`@/assets/module_icon/icon${form.iconType}.png`)"
                            >
                        </div>
                    </div>
                </a-form-model-item>
                <a-form-model-item label="模块描述" prop="description">
                    <a-input
                        v-show="isUpdate"
                        v-model="form.description"
                        class="custom-textarea"
                        type="textarea"
                    />
                    <a-input
                        v-show="!isUpdate"
                        ref="textarea"
                        v-model="form.description"
                        disabled
                        class="custom-textarea-display"
                        type="textarea"
                    />
                    <!-- <div v-else class="display-item-desc">
                        {{ form.description }}
                    </div> -->
                </a-form-model-item>
            </a-form-model>
            <div class="update-btn">
                <a-button
                    v-show="isUpdate"
                    style="width:80px;"
                    @click="onCancel"
                >
                    取消
                </a-button>
                <a-button
                    v-show="isUpdate"
                    type="primary"
                    style="width:80px;margin-left:36px;"
                    :loading="confirmLoading"
                    @click="onSubmit"
                >
                    保存
                </a-button>
                <a-button
                    v-show="!isUpdate"
                    type="primary"
                    style="width:80px;"
                    @click="isUpdate=true"
                >
                    修改
                </a-button>
            </div>
        </div>
    </div>
</template>

<script>
    import {updateModule, checkModuleApiName} from '@/api/module';
    import iconSelect from '@/components/public/iconSelect.vue'

    export default {
        name: "BaseInfo",
        components: {
            iconSelect,
        },
        props: ["tableConfig"],
        data: ()=>{
            return {
                isUpdate: false,
                form: {
                    title: '',
                    apiName: '',
                    iconType: 1,
                    description: '',
                    id: '',
                },
                initForm: {},
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
            }
        },
        computed: {
            baseInfo: function(){
                return this.$store.state.module.baseInfo
            }
        },
        watch: {
            baseInfo: function(baseInfo){
                this.form = {...baseInfo};
                this.initForm = {...baseInfo};
            },
        },
        created() {
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
            onCancel() {
                this.isUpdate=false;
                this.form = {...this.initForm};
                this.$refs.textarea.scrollTop = 0;
            },
            onSubmit: function(){
                this.$refs.form.validate(async(valid) => {
                    if (valid) {
                        this.confirmLoading = true;
                        try{
                            const result = await updateModule(this.form)
                            this.$store.commit('module/initBaseInfo',this.form);
                            this.initForm = {...this.form};
                            this.isUpdate=false;
                            this.$message.success('修改成功')
                            this.confirmLoading = false;
                        }catch (e) {
                            this.$message.error(e.msg || '添加数据失败');
                            this.confirmLoading = false;
                        }
                    }
                });
            },
        }
    }
</script>

<style lang="less" scoped>
    @import '../../../../less/variables.less';

    .filed-list{
        padding: 24px 48px 24px 24px;
        .form-box{
            float: left;
            width:550px;
            height: 350px;
            position: relative;
        }
        .custom-textarea-display{
            background: #fff;
            cursor: default;
            height: 128px;
            color: rgba(0, 0, 0, 0.65);
            overflow: hidden;
            border-color: transparent;
        }
        .img-box{
                height: 40px;
                display: flex;
                align-items: center;
        }
        .display-item{
            padding-left: 12px;
        }
        .display-item-title{
            padding-left: 12px;
            width: 100%;
            white-space: nowrap;
            text-overflow: ellipsis;  // 必须
            overflow:hidden;// 必须
        }
        .display-item-desc {
            padding-left: 12px;
            width: 100%;
            height: 200px;
            white-space: wrap;
            word-break: break-all;
            text-overflow: ellipsis;  // 必须
            overflow:hidden;// 必须
            -webkit-line-clamp: 2;
            // line-height: 20px;
        }
        .update-btn{
            float: left;
            margin-left: 24px;
            margin-top: 3px;
            justify-content: center;
            width: 100%;
            display: flex;
            position: absolute;
            bottom: 0;

        }
        .select_img {
                width: 20px;
                height: 20px;
                text-align: center;
            }
    }
</style>
