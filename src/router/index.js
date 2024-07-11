import Vue from 'vue';
import VueRouter from 'vue-router';
import DutyConfigView from '../views/DutyConfigView.vue';
import TaskPersonnelConfigView from '@/views/TaskPersonnelConfigView.vue';
import LoginView from '@/views/LoginView.vue';
import TaskRecordsView from '@/views/TaskRecordsView.vue';
import JobsView from '@/views/JobsView.vue';
Vue.use(VueRouter);

const routes = [

    {
        path: '/login',
        name: '登录',
        component: LoginView
    },
    {
        path: '/TaskPersonnelConfigView',
        name: '任务人员配置',
        component: TaskPersonnelConfigView
    },
    {
        path: '/DutyConfigView',
        name: '值日生配置',
        component: DutyConfigView
    },
    {
        path: '/TaskRecordsView',
        name: '任务记录',
        component: TaskRecordsView
    },
    {
        path: '/JobsView',
        name: '定时任务',
        component: JobsView
    },
];

const router = new VueRouter({
    routes
});

export default router