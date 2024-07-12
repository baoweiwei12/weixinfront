<template>
  <div id="app">
    <component :is="layoutComponent" />
  </div>
</template>

<script>
import IndexView from './views/IndexView.vue';
import LoginView from './views/LoginView.vue';

export default {
  name: 'App',
  components: {
    IndexView,
    LoginView,
  },
  computed: {
    layoutComponent() {

      console.log(this.$route.path)

      const path = this.$route.path;
      if (path === '/login') {
        return 'LoginView';
      } else {
        return 'IndexView';
      }

    }
  }
}
</script>
