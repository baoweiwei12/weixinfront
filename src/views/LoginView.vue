<template>
    <div class="login-container">
        <el-card class="login-card">
            <h2 class="login-title">登录</h2>
            <el-form :model="loginForm" :rules="rules" ref="loginForm" label-width="80px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="loginForm.username" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="loginForm.password" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLogin">登录</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import { fetchLoginToken } from '@/api';
import { Message } from 'element-ui';
import { Base64 } from 'js-base64';

export default {
    name: 'LoginView',
    data() {
        return {
            loginForm: {
                username: '',
                password: '',
            },
            rules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                ],
            },
        };
    },
    created() {
        const { data } = this.$route.query;
        if (data) {
            try {
                const decodedData = Base64.decode(data);
                const { username, password, groupWxid } = JSON.parse(decodedData);

                if (username && password && groupWxid) {
                    localStorage.setItem('groupWxid', groupWxid);
                    this.$nextTick(() => {
                        this.userLogin(username, password);
                    });

                }
            } catch (error) {
                console.error('Invalid encoded data:', error);
            }
        }
    },
    methods: {
        handleLogin() {
            this.$refs.loginForm.validate(async valid => {
                if (valid) {
                    try {
                        const response = await fetchLoginToken(this.loginForm.username, this.loginForm.password);
                        localStorage.setItem('access_token', response.data.access_token);
                        localStorage.setItem('user', JSON.stringify(response.data.user));
                        Message.success('登录成功');
                        this.$router.push({ path: '/' });
                    } catch (error) {
                        Message.error('登录失败，请检查用户名和密码');
                    }
                } else {
                    Message.error('请完整填写表单');
                }
            });
        },
        async userLogin(username, password) {
            try {
                const response = await fetchLoginToken(username, password);
                localStorage.setItem('access_token', response.data.access_token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                Message.success('登录成功');
                this.$router.push({ path: '/UserTaskRecordView' });
            } catch (error) { console.log(error) }
        }
    },
};
</script>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #f5f5f5;
}

.login-card {
    width: 400px;
    padding: 20px;
}

.login-title {
    text-align: center;
    margin-bottom: 20px;
}
</style>
