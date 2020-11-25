
import _ from 'lodash';
import OSS from 'ali-oss';
import {getOssToken} from "@/api/aliyun";

export const getMenuByRouter = (list) => {
    const res = [];
    const hasChild = item => item.children && item.children.length > 0;
    list.forEach((item) => {
        if (item.meta) {
            const obj = {
                name: item.name,
                icon: (item.meta && item.meta.icon) || '',
                i18n: (item.meta && item.meta.i18n) || '',
                meta: item.meta,
                redirect: !!item.redirect,
            };
            if (hasChild(item)) {
                obj.children = getMenuByRouter(item.children);
            }
            res.push(obj);
        }
    });
    return res;
};

let cacheOssConfig = null;
export const getOssClient = async function(){
    if(!cacheOssConfig || new Date(cacheOssConfig.expiration) <= new Date()){
        try{
            let res = await getOssToken();
            cacheOssConfig = res;
        }catch (e) {
            console.error('获取oss bucket sts授权失败')
        }
    }

    let {region,accessKeyId,accessKeySecret,securityToken,bucket,endpoint} = cacheOssConfig;

    let config = {
        region,
        accessKeyId,
        accessKeySecret,
        stsToken: securityToken,
        endpoint,
        bucket
    }

    return new OSS(config)
}


/*
    显示掩码
 */
export const showMask = function(txt,start,end){
    if (txt) {
        start = start < 1 ? 1 : start;
        end = end > txt.length ? txt.length : end;
        // let reg = new RegExp(`(\\w{${start-1}})\\w{${end-start+1}}(\\w{${txt.length-end}})`);
        let reg = new RegExp(`(.{${start-1}}).{${end-start+1}}(.{${txt.length-end}})`);
        return txt.replace(reg,'$1' +_.repeat('*', end-start+1) + '$2');
    }
}


/* 限制数字输入框只能输入正整数 */
export const limitDecimals = function(value) {
    return String(value).replace(/[^\d]/g, '').replace(/^(0+\d)/g, '0');
    // return !isNaN(value) ? String(value).replace(/^(0+\d)|[^\d]/g, '') : ''
}

/* 限制数字输入框只能输入整数 */
export const limitInteger = function(value) {
    value = String(value);
    if (value.startsWith('-')) {
        return '-' + value.substr(1).replace(/[^\d]/g, '').replace(/^(0+)/g, '');
    } else {
        return value.replace(/[^\d]/g, '').replace(/^(0+\d)/g, '0');
    }
}
