<template>
    <p v-if="label">
        <span class="label">{{ labelText }}:</span>
        <span>{{ data }}</span>
    </p>
    <p v-else>{{ data }}</p>
</template>

<script>
    import fieldView from "@/mixin/fieldView";

    export default {
        name: "DateTimeView",
        mixins: [fieldView]
    }
</script>

<style lang="less" scoped>
    .label{
        display: inline-block;
        margin-right: 20px;
    }
</style>
