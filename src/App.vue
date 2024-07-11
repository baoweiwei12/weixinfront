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
    LoginView
  },
  computed: {
    layoutComponent() {
      return this.$route.path === '/login' ? 'LoginView' : 'IndexView';
    }
  }
}
</script>
