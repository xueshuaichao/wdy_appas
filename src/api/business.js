//业务接口
import request from '../lib/request';
import _ from 'lodash';
import {preSaveFormat,formatOptions} from "@/lib/field";

/*
    检查模块是否包含业务数据
 */
export function checkModule(moduleId){
    return request.get(`business/data/exists/${moduleId}`);
}

/*
    获取业务数据
    showFields:  [apiName] 展示哪些列数据
    page,
    pageSize
 */
export function getDataList(moduleId,{showFields,page=1,pageSize=10}){
    return request.post(`business/data/query/${moduleId}`,{
        showFields,
        page,
        pageSize
    });
}


/*
    获取关联此条数据的模块的业务数据
    relationId 关联id（注意此id非moduleId）由module的getRelationModuleList接口拿到
    relBusinessId 被关联的数据id
 */
export function getRelationDataList(relationId,relBusinessId,{showFields,page=1,pageSize=10}){
    return request.post(`business/data/query/relation/${relationId}/${relBusinessId}`,{
        showFields,
        page,
        pageSize
    })
}

/*
    新增业务数据
 */
export function saveData(moduleId,params,moduleFieldList){
    params = preSaveFormat(params,moduleFieldList);
    return request.post(`business/data/save/${moduleId}`,params)
}

/*
    检查是否可删除，关联关系是否被引用
 */
export function checkDel(moduleId,id){
    return request.post(`business/data/delete/isAllowed/${moduleId}/${id}`);
}

/*
    删除业务数据
 */
export function delData(moduleId,id){
    return request.post(`business/data/delete/${moduleId}/${id}`);
}

/*
    上传文件，生成对应的上传文件id，后端用于关联逻辑
    objectName  oss云存储路径
 */
export function upload(params){
    return request.post('business/attach/info/save',{
        fileName: params.fileName,
        extName: params.extName,
        objectName: params.objectName,
        size: params.size
    })
}


let _cacheSelectTemplateList;
/*
    获取通用选项列表
 */
export function getSelectTemplateList(){
    if(_cacheSelectTemplateList){
        return Promise.resolve(_cacheSelectTemplateList);
    }else{
        return new Promise((resolve, reject) => {
            request.get('dict/find',{
                params: {
                    isGeneral: 1
                }
            }).then(res=>{
                _cacheSelectTemplateList = res;
                resolve(_cacheSelectTemplateList);
            }).catch(()=>{
                reject()
            })
        })
    }
}

let _cacheSelectTemplateOptions = {};
/*
    获取通用选项的选项
 */
export function getSeleteTemplateOptions(id){
    if(_cacheSelectTemplateOptions[id]){
        return Promise.resolve(_.cloneDeep(_cacheSelectTemplateOptions[id]))
    }else{
        return new Promise((resolve, reject) => {
            request.get('dict/findByTypeId',{
                params: {
                    typeId: id
                }
            }).then(res=>{
                _cacheSelectTemplateOptions[id] = formatOptions(res);
                resolve(_.cloneDeep(_cacheSelectTemplateOptions[id]));
            }).catch(()=>{
                reject();
            })
        })
    }
}



// let _cacheRegion = {
//     '-1': []    //id -1 表示省
// }

let _cacheRegion = {}
/*
    获取地区列表
    id为空时表示获取第一级省数据
 */
export function getRegion(id){
    if(typeof id == 'undefined'){
        if(_cacheRegion['-1']){
            return Promise.resolve(_.cloneDeep(_cacheRegion['-1']))
        }else{
            return new Promise((resolve, reject) => {
                request.get('dict/findProvince').then((data)=>{
                    _cacheRegion[-1] = formatOptions(data);
                    resolve(_.cloneDeep(_cacheRegion[-1]));
                }).catch(()=>{
                    reject()
                });
            })
        }
    }else{
        if(_cacheRegion[id]){
            return Promise.resolve(_.cloneDeep(_cacheRegion[id]))
        }else{
            return new Promise((resolve, reject) => {
                request.get('dict/findByParentId',{
                    params: {parentId: id}
                }).then((data)=>{
                    _cacheRegion[id] = formatOptions(data);
                    resolve(_.cloneDeep(_cacheRegion[id]));
                }).catch(()=>{
                    reject()
                });
            })
        }
    }
}

/*
    默认值表达式计算
 */
export function caculateDefaultValue(moduleId,params,moduleFieldList){
    params = preSaveFormat(params,moduleFieldList);
    return request.post(`business/data/pre/save/${moduleId}`,params)
}

/*
    表达式语法校验
    content 表达式  必填
    moduleId
    fieldType 字段类型   默认值表达式时必填
    attr 字段全部属性 默认值表达式时必填

    当传了fieldType时，后端会当成默认值表达式去校验，否则为校验规则
 */
export function expressVerify(content,moduleId,fieldType,attr){
    return request.post('business/expr/verify',{
        content,
        moduleId,
        fieldType,
        attr
    })
}
