<template>
  <el-container style="border: 1px solid #eee; ">
    <el-aside width="200px" style="background-color: rgb(238, 241, 246); height: 100%;">
      <el-menu :default-openeds="['1']" router>
        <el-menu-item index="1" :route="{ path: '/TaskPersonnelConfigView' }">
          <i class="el-icon-user-solid"></i>
          <span slot="title">任务人员配置</span>
        </el-menu-item>
        <el-menu-item index="2" :route="{ path: '/DutyConfigView' }">
          <i class="el-icon-date"></i>
          <span slot="title">群组值日配置</span>
        </el-menu-item>
        <el-menu-item index="3" :route="{ path: '/TaskRecordsView' }">
          <i class="el-icon-s-claim"></i>
          <span slot="title">群组任务记录</span>
        </el-menu-item>
        <el-menu-item index="4" :route="{ path: '/JobsView' }">
          <i class="el-icon-pie-chart"></i>
          <span slot="title">机器人定时任务</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>


      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
/* .el-header {
  background-color: #B3C0D1;
  color: #333;
  line-height: 60px;
} */

.el-aside {
  color: #333;
  height: 100%;

}

.el-container {
  height: 98vh;
}
</style>

<script>
export default {
  data() {
    return {
      currentUser: {
        username: 'Admin',
      },
    };
  },
  created() {
    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
      this.$router.push({ path: '/login' });
    }
  },
};
</script>
