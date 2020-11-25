
import Layout from '@/views/layout/index';

export default [
    {
        path: '/',
        redirect: '/customModule',
        name: 'home',
        meta: {
            show: true,
            i18n: '模块管理',
        },
        component: Layout,
        children: [
            {
                path: '/customModule',
                name: 'customModule',
                meta: {
                    show: true,
                    i18n: '自建模块',
                },
                component: () => import(/* webpackChunkName: "myApp" */ '../views/module/list/index.vue'),
            },
            {
                path: '/customModule/config/:id',
                name: 'config',
                // props: true,
                component: () => import(/* webpackChunkName: "customModuleConfig" */ '../views/module/config/index.vue')
            }
        ]
    },
    {
        path: '/myApp',
        name: 'myApp',
        component: () => import(/* webpackChunkName: "myApp" */ '../views/app/home/index.vue')
    },
    {
        path: '/myApp/detail',
        name: 'myAppDetail',
        component: () => import(/* webpackChunkName: "myAppDetail" */ '../views/app/detail/index.vue')
    },
    {
        path: '/display',
        name: 'myAppDetail',
        component: () => import(/* webpackChunkName: "myAppDetail" */ '../views/app/display/index.vue')
    },
    {
        path: '/test',
        name: 'test',
        component: () => import(/* webpackChunkName: "myApp" */ '../views/test.vue')
    },
    {
        path: '*',
        redirect: '/customModule'
    }
];
