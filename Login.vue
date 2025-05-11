<template>
  <div class="flex min-h-screen bg-gradient-to-br from-blue-400 to-purple-400 flex-col justify-center px-6 py-12 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
        {{ isLoginMode ? '登录到旅游系统' : '注册旅游系统账号' }}
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- 登录表单 -->
      <form v-if="isLoginMode" class="space-y-6 bg-white p-8 rounded-lg shadow-md" @submit.prevent="handleLogin">
        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">邮箱</label>
          <div class="mt-2">
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium leading-6 text-gray-900">密码</label>
            <div class="text-sm">
              <a href="#" class="font-semibold text-purple-600 hover:text-purple-500">忘记密码？</a>
            </div>
          </div>
          <div class="mt-2">
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
          >
            登录
          </button>
        </div>

        <!-- 切换到注册模式 -->
        <div class="text-center text-sm text-gray-600">
          还没有账号? <button type="button" @click="toggleMode" class="font-medium text-purple-600 hover:text-purple-500">立即注册</button>
        </div>
      </form>

      <!-- 注册表单 -->
      <form v-else class="space-y-6 bg-white p-8 rounded-lg shadow-md" @submit.prevent="handleRegister">
        <div>
          <label for="username" class="block text-sm font-medium leading-6 text-gray-900">用户名</label>
          <div class="mt-2">
            <input
              v-model="username"
              id="username"
              name="username"
              type="text"
              required
              minlength="3"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
            />
            <p v-if="!isValidUsername" class="text-red-500 text-xs mt-1">用户名至少需要 3 个字符。</p>
          </div>
        </div>

        <div>
          <label for="email" class="block text-sm font-medium leading-6 text-gray-900">邮箱</label>
          <div class="mt-2">
            <input
              v-model="email"
              id="email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
            />
            <p v-if="!isValidEmail" class="text-red-500 text-xs mt-1">请输入有效的邮箱地址。</p>
          </div>
        </div>

        <div>
          <label for="password" class="block text-sm font-medium leading-6 text-gray-900">密码</label>
          <div class="mt-2">
            <input
              v-model="password"
              id="password"
              name="password"
              type="password"
              autocomplete="new-password"
              required
              minlength="6"
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
            />
            <p v-if="!isValidPassword" class="text-red-500 text-xs mt-1">密码至少需要 6 个字符。</p>
          </div>
        </div>

        <div>
          <label for="confirmPassword" class="block text-sm font-medium leading-6 text-gray-900">确认密码</label>
          <div class="mt-2">
            <input
              v-model="confirmPassword"
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-purple-600 sm:text-sm sm:leading-6"
            />
            <p v-if="password.value!== confirmPassword.value" class="text-red-500 text-xs mt-1">两次输入的密码不一致。</p>
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="flex w-full justify-center rounded-md bg-purple-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-purple-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-600"
            :disabled="!isValidRegistration"
          >
            注册
          </button>
        </div>

        <!-- 切换到登录模式 -->
        <div class="text-center text-sm text-gray-600">
          已有账号? <button type="button" @click="toggleMode" class="font-medium text-purple-600 hover:text-purple-500">立即登录</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isLoginMode = ref(true); // 控制显示登录还是注册表单
const email = ref('');
const password = ref('');
const username = ref('');
const confirmPassword = ref('');
// 使用 inject 获取登录状态
const isLoggedIn = inject('isLoggedIn');

// 输入验证
const isValidUsername = computed(() => username.value.length >= 3);
const isValidEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value));
const isValidPassword = computed(() => password.value.length >= 6);
const isValidRegistration = computed(() =>
  isValidUsername.value &&
  isValidEmail.value &&
  isValidPassword.value &&
  password.value === confirmPassword.value
);

// 切换登录/注册模式
const toggleMode = () => {
  isLoginMode.value = !isLoginMode.value;
  // 切换模式时清空表单
  email.value = '';
  password.value = '';
  username.value = '';
  confirmPassword.value = '';
};

// 处理登录逻辑
const handleLogin = () => {
  try {
    // 从localStorage获取所有用户
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // 查找匹配的用户
    const user = users.find(user =>
      user.email === email.value && user.password === password.value
    );

    if (user) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('currentUser', JSON.stringify({
        username: user.username,
        email: user.email
      }));
      isLoggedIn.value = true;
      router.push('/recommend');
    } else {
      alert('用户名或密码错误，请重试。');
    }
  } catch (error) {
    console.error('登录时发生错误:', error);
    alert('登录时发生错误，请稍后重试。');
  }
};

// 处理注册逻辑
const handleRegister = () => {
  try {
    if (!isValidRegistration.value) return;

    // 获取已注册用户
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // 检查邮箱是否已注册
    const existingUser = users.find(user => user.email === email.value);
    if (existingUser) {
      alert('该邮箱已被注册，请使用其他邮箱');
      return;
    }

    // 创建新用户
    const newUser = {
      username: username.value,
      email: email.value,
      password: password.value
    };

    // 保存用户到本地存储
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('注册成功，请登录');
    toggleMode(); // 注册成功后切换到登录模式
  } catch (error) {
    console.error('注册时发生错误:', error);
    alert('注册时发生错误，请稍后重试。');
  }
};
</script>

<style scoped>
/* 可添加登录组件样式 */
</style>