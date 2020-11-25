<template>
    <div v-if="visible">
        <form-item-with-help
            ref="formItem"
            :label="attr.title" :validate="String(attr.apiName)" :rules="rules"
            :help-txt="attr.hint"
        >
            <wdc-editor
                v-model="form[attr.apiName]"
                :settings="settings"
                :placeholder="attr.defaultPrompt"
                @blur="$refs.formItem.$emit('blur')"
            />
        </form-item-with-help>
    </div>
</template>

<script>
    // 方法二，该方案只会打包单个组件
    import WdcEditor from "wdc-vue-components/src/components/editor";

    import fieldForm from "@/mixin/fieldForm";

    export default {
        name: "TextareaForm",
        components: {
            WdcEditor,
        },
        mixins: [fieldForm],
        data() {
            return {
                visible: false,
                //配置信息，可以在组件上传入settings，用来展示某个功能是否展示，如果去掉某个功能将其值设置为字符串的false，默认都展示
                settings:{
                    height:300,   //number类型，富文本的高度，默认300
                    width:'100%',   //number类型，富文本的高度，默认900
                    menubar: false, //布尔值， 顶部菜单栏显示，默认显示
                    media_alt_source: false, //布尔值，视频上传时，是否输入替代网址，默认不显示
                    image_title: true, //布尔值， 显示图片标题，默认显示
                    media_dimensions: true, //布尔值， 是否可以禁止输入视频宽高输入，默认可以输入
                    toolbar: `undo redo | fontsizeselect | bold italic underline forecolor backcolor|
                                alignleft aligncenter alignright alignjustify | outdent indent | removeformat fullscreen |
                                link unlink | searchreplace code | lineheightselect indent2em
                                    `,
                                    //需要再toolbar中展示的功能，默认展示上边这些功能。其中appendix表示上传附件。
                    isTransformSrc:false, // 表示从网上复制的图片是否需要转存，默认转存
                    paste_form_word:'prompt', // 粘贴文本时是否保持格式，clean为默认去掉格式，prompt为选择是否保留。
                    elementpath: false,
                    resize: false,
                    statusbar: false,
                }
            }
        },
        computed: {
            rules: function(){
                let {required,title} = this.attr;
                let rules = [this.customRules];
                if(required) {
                    rules.push({ required: true, message: `请输入${title}`, trigger: 'blur' })
                }
                return rules;
            }
        },
        created() {
            setTimeout(()=> {
                this.visible = true;    //否则富文本组件不能正常渲染，原因未知，后续排查
            },10);
        }
    }
</script>

<style scoped>

</style>
