import {getModuleFieldList, getModuleInfo, getFieldTypeList} from "@/api/module";
import {fieldDataServer2FE} from "@/lib/field";

export default {
    namespaced: true,
    state: {
        fieldAuthority: {
            useInRefer: [],//是否可用作排序条件
            useInQuery: [],//是否可用作筛选条件
            useInTable: [],//是否可用在表格上
            useInTitle: []//是否可用作主属性
        },
        baseInfo: {},
        fieldList: [],
    },
    mutations: {
        initBaseInfo: function(state, baseInfo){
            state.baseInfo = baseInfo;
        },
        initFieldList: function(state, fieldList){
            state.fieldList = fieldList;
        },
        initFieldAuthority: function(state, fieldAuthority){
            state.fieldAuthority = fieldAuthority;
        }
    },
    getters: {
        useInRefer: state => state.fieldAuthority.useInRefer,
        useInQuery: state => state.fieldAuthority.useInQuery,
        useInTable: state => state.fieldAuthority.useInTable,
        useInTitle: state => state.fieldAuthority.useInTitle
    },
    actions: {
        async getBaseInfo ({ commit }, moduleId) {
            try{
                let baseInfo = await getModuleInfo(moduleId);
                const {title, apiName, iconType, description, id} = baseInfo;
                commit('initBaseInfo', {
                    id,
                    title,
                    apiName,
                    iconType,
                    description
                })
            }catch (e) {
                return Promise.reject(e);
            }
        },
        async getFieldList ({ commit }, moduleId) {
            try{
                let fieldList = await getModuleFieldList(moduleId);
                fieldList = fieldList.map((item)=>{
                    return fieldDataServer2FE(item);
                })
                commit('initFieldList', fieldList)
            }catch (e) {
                return Promise.reject(e);
            }
        },
        async getMainFieldTypeList ({ commit }) {
            try{
                let result = await getFieldTypeList();
                const useInRefer = [];
                const useInQuery = [];
                const useInTable = [];
                const useInTitle = [];
                result.forEach((item)=> {
                    if (item.useInRefer){
                        useInRefer.push(item);
                    }
                    if (item.useInQuery){
                        useInQuery.push(item);
                    }
                    if (item.useInTable){
                        useInTable.push(item);
                    }
                    if (item.useInTitle){
                        useInTitle.push(item);
                    }

                });
                commit('initFieldAuthority', {
                    useInRefer,//是否可用作排序条件
                    useInQuery,//是否可用作筛选条件
                    useInTable,//是否可用在表格上
                    useInTitle,//是否可用作主属性
                })
            }catch (e) {
                return Promise.reject(e);
            }
        },
    }
}
