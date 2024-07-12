<template>
  <el-container style="border: 1px solid #eee; ">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246); height: 100%;">

      <el-menu :default-openeds="['1']" router>
        <el-menu-item index="1" v-if="this.isAdmin() || this.isSuperAdmin()"
          :route="{ path: '/TaskPersonnelConfigView' }">
          <i class="el-icon-user-solid"></i>
          <span slot="title">任务人员配置</span>
        </el-menu-item>
        <el-menu-item index="2" v-if="this.isAdmin() || this.isSuperAdmin()" :route="{ path: '/DutyConfigView' }">
          <i class="el-icon-date"></i>
          <span slot="title">群组值日配置</span>
        </el-menu-item>
        <el-menu-item index="3" v-if="this.isAdmin() || this.isSuperAdmin()" :route="{ path: '/TaskRecordsView' }">
          <i class="el-icon-s-claim"></i>
          <span slot="title">群组任务记录</span>
        </el-menu-item>
        <el-menu-item index="4" v-if="this.isSuperAdmin()" :route="{ path: '/JobsView' }">
          <i class="el-icon-pie-chart"></i>
          <span slot="title">机器人定时任务</span>
        </el-menu-item>
        <el-menu-item index="5" v-if="this.isUser()" :route="{ path: '/UserTaskRecordView' }">
          <i class="el-icon-s-claim"></i>
          <span slot="title">个人任务记录</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 16px">
        <span style="margin-right: 20px">欢迎您，{{ currentUser.full_name ? currentUser.full_name : currentUser.username
          }}</span>
        <el-dropdown @command="handleCommand">
          <i class="el-icon-setting" style="margin-right: 15px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>修改信息</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
.el-aside {
  color: #333;
  height: 100%;
}

.el-container {
  height: 98vh;
}


.el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
}
</style>

<script>

export default {
  data() {
    return {
      currentUser: {},
    };
  },
  created() {
    const access_token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');

    if (!user || !access_token) {
      this.$router.push({ path: '/login' });
    } else { this.currentUser = JSON.parse(user); }

  },
  methods: {
    logout() {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      this.$router.push({ path: '/login' });
    },
    handleCommand(command) {
      if (command === 'logout') {
        this.logout();
      }
    },
    isSuperAdmin() {
      return this.currentUser.role === 'superadmin';
    },
    isAdmin() {
      return this.currentUser.role === 'admin';
    },
    isUser() {
      return this.currentUser.role === 'user';
    }
  }
};
</script>
