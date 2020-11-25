<template>
    <div class="banner">
        <div class="img" />
        <div class="banner-right">
            <div class="title">被隔离的健康人如何调整自己的心理状态</div>
            <div class="banner-right-content">
                <div class="banner-right-content-row">
                    <div class="label">开课时间</div><div class="value">选修</div>
                </div>
                <div class="banner-right-content-row">
                    <div class="label">开课时间</div><div class="value">选修</div>
                </div>
                <div class="banner-right-content-row">
                    <div class="label">开课时间</div><div class="value">选修</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    

    export default {
        name: "BannerContent",
        components: {
        },
        data: ()=>{
            return {
            }
        },
        computed: {
        },
        created(){
        },
        methods: {}
    }
</script>

<style lang="less" scoped>
@import '../../../less/variables';
.banner{
    display: flex;
    .img{
        width: 630px;
        height: 354px;
        background: blue;
    }
    .banner-right {
        margin-left:60px;
        .title{
            font-size: 20px;
            font-weight: 500;
            color: @mainFontColor100;
        }
        .banner-right-content{
            margin-top:40px;
            line-height: 32px;
            .banner-right-content-row{
                display: flex;
                .label{
                    font-size: 16px;
                    color: @mainFontColor45;
                    
                }
                .value{
                    font-size: 16px;
                    margin-left: 10px;
                }
            }
            
        }
    }
}
    
    
</style>
