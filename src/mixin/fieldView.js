
export default {
    props: {
        fieldConfig: {
            type: Object,
            required: true
        },
        data: {
            type: null,
            required: true
        },
        viewType: {
            type: String
        },
        label: {
            type: Boolean,
            default: true
        }
    },
    computed: {
        labelText: function(){
            return this.fieldConfig.attr.title
        }
    }
}
