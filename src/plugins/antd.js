import Vue from 'vue'
import {
    ConfigProvider,
    Layout,
    Col,
    Row,
    PageHeader,
    Button,
    DatePicker,
    Menu,
    Icon,
    Table,
    Modal,
    FormModel,
    Input,
    InputNumber,
    Checkbox,
    Radio,
    Cascader,
    Drawer,
    Transfer,
    Progress,
    Popover,
    Popconfirm,
    Switch,
    Upload,
    Spin,
    message,
    Divider,
    Select,
    Tooltip,
} from 'ant-design-vue'

Vue.use(ConfigProvider)
Vue.use(Layout)
Vue.use(Col)
Vue.use(Row)
Vue.use(PageHeader)
Vue.use(Button)
Vue.use(DatePicker)
Vue.use(Menu)
Vue.use(Icon)
Vue.use(Table)
Vue.use(Modal)
Vue.use(FormModel)
Vue.use(Input)
Vue.use(InputNumber)
Vue.use(Checkbox)
Vue.use(Radio)
Vue.use(Cascader)
Vue.use(Drawer)
Vue.use(Transfer)
Vue.use(Popover)
Vue.use(Progress)
Vue.use(Popconfirm)
Vue.use(Switch)
Vue.use(Upload)
Vue.use(Spin)
Vue.use(Divider)
Vue.use(Select)
Vue.use(Tooltip)
message.config({
    maxCount: 1,
  });
Vue.prototype.$message = message;

