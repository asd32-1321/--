<template>
  <div>
    <NavMenu :isLoggedIn="isLoggedIn" @logout="handleLogout" />
    <RouterView />
  </div>
</template>

<script setup>
import { ref, onMounted, provide } from 'vue';
import { useRouter } from 'vue-router';
import NavMenu from './components/NavMenu.vue';

const router = useRouter();
const isLoggedIn = ref(false);

// 使用 provide 提供登录状态
provide('isLoggedIn', isLoggedIn);

onMounted(() => {
  const storedLoggedIn = localStorage.getItem('isLoggedIn');
  if (storedLoggedIn === 'true') {
    isLoggedIn.value = true;
  }
});

const handleLogout = () => {
  localStorage.removeItem('isLoggedIn');
  isLoggedIn.value = false;
  router.push('/');
};
</script>

<style scoped>
/* 可添加全局样式 */
</style>    