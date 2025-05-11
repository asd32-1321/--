<template>
    <nav class="bg-purple-600 p-4">
      <div class="container mx-auto flex justify-between items-center">
        <div class="text-white font-bold text-xl">旅游系统</div>
        <ul class="flex space-x-4">
          <li v-if="isLoggedIn">
            <router-link to="/recommend" class="text-white hover:text-purple-200">
              旅游推荐
            </router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/travel-log" class="text-white hover:text-purple-200">
              旅游日志
            </router-link>
          </li>
          <li v-if="isLoggedIn">
            <button @click="$emit('logout')" class="text-white hover:text-purple-200">
              退出登录
            </button>
          </li>
          <li v-else>
            <router-link to="/about" class="text-white hover:text-purple-200">
              关于我们
            </router-link>
          </li>
          <li v-else>
            <router-link to="/contact" class="text-white hover:text-purple-200">
              联系我们
            </router-link>
          </li>
          <li>
            <router-link
              :to="isLoggedIn ? '#' : '/' "
              :class="isLoggedIn ? 'text-white hover:text-purple-200 cursor-not-allowed' : 'text-white hover:text-purple-200'"
              :disabled="isLoggedIn"
            >
              {{ isLoggedIn ? '已登录' : '登录' }}
            </router-link>
          </li>
        </ul>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';

  defineProps({
    isLoggedIn: {
      type: Boolean,
      default: false
    }
  });
  
  defineEmits(['logout']);
  </script>
  
  <style scoped>
  /* 可添加导航栏样式 */
  </style>    