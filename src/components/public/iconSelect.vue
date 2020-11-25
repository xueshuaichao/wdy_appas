<template>
    <div 
        tabindex="0" 
        class="ant-select ant-select-enabled" 
        style="width:60%;margin-top:5px;"
        :class="isShow ? 'ant-select-open' : ''"
        @click="handleclick"
        @blur="handleBlur"
    >
        <div
            role="combobox" 
            aria-autocomplete="list" 
            aria-haspopup="true"
            class="ant-select-selection ant-select-selection--single"
        >
            <div class="ant-select-selection__rendered">
                <div unselectable="on" class="ant-select-selection__placeholder" style="display: none; user-select: none;">请选择图标</div>
                <img 
                    class="selectd_img"
                    :src="require(`@/assets/module_icon/icon${value}.png`)" 
                >
                
                <div title="" class="ant-select-selection-selected-value" style="display: block; opacity: 1;" />
            </div>
                
            <span unselectable="on" class="ant-select-arrow" style="user-select: none;">
                <i aria-label="图标: down" class="anticon anticon-down ant-select-arrow-icon">
                    <svg
                        viewBox="64 64 896 896" data-icon="down" width="1em"
                        height="1em" fill="currentColor" aria-hidden="true"
                        focusable="false" class=""
                    >
                        <path d="M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z" />
                    </svg>
                </i>
            </span>
        </div>
        <div class="icon-box" :class="{isActive: isShow}">
            <div
                v-for="item in iconList"
                :key="item"
                class="img-box"
            >
                <img 
                    class="select_img"
                    :src="require(`@/assets/module_icon/icon${item}.png`)"
                    @click="handleSelectIcon(item)"
                >
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        value: Number,
    },
    data: ()=>{
        return {
            iconList: [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
            isShow: false,
        }
    },
    methods: {
        handleSelectIcon(item) {
            this.$emit('input',item);
        },
        handleclick() {
            this.isShow=!this.isShow
        },
        handleBlur() {
            this.isShow = false;
        },
    }
}
</script>

<style lang='less'>
    .selectd_img {
        width: 20px;
        height: 20px;
        margin-top: 4px;
    }
    .icon-box {
        position: absolute;
        width: 100%;
        height: 0px;
        z-index: 999;
        transition: all 0.1s;
        overflow: hidden;
        align-items: center;
        padding: 0 8px;
        box-shadow: 3px 3px 3px #ccc;
        background: #fff;
        .img-box{
            width: 26px;
            height: 26px;
            display: flex;
            align-items: center;
            justify-content: center;
            float:left;
            margin-top: 8px;
            cursor: pointer;
            &:hover{
                background:#ECEEFF;
            }
            .select_img {
                width: 20px;
                height: 20px;
                text-align: center;
            }

        }
    }
    .isActive {
        height: 74px;
    }
     .icon-input {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-variant: tabular-nums;
        list-style: none;
        font-feature-settings: 'tnum';
        position: relative;
        display: inline-block;
        width: 100%;
        height: 32px;
        padding: 4px 11px;
        color: rgba(0, 0, 0, 0.65);
        font-size: 14px;
        line-height: 1.5;
        background-color: #fff;
        background-image: none;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        transition: all 0.3s;
    }
    .icon-input:focus {
        border-color: #8c9aff;
        border-right-width: 1px !important;
        outline: 0;
        box-shadow: 0 0 0 2px rgba(99, 112, 255, 0.2);
    }
</style>