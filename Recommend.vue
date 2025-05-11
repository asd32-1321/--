<template>
    <div class="p-8 bg-gray-100 min-h-screen">
      <h1 class="text-3xl font-bold mb-4 text-purple-600">旅游推荐</h1>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="搜索景点..."
        class="mb-4 p-2 border border-gray-300 rounded-md w-full"
      />
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="place in rankedPlaces"
          :key="place.name"
          class="bg-white p-4 rounded-md shadow-md hover:shadow-lg transform hover:scale-105 transition duration-300"
          @click="handleClick(place)"
        >
          <img :src="place.image" alt="旅游景点" class="w-full h-48 object-cover rounded-md mb-2" />
          <h2 class="text-xl font-bold mb-2 text-gray-800">{{ place.name }} (排名: {{ place.rank }})</h2>
          <p class="text-gray-600">{{ place.description }}</p>
          <div class="flex items-center justify-between mt-2">
            <div>
              <span class="text-sm text-gray-500">点赞: {{ place.likes }}</span>
              <span class="text-sm text-gray-500 ml-2">评价: {{ place.rating.toFixed(1) }}</span>
              <span class="text-sm text-gray-500 ml-2">热度: {{ place.likes }}</span>
            </div>
            <button
              @click.stop="toggleLike(place)"
              class="text-gray-600 hover:text-purple-600 transition-colors"
            >
              <i :class="place.isLiked ? 'fas fa-heart text-red-500' : 'far fa-heart'"></i>
            </button>
            <button
              @click.stop="openRatingModal(place)"
              class="text-gray-600 hover:text-purple-600 transition-colors ml-2"
            >
              评价
            </button>
          </div>
        </div>
      </div>

      <!-- 评价模态框 -->
      <div v-if="showRatingModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-xl font-bold mb-4 text-gray-800">评价 {{ selectedPlace.name }}</h3>
          <div class="flex items-center mb-4">
            <span class="text-sm text-gray-500 mr-2">请选择评分 (1 - 10):</span>
            <select v-model="newRating" class="border border-gray-300 rounded-md p-1">
              <option v-for="i in 10" :key="i" :value="i">{{ i }}</option>
            </select>
          </div>
          <div class="flex justify-end">
            <button
              @click="submitRating"
              class="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
            >
              提交评价
            </button>
            <button
              @click="closeRatingModal"
              class="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors ml-2"
            >
              取消
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue';
  import axios from 'axios';

  const searchQuery = ref('');
  const showRatingModal = ref(false);
  const selectedPlace = ref(null);
  const newRating = ref(1);
  const places = ref([]);

  onMounted(async () => {
    try {
      const response = await axios.get('http://localhost:3000/places');
      places.value = response.data;
      calculateRanks();
    } catch (error) {
      console.error('获取景点数据失败:', error);
    }
  });

  const filteredPlaces = computed(() => {
    return places.value.filter(place =>
      place.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
  });

  const rankedPlaces = computed(() => {
    return filteredPlaces.value.slice().sort((a, b) => {
      const scoreA = a.likes + a.rating * 10;
      const scoreB = b.likes + b.rating * 10;
      return scoreB - scoreA;
    }).map((place, index) => ({ ...place, rank: index + 1 }));
  });

  const calculateRanks = () => {
    places.value = places.value.slice().sort((a, b) => {
      const scoreA = a.likes + a.rating * 10;
      const scoreB = b.likes + b.rating * 10;
      return scoreB - scoreA;
    }).map((place, index) => ({ ...place, rank: index + 1 }));
  };

  const handleClick = (place) => {
    // 可以在这里添加点击增加热度的逻辑
  };

  const toggleLike = async (place) => {
    try {
      place.isLiked = !place.isLiked;
      if (place.isLiked) {
        place.likes++;
      } else {
        place.likes--;
      }
      await axios.put(`http://localhost:3000/places/${place.name}`, { likes: place.likes });
      calculateRanks();
    } catch (error) {
      console.error('更新点赞数失败:', error);
    }
  };

  const openRatingModal = (place) => {
    selectedPlace.value = place;
    showRatingModal.value = true;
  };

  const closeRatingModal = () => {
    showRatingModal.value = false;
    selectedPlace.value = null;
    newRating.value = 1;
  };

  const submitRating = async () => {
    try {
      const place = selectedPlace.value;
      const totalRatings = place.ratingsCount + 1;
      const newRatingValue = (place.rating * place.ratingsCount + parseInt(newRating.value)) / totalRatings;
      place.rating = newRatingValue;
      place.ratingsCount = totalRatings;
      await axios.put(`http://localhost:3000/places/${place.name}`, { rating: place.rating, ratingsCount: place.ratingsCount });
      calculateRanks();
      closeRatingModal();
    } catch (error) {
      console.error('提交评价失败:', error);
    }
  };
  </script>
  
  <style scoped>
  /* 可添加推荐页面样式 */
  </style>