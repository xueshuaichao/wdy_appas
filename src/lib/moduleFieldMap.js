
const moduleFieldMap = {
    'TEXT': {
        fieldType: 'TEXT',
        name: '单行文本',
        attr: {
            title: '',
            apiName: '',
            maxLength: '',
            minLength: '',
            required: 0,
            unique: 0,
            defaultValue: {
                type: 1, //1 静态  2表达式
                value: '',   //静态时为默认值本身，表达式时，为表达式
                referFields: []     //所依赖的字段的ApiName
            },
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    },
    'TEXTAREA': {
        fieldType: 'TEXTAREA',
        name: '多行文本',
        attr: {
            title: '',
            apiName: '',
            maxLength: '',
            minLength: '',
            required: 0,
            unique: 0,
            defaultValue: {
                type: 1,
                value: '',
                referFields: []
            },
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    },
    'PHONE': {
        fieldType: 'PHONE',
        name: '电话',
        attr: {
            title: '',
            apiName: '',
            phoneType: 'MOBILE',   //MOBILE 手机   FIXED 座机
            required: 0,
            unique: 0,
            showMask: 0,  //显示掩码
            fromMask: '', //掩码启示位置
            toMask: '', //掩码结束位置
            defaultValue: {
                type: 1,
                value: '',
                referFields: []
            },
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    },
    'EMAIL': {
        fieldType: 'EMAIL',
        name: '邮箱',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            unique: 0,
            showMask: 0,  //显示掩码
            fromMask: '', //掩码启示位置
            toMask: '', //掩码结束位置
            defaultValue: {
                type: 1,
                value: '',
                referFields: []
            },
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    },
    'IDENTITY_CARD': {
        fieldType: 'IDENTITY_CARD',
        name: '身份证',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            unique: 0,
            showMask: 0,  //显示掩码
            fromMask: '', //掩码启示位置
            toMask: '', //掩码结束位置
            defaultValue: {
                type: 1,
                value: '',
                referFields: []
            },
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    },
    'DATETIME': {
        fieldType: 'DATETIME',
        name: '日期',
        attr: {
            title: '',
            apiName: '',
            dateType: 'YYYY_MM_DD',     //YYYY_MM_DD YYYY_MM_DD_HH_MM_SS
            required: 0,
            hint: '',
            description: '',
            defaultPrompt: '',
            defaultValue: {
                type: 1,
                value: null,
                referFields: []
            }
        }
    },
    'DROPDOWN_RADIO': {
        fieldType: 'DROPDOWN_RADIO',
        name: '下拉单选',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            optionsType: 'custom',  //custom自定义选项 template通用定义的
            distTypeId: '',         //后端自己用
            templateId: '',         //选择的通用模板id
            optionList: [],        //自定义选项时候的选项{value: String,label: String,enable: 1}
            defaultValue: {
                type: 1,
                value: '',
                referFields: []
            },
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    },
    'DROPDOWN_CHECKBOX': {
        fieldType: 'DROPDOWN_CHECKBOX',
        name: '下拉多选',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            optionsType: 'custom',  //custom自定义选项 template通用定义的
            distTypeId: '',         //后端自己用
            templateId: '',
            optionList: [],        //自定义选项时候的选项{value: String,label: String,enable: 1}
            defaultValue: {
                type: 1,
                value: [],
                referFields: []
            },
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    },
    'RADIO': {
        fieldType: 'RADIO',
        name: '单选框',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            optionsType: 'custom',
            distTypeId: '',         //后端自己用
            templateId: '',
            optionList: [],
            defaultValue: {
                type: 1,
                value: '',
                referFields: []
            },
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    },
    'CHECKBOX': {
        fieldType: 'CHECKBOX',
        name: '复选框',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            optionsType: 'custom',
            distTypeId: '',         //后端自己用
            templateId: '',
            optionList: [],
            defaultValue: {
                type: 1,
                value: [],
                referFields: []
            },
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    },
    'EDITOR': {
        fieldType: 'EDITOR',
        name: '富文本',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            hint: '',
            description: ''
        }
    },
    'INTEGER': {
        fieldType: 'INTEGER',
        name: '整数',
        attr: {
            title: '',
            apiName: '',
            maxValue: '',
            minValue: '',
            required: 0,
            defaultValue: {
                type: 1,
                value: '',
                referFields: []
            },
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    },
    'URL': {
        fieldType: 'URL',
        name: 'URL',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            hint:
`示例
http://www.baidu.com
https://www.baidu.com`,
            description: ''
        }
    },
    'CLERK_RADIO': {
        fieldType: 'CLERK_RADIO',
        name: '人员单选',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            defaultValue: {
                type: 1,
                value: '',
                referFields: []
            },
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    },
    'IMAGES': {
        fieldType: 'IMAGES',
        name: '图片',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            maxFileSize: 50,     //文件尺寸限制
            uploadNumber: 1,    //文件个数限制
            hint: '',
            description: ''
        }
    },
    'FILE': {
        fieldType: 'FILE',
        name: '文件',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            maxFileSize: 50,     //文件尺寸限制
            uploadNumber: 1,    //文件个数限制
            hint: '',
            description: ''
        }
    },
    'VIDEO': {
        fieldType: 'VIDEO',
        name: '视频',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            maxFileSize: 1000,     //文件尺寸限制
            uploadNumber: 1,    //文件个数限制
            hint: '',
            description: ''
        }
    },
    'REGION': {
        fieldType: 'REGION',
        name: '地区',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            regionType: 3,  //1 省 2市 3县
            defaultValue: {
                type: 1,
                value: '',
                referFields: []
            },
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    },
    'RELATION': {
        fieldType: 'RELATION',
        name: '关联关系',
        desc: '用于将当前模块与其他模块建立关联关系。其权限受自身控制，与关联模块（父模块）无关',
        attr: {
            title: '',
            apiName: '',
            required: 0,
            relationModuleId: '',
            delStrategy: 1, //1 表示禁止删除  2表示可以删除，切自动切断关联关系
            showFields: [], //要展示的字段 [apiName]
            filterType: 1,  //1 全部数据  2条件数据
            defaultPrompt: '',
            hint: '',
            description: ''
        }
    }
};

export default moduleFieldMap
