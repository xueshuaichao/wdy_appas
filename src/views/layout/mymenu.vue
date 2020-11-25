<template>
    <a-layout-sider width="216" style="background: #fff">
        <div class="con">
            <div class="table-list">
                <div v-for="item in menuList" :key="item.name">
                    <div class="menu-item" @click="handleMenuToggle(item)">
                        <img src="@/assets/menu/module_manage.png">
                        {{ item.i18n }}
                        <img class="arrow" :class="{isMenuActive: menuActive}" src="@/assets/menu/arrow_down.png">
                    </div>
                    <div :ref="item.name" class="menu-box01">
                        <div class="menu-box">
                            <div
                                v-for="child in item.children" :key="child.name"
                                class="menu-item-tab" :class="{isActive: child.name == activeTableId}"
                                @click="onTableSelect(child.name)"
                            >
                                <div v-show="child.name == activeTableId" class="active-border" />
                                {{ child.i18n }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </a-layout-sider>
</template>

<script>

    export default {
        name: "Mymenu",
        data: ()=>{
            return {
                list: [],
                labelCol: {span: 5},
                wrapperCol: {span: 14,offset: 2},
                rules: {
                    tableName: [
                        { required: true, message: '表名必须填写', trigger: 'blur' }
                    ]
                },
                addTableForm: {
                    tableName: ''
                },
                current: '2',
                activeTableId: 'customModule',
                home: false,
                menuActive: false,
            }
        },
        computed: {
            menuList(){
                return this.$store.state.menuList;
            },
        },
        methods: {
            onTableSelect: function(tableId){
                this.activeTableId = tableId;
                this.$router.push({
                    name: tableId,
                });

            },
        }
    }
</script>

<style lang="less" scoped>
    @import '../../less/variables';

    .con{
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        user-select:none;
        .table-list{
            flex-grow: 1;
            overflow: auto;
            .menu-item {
                display: flex;
                height: 46px;
                cursor: pointer;
                padding: 0 16px 0 24px;
                align-items: center;
                font-size: 18px;
                margin-top: 12px;
                img:first-child {
                    width: 24px;
                    height: 24px;
                    margin-right: 16px;
                }
                img:last-child {
                    width: 8px;
                    height: 8px;
                    margin-left: 56px;
                }
                .isMenuActive {
                    transform: rotate(180deg);
                }
            }
            .arrow {
                transition:all 0.2s cubic-bezier(.645,.045,.355,1);
            }
            .menu-box01 {
                overflow: hidden;
                transition:all 0.2s cubic-bezier(.645,.045,.355,1);
            }
            .menu-box {
                padding: 10px 0 10px 0px;
                .menu-item-tab{
                    display: flex;
                    height: 44px;
                    cursor: pointer;
                    padding: 0 19px 0 64px;
                    align-items: center;
                    font-size: 16px;
                    justify-content: space-between;
                    .active-border {
                        width:6px;
                        height:44px;
                        background: @mainColor6370FF;
                        border-radius:0px 10px 10px 0px;
                        position: absolute;
                        top: 0px;
                        left: 0px;
                    }
                    &.isActive{
                        background-color: @mainColorF1F1F5;
                        color: @mainColor6370FF;

                        position: relative;
                            &::after {
                            content: '';
                            display: block;
                            position: absolute;
                            bottom: -10px;
                            right: 0px;
                            width: 10px;
                            height: 10px;
                            background:radial-gradient(20px at left bottom,transparent 50%,@mainColorF1F1F5 50%);
                            // background: red;
                            }
                            &::before {
                            content: '';
                            display: block;
                            position: absolute;
                            top: -10px;
                            right: 0px;
                            width: 10px;
                            height: 10px;
                            background:radial-gradient(20px at left top,transparent 50%,@mainColorF1F1F5 50%);
                            }
                    }

                    // &:hover{
                    //     color: #1890ff;

                    //     .table-setting{
                    //         display: block;
                    //     }
                    // }

                    .table-setting{
                        display: none;
                    }
                }
            }
        }

        .add-app{
            margin: 10px 5px;
        }
    }
</style>
