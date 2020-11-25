<template>
    <div class="show-fields">
        <span v-if="content">{{content}}</span>
        <span v-else class="placeholder">{{placeholder}}</span>
        <img src="@/assets/components/plus-circle@2x.png">
    </div>
</template>

<script>
    export default {
        name: "selectInput",
        props: ['content','placeholder']
    }
</script>

<style lang="less" scoped>
    .show-fields{
        display: flex;
        width: 100%;
        height: 32px;
        margin: 4px 0px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        line-height: 1.5;
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #d9d9d9;
        cursor: pointer;
        transition: all 0.3s;
        align-items: center;


        &:hover{
             border-color: #8c9aff;
         }

        img{
            width: 18px;
            height: 18px;
            margin-right: 8px;
        }

        span{
            flex-grow: 1;
            padding: 4px 16px 4px 11px;
            display: inline-block;
            text-overflow:ellipsis;
            white-space: nowrap;
            overflow: hidden;
        }

        .placeholder{
            color: #9395af;
        }
    }
</style>
