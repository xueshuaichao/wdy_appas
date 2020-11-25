<template>
    <a-layout style="padding: 24px 24px 0">
        <a-layout-content class="con">
            <div class="main-module">
                <p class="subject">{{ moduleName }}</p>
                <div class="props">
                    <template v-for="(list,index) in moduleFieldListTransform">
                        <a-row :key="index" class="row">
                            <a-col v-for="fieldConfig in list" :key="fieldConfig.id" :span="8">
                                <component
                                    :is="fieldConfig.fieldType.toLowerCase() + 'View'"
                                    :field-config="fieldConfig"
                                    :data="moduleData[fieldConfig.attr.apiName]"
                                />
                            </a-col>
                        </a-row>
                    </template>
                </div>
            </div>
            <a-divider />
            <div class="relation-module-con">
                <p class="subject">关联模块</p>
                <div v-for="module in relationModuleList" :key="module.id" class="relation-module">
                    <p class="relation-module-name"> {{ module.name }}</p>
                    <module-data-list
                        ref="moduleDataList"
                        :module-id="module.id"
                        :module-field-list="module.fieldList"
                        :get-data="module.getData"
                        :show-del="false"
                    />
                </div>
            </div>
        </a-layout-content>
    </a-layout>
</template>

<script>
    import _ from 'lodash';
    import { getModuleConfig, getBusinessData ,getRelationModuleList as getRelationModuleListApi} from '@/api/module';
    import { getRelationDataList } from '@/api/business';
    import {fieldDataServer2FE} from '@/lib/field';
    import {showMask} from '@/lib/utils';
    import moduleDataList from "@/components/public/moduleDataList";

    export default {
        name: "Mycontent",
        components: {
            moduleDataList,
        },
        data: ()=>{
            return {
                loading: false,
                moduleName: '',
                moduleFieldList : [],
                moduleData: {},
                relationModuleList: [],
                initialForm: {},
                moduleDataModalVisible: false
            }
        },
        computed: {
            moduleFieldListTransform: function(){
                //每三个分成一组
                let result = [];
                let filter = this.moduleFieldList.filter((fieldConfig)=>{
                    return true;
                })

                filter.forEach((item,index)=>{
                    let i = parseInt(index/3);
                    if(!_.isArray(result[i])) result[i] = [];
                    result[i].push(item)
                })
                return result;
            }
        },
        created(){
            const {moduleId,id} = this.$route.query;
            this.moduleId = moduleId;
            this.id = id;
            this.initData();
        },
        methods: {
            showMask,
            initData: async function() {

                try{
                    let [{title,moduleFieldList},moduleData] = await Promise.all([this.getModuleFieldList(),this.getModuleData()]);

                    this.moduleName = title;
                    this.moduleFieldList = moduleFieldList;
                    this.moduleData = moduleData;

                    let relationModuleList = await this.getRelationModuleList()
                    this.relationModuleList = relationModuleList;
                }catch (e) {
                    console.log(e)
                    this.$message.error('获取数据失败')
                }finally {
                    this.loading = false;
                }
            },
            getModuleFieldList: async function(){
                let {title,fieldList} = await getModuleConfig(this.moduleId);
                let moduleFieldList = [];

                for(let item of fieldList){
                    moduleFieldList.push(fieldDataServer2FE(item));
                }

                return {
                    title,
                    moduleFieldList
                }
            },
            getModuleData: async function(){
                let moduleData = await getBusinessData(this.moduleId, this.id);

                return moduleData;
            },
            getRelationModuleList: async function(){
                let relationModuleList = await getRelationModuleListApi(this.moduleId);
                let self = this;
                relationModuleList = relationModuleList.map(function(item){
                    return {
                        id: item.relationId,
                        name: item.relationName,
                        fieldList: item.module.fieldList.map((field)=>{
                            return fieldDataServer2FE(field)
                        }),
                        getData: async function(page,pageSize){

                            let res = await getRelationDataList(item.relationId,self.id,{
                                page,
                                pageSize
                            })

                            return res;
                        }
                    }
                })

                return relationModuleList;
            },
            editData() {

            }
        }
    }
</script>

<style lang="less" scoped>
@import '../../../less/variables';
    .subject{
        font-size: 18px;
        weight: 500;
        margin-bottom: 24px;
        color: @mainFontColor85;
    }

    .relation-module-name{
        font-size: 16px;
        weight: 500;
        margin-bottom: 24px;
        color: @mainFontColor85;
    }

    .con{
        background: @mainWhiteBackgroundColor;
        padding: 24px;
        margin: 0;
        min-height: 280px;
        flex-shrink: 0;

        .main-module{
            .props{
                .row{
                    margin-bottom: 20px;
                }
            }
        }

        .table-header{
            padding: 0 10px;
            margin-bottom: 10px;
        }

        .file-item{
            display: inline-block;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 100%;
        }
    }
</style>
