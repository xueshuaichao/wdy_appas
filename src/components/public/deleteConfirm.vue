<template>
    <a-modal
        class="confirm-modal"
        width="420px"
        title="确认删除么？"
        :visible="visible"
        @cancel="$emit('cancel')"
    >
        <p>{{content}}</p>
        <div slot="footer" class="footer">
            <a-button
                style="width:160px"
                @click="$emit('cancel')"
            >
                取消
            </a-button>
            <a-button
                type="primary"
                style="margin-left:20px;width:160px"
                :loading="loading"
                @click="$emit('handle-ok')"
            >
                确定
            </a-button>
        </div>
    </a-modal>
</template>

<script>
export default {
    props: ["visible","loading"],
    props: {
        visible: Boolean,
        loading: {
            type: Boolean,
            default: false
        },
        content: {
            type: String,
            default: '删除后，此模块将不可恢复'
        }
    }
}
</script>

<style>

</style>
