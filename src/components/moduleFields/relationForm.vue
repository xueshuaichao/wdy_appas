<template>
    <div>
        <form-item-with-help
            ref="formItem"
            :label="attr.title" :validate="String(attr.apiName)" :rules="rules"
            :help-txt="attr.hint"
        >
            <select-input :content="relationPrimaryName" :placeholder="attr.defaultPrompt" @click.native="showRelationData" />
        </form-item-with-help>

        <a-modal
            title="数据选择"
            :z-index="1001"
            :width="1050"
            :visible="relationDataModalShow"
            ok-text="选择"
            cancel-text="取消"
            :destroy-on-close="true"
            @ok="handleSelect"
            @cancel="close"
        >
            <module-data-list
                ref="moduleDataList"
                :module-id="attr.relationModuleId"
                :module-field-list="moduleFieldList"
                :get-data="getModuleData"
                :show-del="false"
                select-type="radio"
                :initial-selected-row-keys="this.initialData? [this.initialData.id] : []"
            />
        </a-modal>
    </div>
</template>

<script>
    import fieldForm from "@/mixin/fieldForm";
    import moduleDataList from "@/components/public/moduleDataList";
    import selectInput from "@/components/public/selectInput";
    import {getModuleConfig} from "@/api/module";
    import {fieldDataServer2FE} from "@/lib/field";
    import {getDataList} from "@/api/business";

    export default {
        name: "RelationForm",
        components: {
            moduleDataList,
            selectInput
        },
        mixins: [fieldForm],
        data: function(){
            return {
                relationDataModalShow: false,
                relationPrimaryName: this.initialData? this.initialData.value : '',
                moduleFieldList: []
            }
        },
        computed: {
            rules: function(){
                let {title,required} = this.attr;
                let rules = [this.customRules];

                if(required) {
                    rules.push({ required: true, message: `请输入${title}`, trigger: 'blur' })
                }

                return rules;
            }
        },
        async mounted() {
            this.primaryApiName = '';
            try{
                await this.getModuleFieldList();
            }catch (e) {
                this.$message.error('获取模块字段数据失败')
            }
        },
        methods: {
            getModuleFieldList: async function(){
                let moduleId =  this.attr.relationModuleId;
                let showFields = this.attr.showFields;

                let {fieldList} = await getModuleConfig(moduleId);
                let moduleFieldList = [];

                for(let item of fieldList){
                    let data = fieldDataServer2FE(item);
                    if(showFields.includes(data.attr.apiName)){
                        moduleFieldList.push(data);
                        if(data.isPrimaryAttr) this.primaryApiName = data.attr.apiName
                    }
                }

                this.moduleFieldList = moduleFieldList;
            },
            getModuleData: async function(page,pageSize){
                let moduleId =  this.attr.relationModuleId;
                let showFields = this.attr.showFields;
                let res = await getDataList(moduleId,{
                    showFields,
                    page,
                    pageSize
                });
                return res;
            },
            showRelationData: function(){
                this.relationDataModalShow = true;
            },
            handleSelect: function(){
                let selectedData = this.$refs.moduleDataList.getSelectedData()[0];
                this.relationPrimaryName = selectedData? selectedData[this.primaryApiName] : '';
                this.form[this.attr.apiName] = selectedData? selectedData.id : '';
                this.close();
            },
            close: function(){
                this.relationDataModalShow = false;
            }
        }
    }
</script>

<style scoped>

</style>
