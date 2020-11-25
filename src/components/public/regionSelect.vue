<template>
    <a-cascader
        :options="options"
        :placeholder="placeholder || '请选择'"
        :load-data="loadData"
        :value="value"
        @change="(val)=>change(val,true)"
    ></a-cascader>
</template>

<script>
    import _ from 'lodash';
    import {getRegion} from "@/api/business";

    export default {
        name: "regionSelect",
        props: ['regionType','placeholder','initialData'],
        data: function(){
            return {
                options: [],
                value: []
            }
        },
        watch: {
            regionType: function(){
                this.initOptions();
                this.change([],false);
            }
        },
        async mounted() {
            if(this.initialData){
                this.setValue(this.initialData);
            }else{
                this.initOptions();
            }
        },
        methods: {
            change: function(value,isManual){
                this.value = value;
                this.$emit('change',value[value.length-1] || '', isManual)
            },
            loadData: async function(selectedOptions){
                let targetOption = selectedOptions[selectedOptions.length - 1];
                targetOption.loading = true;

                try{
                    let res = await getRegion(targetOption.id);
                    let level = targetOption.level + 1;
                    targetOption.loading = false;
                    targetOption.children = this.generateOptions(res,level);
                    this.options = [...this.options];
                }catch (e) {
                    this.$message.error('获取地区数据失败');
                }
            },
            setValue: async function(initialValue){
                let value = []
                let fetchDataArray = [getRegion()];

                let list = typeof initialValue == 'string'? initialValue.split('-') : [];
                //容错处理  防止给的数据和regionType级数不匹配
                list = list.slice(0,this.regionType + 1);
                for(let i=1,len=list.length;i<len;i++){
                    value.push(list.slice(0,i+1).join('-'));

                    if(i < len - 1){
                        fetchDataArray.push(getRegion(list[i])); //获取市，区
                    }
                }

                let result = await Promise.all(fetchDataArray);
                let options = this.generateInitOptions(result,0,value)

                this.options = _.merge(this.options,options);
                this.change(value,false);
            },
            initOptions: async function(){
                try{
                    //初始化省
                    let res = await getRegion();
                    this.options = this.generateOptions(res,1);
                }catch (e) {
                    this.$message.error('获取地区数据失败');
                }
            },
            generateOptions: function(optionList,level){
                let isLeaf = level == this.regionType;
                optionList.forEach((item)=>{
                    item.level = level;
                    item.isLeaf = isLeaf;
                })
                return optionList;
            },
            generateInitOptions: function(result,index,initialValue){
                let level = index + 1;
                let data = result[index];
                data = this.generateOptions(data,level)

                for(let i=0,len=data.length;i<len;i++){
                    if(data[i].value == initialValue[index] && index < initialValue.length -1 ){
                        data[i].children = this.generateInitOptions(result,level,initialValue)
                        break;
                    }
                }
                return data;
            }
        }
    }
</script>

<style scoped>

</style>
