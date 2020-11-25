<template>
    <a-popover :placement="placement" :align="align" :mouse-leave-delay="0">
        <i class="help-icon iconfont iconwenbenkuangxinxitishi" />
        <slot slot="content" />
    </a-popover>
</template>

<script>
    export default {
        name: "FormHelp",
        props: {
            placement: {
                default: 'bottomLeft'
            },
            offsetX: {
                type: Number,
                default: 0
            },
            offsetY: {
                type: Number,
                default: 0
            }
        },
        computed: {
            align: function(){
                return {
                    offset: [this.offsetX,this.offsetY]
                }
            }
        }
    }
</script>

<style lang="less" scoped>
    @import '../../less/variables';

    .help-icon{
        font-size: 16px;
        line-height: 16px;
        color: @mainColorC3C4D2;
        cursor: pointer;

        &:hover{
            color: @mainColor6370FF;
        }
    }
</style>
