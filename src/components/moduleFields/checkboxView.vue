<template>
    <p v-if="label">
        <span class="label">{{ labelText }}:</span>
        <span>{{ formatData }}</span>
    </p>
    <p v-else>{{ formatData }}</p>
</template>

<script>
    import fieldView from "@/mixin/fieldView";

    export default {
        name: "CheckboxView",
        mixins: [fieldView],
        computed: {
            formatData: function(){
                return this.data instanceof Array? this.data.reduce((result,item)=> result + (result? ',' : '') + item.label,'') : ''
            }
        }
    }
</script>

<style lang="less" scoped>
    .label{
        display: inline-block;
        margin-right: 20px;
    }
</style>
