<template>
    <div class="con">
        <div class="module-config-header">
            <img class="back" src="@/assets/page/back@2x.png" @click="handleBack">
            <span class="title">{{ baseInfo.title }}</span>
        </div>
        <div class="module-config-container">
            <div class="module-config-tab-list">
                <div
                    v-for="item in tabList" :key="item.key" class="module-config-tab"
                    :class="{active: item.key == activeTab}"
                    @click="SwitchTab(item.key)"
                >
                    <img v-if="item.key!=='baseInfo'" class="icon" :src="require(`@/assets/page/${item.icon}.png`)">
                    <span class="title">{{ item.name }}</span>
                </div>
            </div>
            <div class="module-config-tab-container">
                <field-config v-show="activeTab == 'field'" :module-id="baseInfo.id" />
                <base-info
                    v-show="activeTab == 'baseInfo'"
                    :table-config="tableConfig"
                    @changeTitle="moduleName=$event"
                />
                <rule-config
                    :active-tab="activeTab"
                    :module-id="baseInfo.id"
                />
            </div>
        </div>
    </div>
</template>

<script>
    import fieldConfig from './field/fieldConfig';
    import ruleConfig from './validate-rule/ruleConfig';
    import baseInfo from './baseInfo/index';
    import {getModuleInfo} from "@/api/module";

    export default {
        name: "Index",
        components: {
            fieldConfig,
            baseInfo,
            ruleConfig,
        },
        data: ()=>{
            return {
                moduleName: '',
                tabList: [
                    {
                        key: 'baseInfo',
                        name: '基础信息',
                        icon: 'module-config-field@2x'
                    },
                    {
                        key: 'field',
                        name: '字段',
                        icon: 'module-config-field@2x'
                    },
                    {
                        key: 'validate-rule',
                        name: '校验规则',
                        icon: 'validate-rule'
                    },

                ],
                activeTab: 'field',
                moduleId: '',
                tableConfig: {},
                visible1: true,
            }
        },
        computed: {
            baseInfo: function(){
                return this.$store.state.module.baseInfo
            }
        },
        async mounted() {
            this.moduleId = this.$route.params.id;
            try {
                await this.$store.dispatch('module/getBaseInfo',this.moduleId);
            } catch (e) {
                this.$message.error('获取模块名称异常');
            }
        },
        methods: {
            SwitchTab(val) {
                this.activeTab = val;
            },
            handleBack() {
                this.$router.replace({path: '/customModule'});
            },
        }
    }
</script>

<style lang="less" scoped>
    @import '../../../less/variables.less';

    .con{
        flex-grow: 1;
        padding: 40px 0 0 24px;
        display: flex;
        flex-direction: column;
        overflow: auto;

        .module-config-header{
            display: flex;

            .title{
                font-weight: 500;
                font-size: 18px;
                line-height: 25px;
                color: @mainFontColor85
            }

            .back{
                width: 24px;
                height: 24px;
                margin-right: 8px;
                cursor: pointer;
            }
        }

        .module-config-container{
            margin-top: 24px;
            flex-grow: 1;
            display: flex;
            flex-direction: column;

            .module-config-tab-list{
                display: flex;

                .module-config-tab{
                    width: 120px;
                    height: 40px;
                    border-radius: 8px 8px 0 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;

                    &.active{
                        background: @mainColorFFFFFF;

                        .title{
                            color: @mainFontColor85;
                        }
                    }

                    .icon{
                        width: 22px;
                        height: 22px;
                        margin-right: 5px;
                    }

                    .title{
                        font-size: 14px;
                        font-weight:500;
                        line-height:20px;
                        color: @mainFontColor45;
                    }
                }
            }

            .module-config-tab-container{
                flex-grow: 1;
                background: @mainColorFFFFFF;
                border-radius: 0 4px 4px 4px;
            }
        }
    }
</style>
