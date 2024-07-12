import axios from 'axios';
import { Message } from 'element-ui';
import router from '@/router';

export const baseURL = 'http://47.115.217.115:8000';
const apiClient = axios.create({
    baseURL: baseURL,
    timeout: 100000,
});

// 添加请求拦截器来附加 Bearer Token
apiClient.interceptors.request.use(
    config => {
        const access_token = localStorage.getItem('access_token');
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// 添加响应拦截器来处理 401 错误
apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            if (error.response.status === 401) {
                Message.error(error.response.data.detail);
                if (router.currentRoute.path !== '/login') {
                    router.push('/login');  // 跳转到登录页面
                }
            } else if (error.response.status === 403) {
                Message.error('无权限，请联系管理员');
            } else {
                Message.error(`${JSON.stringify(error.response.data.detail)}`);
            }
        } else {
            Message.error('请求失败，请稍后重试');
        }
        return Promise.reject(error);
    }
);


export const fetchLoginToken = (username, password) => {
    // 创建表单数据
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);

    // 发送 POST 请求，使用表单数据
    return apiClient.post('/api/login/token', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });
};

export function fetchTaskPersonnelConfig() {
    return apiClient.get('/weixin/task-personnel-config');
}

export function deleteTaskPersonnelConfig(group_wxid, personnel_wxid) {
    return apiClient.delete(`/weixin/task-personnel-config`, {
        params: {
            group_wxid, personnel_wxid
        }
    });
}
export function addTaskPersonnelConfig(group_wxid, personnel_wxid) {
    return apiClient.post('/weixin/task-personnel-config', {
        group_wxid, personnel_wxid
    });
}
export function fetchGroupOptions() {
    return apiClient.get('/weixin/groups');
}

export function fetchPersonnelOptions(group_wxid) {
    return apiClient.get('/weixin/personnel', {
        params: {
            group_wxid
        }
    });
}

export function fetchDutyPersonnelConfig() {
    return apiClient.get('/weixin/duty-personnel-config');
}

export function addDutyPersonnelConfig(group_wxid, personnel_wxid, start_time, end_time) {
    return apiClient.post('/weixin/duty-personnel-config', {
        group_wxid, personnel_wxid, start_time, end_time
    });
}

export function deleteDutyPersonnelConfig(duty_id) {
    return apiClient.delete(`/weixin/duty-personnel-config`, {
        params: {
            duty_id
        }
    });
}
export function fetchTaskRecords(group_wxid, show_all_tasks, page, per_page) {
    return apiClient.get('/weixin/task-records', {
        params: {
            group_wxid, show_all_tasks, page, per_page
        }
    });
}

export function checkTaskRecord(task_record_id, is_processed) {
    return apiClient.post(`/weixin/task-records`, {
        task_record_id, is_processed
    });
}

export function createTaskProgess(task_record_id, proccess_personnel_wxid, content) {
    return apiClient.post(`/weixin/task-progress`, {
        task_record_id, proccess_personnel_wxid, content
    });
}

export function getTaskProgress(task_record_id) {
    return apiClient.get(`/weixin/task-progress`, {
        params: {
            task_record_id
        }
    });
}

export function getAllJobs() {
    return apiClient.get(`/api/scheduler/jobs`);
}

export function getJobFunctions() {
    return apiClient.get(`/api/scheduler/jobs/functions`);
}

export function createJob(name, args, hour, minute, frequency, day_of_week, day_of_month) {
    return apiClient.post(`/api/scheduler/jobs`, {
        name, args, hour, minute, frequency, day_of_week, day_of_month
    });
}

export function deleteJob(job_id) {
    return apiClient.delete(`/api/scheduler/jobs/${job_id}`);
}

export function updateJob(job_id, args, hour, minute, frequency, day_of_week, day_of_month) {
    return apiClient.put(`/api/scheduler/jobs/${job_id}`, {
        args, hour, minute, frequency, day_of_week, day_of_month
    });
}

export function getWxMessageTypes() {
    return apiClient.get(`/weixin/message-type`);
}