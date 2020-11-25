import _ from 'lodash';
import moment from 'moment';
import {isDev, isTest} from "@/const/env";
import moduleFieldMap from "@/lib/moduleFieldMap";
import validateFieldMap from "@/lib/validateField";
import {customAlphabet} from "nanoid";
import {getSelectTemplateList} from "@/api/business";

let _ossEnvPath;
switch (true) {
    case isDev:
    case isTest:
        _ossEnvPath = 'test';break;
    default:
        _ossEnvPath = 'prod'
}
/*
    生成oss路径
 */
export const generateOssPath = function(filename,namespace = 'file'){
    const namespaceList = ['file','img']
    if(!namespaceList.includes(namespace)) throw new Error(`非法oss namespace: ${namespace}`);

    return `${_ossEnvPath}/module/${namespace}/${new Date().getTime()}-${filename}`
}


const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 10)

/*
    生成apiNames
    namespace: module or field
 */
export const generateApiName = function(namespace='field') {
    return `${namespace}_${nanoid()}`;
}

/*
    字段前端数据转化为服务端数据
    type转为fieldType
    title,apiName,description从attr提取出放到外层
 */

export const fieldDataFE2Server = function (moduleId, data) {
    return {
        id: data.id || '',
        fieldSource: data.fieldSource || '1',
        parentId: moduleId,
        fieldType: data.fieldType,
        apiName: data.attr.apiName,
        title: data.attr.title,
        description: data.attr.description,
        isPrimaryAttr: data.isPrimaryAttr,
        attr: data.attr
    }
}

/*
    服务端字段数据转化为前端数据
    title,apiName,description 放到attr内部
 */
export const fieldDataServer2FE = function (data) {
    return {
        id: data.id,
        fieldType: data.fieldType,
        name: moduleFieldMap[data.fieldType].name,
        desc: moduleFieldMap[data.fieldType].desc,
        fieldSource: data.fieldSource,
        isPrimaryAttr: data.isPrimaryAttr,
        attr: {
            ...data.attr,
            apiName: data.apiName,
            title: data.title,
            description: data.description
        }
    }
}

/*
    校验规则前端数据转化为服务端数据
 */
export const validateDataFE2Server = function (moduleId, data) {
    return {
        name: data.name || '',
        content: data.content || '',
        parentId: moduleId,
        description: data.description || '',
        apiName: data.apiName,
        displayMode: data.displayMode || '',
        hint: data.hint || '',
        displayApiName: data.displayApiName || '',
        id: data.id || ''
    }
}

/*
    生成fieldConfig
 */
export const generateFieldConfig = async function(fieldType){
    let fieldConfig = _.cloneDeep(moduleFieldMap[fieldType]);
    if(['DROPDOWN_RADIO','DROPDOWN_CHECKBOX','RADIO','CHECKBOX'].includes(fieldType)){
        let res = await getSelectTemplateList();
        fieldConfig.attr.templateId = res.length? res[0].id : '';
        fieldConfig.attr.optionList.push(generateOptions());
    }
    fieldConfig.fieldSource = 1;
    fieldConfig.attr.apiName = generateApiName(fieldType);

    return fieldConfig;
}

/*
    生成validateConfig
 */
export const initValidateField = async function(fieldType){
    let fieldConfig = _.cloneDeep(validateFieldMap[fieldType]);
    fieldConfig.apiName = generateApiName(fieldType);

    return fieldConfig;
}

/*
    生成选项
 */
export const generateOptions = function(){
    return {
        value: new Date().getTime(),
        label: '',
        enable: true,
        isNew: true,
        hasError: false
    }
}

/*
    格式化选项数据
 */
export const formatOptions = function(options){
    let result = options.map((item)=>{
        return {
            id: item.id,
            label: item.label,
            value: item.treePath,
            enable: Boolean(item.state)
        }
    });
    return result
}

/*
    计算依赖项
    isDepended 为true 表示此字段被其他字段依赖，因此此字段改变时，需要调用接口计算依赖它的字段的默认值
    举例：字段2 由 字段1计算得到， 则字段2的referFields属性数组中包含字段1的apiName，字段1的isDepended为true

    isManual 是否人工干预，如果为true，表示人工干预了这个字段，还拿之前的例子，如果字段2用户自己改了值，则清空字段2的referFields，重新计算
    所有字段的isDepended，且设置isManual为true, isManual为true时，后端计算的默认值不会采用
 */
export const computedFieldDepend = function(fieldList){
    //重置状态
    for(let item of fieldList){
        item.isDepended = false;
        if(typeof item.isManual == 'undefined'){
            item.isManual = false;
        }
    }

    for(let item of fieldList){
        if(item.attr.defaultValue && item.attr.defaultValue.type == 2){
            let referFieldList = item.attr.defaultValue.referFields;
            for(let dependence of referFieldList){
                //找到被依赖的field
                let isDependField = fieldList.find((item)=>{
                    return item.attr.apiName == dependence.apiName
                })
                if(isDependField) isDependField.isDepended = true;
            }
        }
    }

    return fieldList;
}

/*
    将数组形式的字段元数据转换成Map形式的，key为字段apiName
 */
export const moduleFieldList2Map = function(moduleFieldList){
    let result = {};
    for(let fieldConfig of moduleFieldList){
        let apiName = fieldConfig.attr.apiName;
        result[apiName] = fieldConfig;
    }

    return result;
}

/*
    提交业务数据前的数据转化
    data 待提交的业务数据
    moduleFieldList 字段元数据
 */
export const preSaveFormat = function(data,moduleFieldList){
    let moduleFieldMap = moduleFieldList2Map(moduleFieldList);

    let newData = _.cloneDeep(data);

    for(let apiName in newData){
        if(apiName == 'id') continue;

        let fieldConfig = moduleFieldMap[apiName];
        let fieldType = fieldConfig.fieldType;
        let fieldData = newData[apiName];

        switch (fieldType) {
            case 'DATETIME':
                newData[apiName] = fieldData instanceof moment? fieldData.format('YYYY-MM-DD HH:mm:ss') : null;
                break;
            case 'INTEGER':
                newData[apiName] = fieldData? parseInt(fieldData) : null;
                break;
            default:
                newData[apiName] = fieldData? fieldData : null;
        }
    }

    return newData;
}
