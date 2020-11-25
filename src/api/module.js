
import request from '../lib/request';

/*
    获取模块列表
    title
    pageSize,
    pageNum
 */
export function getModuleList(title='',pageSize=20,pageNum=1){
    return request.get(`module/getModuleList`, {
        params: {
            title,
            pageSize,
            pageNum
        }
    });
}

/*
    获取全部模块列表，只返回id及title数据
 */
export function getSimpleModuleList() {
    return request.get(`module/findAllModuleName`)
}

/*
    新建模块
 */
export function addModule(params){
    return request.post('module/add', params);
}

/*
    更新模块
 */
export function updateModule(params){
    return request.post('module/updateById', params);
}


/*
    删除模块
 */
export function delModule(id){
    return request.post('module/deleteById',{
        id
    })
}

/*
    获取模块基本信息
 */
export function getModuleInfo(id){
    return request.get('module/getModuleBasic',{
        params: {
            id
        }
    })
}

/*
    获取模块配置信息
 */
export function getModuleConfig(id){
    return request.get('module/getModuleData',{
        params: {
            id
        }
    })
}

export function getModuleFieldList(moduleId){
    return request.get('field/findByParentId',{
        params: {
            parentId: moduleId
        }
    })
}

/*
    检查field apiName是否可用
 */
export function checkFieldApiName(moduleId,apiName){
    return request.get('field/apiNameIsUse',{
        params: {
            parentId: moduleId,
            apiName
        }
    })
}

/*
    检查module apiName是否可用
 */
export function checkModuleApiName(apiName){
    return request.get('module/getApiNameIsExist',{
        params: {
            apiName
        }
    })
}

/*
    新建或更新字段
 */
export function addOrUpdateField(params){
    return request.post('field/addOrUpdate',params);
}


let _cacheExpressFnList;
/*
    获取表达式预制函数列表
 */
export function getExpressFnList(){
    if(_cacheExpressFnList){
        return Promise.resolve(_cacheExpressFnList);
    }else{
        return new Promise((resolve, reject) => {
            request.get('business/function/functionList').then(res=>{
                _cacheExpressFnList = res;
                resolve(_cacheExpressFnList);
            }).catch(()=>{
                reject()
            })
        })
    }
}

let _cacheExpressOperationList
/*
    获取表达式预制运算符列表
 */
export function getExpressOperationList(){
    if(_cacheExpressOperationList){
        return Promise.resolve(_cacheExpressOperationList);
    }else{
        return new Promise((resolve, reject) => {
            request.get('business/operation/operationList').then(res=>{
                _cacheExpressOperationList = res;
                resolve(_cacheExpressOperationList);
            }).catch(()=>{
                reject()
            })
        })
    }
}


/*
    新建表达式
 */
export function addExpr(params){
    return request.post(`business/expr/save`,params);
}

// 获取校验规则列表
export function getExpresslist(id){
    return request.get(`business/expr/list/${id}`)
}

// 删除表达式
export function delExpress(id){
    return request.post(`business/expr/del/${id}`);
}

// 获取一条业务数据

export function getBusinessData(moduleId, id){
    return request.get(`business/data/get/${moduleId}/${id}`);
}

// 获取字段类型列表
export function getFieldTypeList(){
    return request.get(`field/fieldTypeList`);
}

//获取关联此模块的模块
export function getRelationModuleList(moduleId){
    return request.get(`relation/findByAssociatedId/${moduleId}`)
}
