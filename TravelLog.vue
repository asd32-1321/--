<template>
  <div class="p-8 bg-gray-100 min-h-screen">
    <h1 class="text-3xl font-bold mb-4 text-purple-600">旅游日志</h1>

    <!-- 发布新日志 -->
    <div class="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 class="text-xl font-bold mb-4 text-gray-800">分享您的旅行</h3>

      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">标题</label>
          <input 
            v-model="newLogTitle" 
            type="text" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="请输入标题"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">内容</label>
          <textarea 
            v-model="newLogContent" 
            rows="4" 
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="请输入您的旅行经历..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">选择标签</label>
          <div class="flex flex-wrap gap-2">
            <span
              v-for="tag in availableTags"
              :key="tag"
              class="px-3 py-1 rounded-full text-sm cursor-pointer border border-gray-300 hover:bg-purple-100 hover:border-purple-300 transition-colors"
              @click="toggleTag(tag)"
              :class="newLogTags.includes(tag) ? 'bg-purple-100 border-purple-300' : ''"
            >
              {{ tag }}
            </span>
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">上传图片</label>
          <div class="flex flex-wrap gap-4">
            <!-- 已选图片预览 -->
            <div v-if="newLogImages.length > 0" class="flex flex-wrap gap-2">
              <div 
                v-for="(image, index) in newLogImages" 
                :key="index" 
                class="relative"
              >
                <img :src="image" alt="预览" class="w-24 h-24 object-cover rounded-md" />
                <button 
                  @click="removeImage(index)" 
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                >
                  <i class="fa fa-times"></i>
                </button>
              </div>
            </div>

            <!-- 上传按钮 -->
            <div class="border-2 border-dashed border-gray-300 rounded-md p-4 flex items-center justify-center w-24 h-24 cursor-pointer hover:border-purple-500 transition-colors" @click="fileInput.click">
              <div class="text-center">
                <i class="fa fa-plus text-gray-400 text-xl"></i>
                <p class="text-xs text-gray-500 mt-1">添加图片</p>
              </div>
              <input 
                ref="fileInput" 
                type="file" 
                multiple 
                accept="image/*" 
                class="hidden" 
                @change="handleFileUpload" 
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end">
          <button 
            @click="publishLog" 
            class="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            发布日志
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索框 -->
    <div class="mb-6">
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索景点标签..."
          class="w-full p-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <i class="fa fa-search absolute left-3 top-3.5 text-gray-400"></i>
      </div>
      <div class="flex flex-wrap gap-2 mt-3">
        <span
          v-for="(tag, index) in availableTags"
          :key="index"
          class="px-3 py-1 rounded-full text-sm cursor-pointer hover:bg-purple-100 hover:text-purple-800 transition-colors"
          @click="searchByTag(tag)"
        >
          {{ tag }}
        </span>
      </div>
    </div>

    <!-- 日志列表 -->
    <div
      v-for="(log, index) in filteredTravelLogs"
      :key="index"
      class="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-300 mb-6"
    >
      <div class="flex justify-between items-start mb-4">
        <h2 class="text-xl font-bold text-gray-800">{{ log.title }}</h2>
        <div class="flex space-x-1">
          <span
            v-for="tag in log.tags"
            :key="tag"
            class="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 图片展示 -->
      <div v-if="log.images && log.images.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
        <img
          v-for="(image, imgIndex) in log.images"
          :key="imgIndex"
          :src="image"
          alt="旅行照片"
          class="w-full h-40 object-cover rounded-md cursor-pointer hover:opacity-90 transition-opacity"
          @click="openImageViewer(log.images, imgIndex)"
        />
      </div>

      <div class="mb-4">
        <p class="text-gray-600">{{ log.content }}</p>
      </div>

      <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>{{ log.username }} · {{ formatDate(log.date) }}</span>
      </div>

      <div class="flex items-center border-t pt-4">
        <button
          @click="toggleLike(index)"
          class="flex items-center mr-4 text-gray-600 hover:text-purple-600 transition-colors"
        >
          <i :class="log.isLiked ? 'fas fa-heart text-red-500' : 'far fa-heart'"></i>
          <span class="ml-1">{{ log.likes }}</span>
        </button>

        <button
          @click="toggleComments(index)"
          class="flex items-center text-gray-600 hover:text-purple-600 transition-colors"
        >
          <i class="far fa-comment-dots"></i>
          <span class="ml-1">{{ log.comments.length }}</span>
        </button>
      </div>

      <div v-if="log.showComments" class="mt-4">
        <div class="flex gap-2">
          <input
            v-model="newComment[index]"
            type="text"
            placeholder="发表评论..."
            class="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <button
            @click="addComment(index)"
            class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors"
          >
            发表
          </button>
        </div>

        <div class="mt-4">
          <div
            v-for="(comment, commentIndex) in log.comments"
            :key="commentIndex"
            class="border-b border-gray-100 pb-3 mb-3"
          >
            <div class="flex items-center justify-between mb-1">
              <span class="font-medium text-gray-800">{{ comment.username }}</span>
              <span class="text-xs text-gray-500">{{ formatDate(comment.date) }}</span>
            </div>
            <p class="text-gray-600">{{ comment.content }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 无结果提示 -->
    <div v-if="travelLogs.length > 0 && filteredTravelLogs.length === 0" class="text-center py-10">
      <i class="fa fa-search text-gray-400 text-5xl mb-3"></i>
      <p class="text-gray-500">没有找到与 "{{ searchQuery }}" 相关的日志</p>
    </div>

    <!-- 图片查看器模态框 -->
    <div v-if="showImageViewer" class="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <button @click="closeImageViewer" class="absolute top-6 right-6 text-white text-3xl">
        <i class="fa fa-times"></i>
      </button>
      <button @click="prevImage" class="absolute left-6 text-white text-4xl">
        <i class="fa fa-chevron-left"></i>
      </button>
      <button @click="nextImage" class="absolute right-6 text-white text-4xl">
        <i class="fa fa-chevron-right"></i>
      </button>
      <img 
        :src="currentImage" 
        alt="大图查看" 
        class="max-w-[90%] max-h-[90vh] object-contain"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, provide, inject } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const searchQuery = ref('');
const newComment = ref({});
const availableTags = ref(['黄山', '张家界', '三亚', '桂林', '成都', '杭州']);
const fileInput = ref(null);

// 新增日志相关
const newLogTitle = ref('');
const newLogContent = ref('');
const newLogTags = ref([]);
const newLogImages = ref([]);

// 图片查看器相关
const showImageViewer = ref(false);
const currentImage = ref('');
const currentImageIndex = ref(0);
const viewerImages = ref([]);

// 从localStorage获取旅游日志
const travelLogs = ref([]);

// 注入当前登录用户信息
const currentUser = inject('currentUser');

onMounted(() => {
  const storedLogs = localStorage.getItem('travelLogs');
  if (storedLogs) {
    travelLogs.value = JSON.parse(storedLogs);
  } else {
    // 如果没有存储的日志，使用初始数据
    travelLogs.value = [
      {
        title: '黄山之旅',
        content: '今天终于登上了黄山，一路上的风景美不胜收。奇松、怪石、云海，每一样都让我惊叹不已。尤其是在光明顶看日出，那壮观的景象让我终身难忘。',
        username: '游客',
        tags: ['黄山'],
        images: [
          'https://tse3-mm.cn.bing.net/th/id/OIP-C.XNdH8E-90NnzQTCLyK9kBgHaE8?w=261&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7'
        ],
        date: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        comments: [],
        showComments: false
      },
      {
        title: '张家界之行',
        content: '张家界的奇峰异石太震撼了！仿佛置身于仙境之中。在袁家界，我看到了电影《阿凡达》中“哈利路亚山”的原型，真的太神奇了。这次旅行让我对大自然的鬼斧神工有了更深的认识。',
        username: '游客',
        tags: ['张家界'],
        images: [
          'https://ts1.tc.mm.bing.net/th/id/OIP-C.aIGPTYUXFint77jzmxo4XgHaE8?w=259&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
        ],
        date: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        comments: [],
        showComments: false
      },
      {
        title: '三亚度假',
        content: '在三亚的这几天，我尽情享受了阳光、沙滩和海浪。每天早上在海边散步，晚上在夜市品尝海鲜，生活无比惬意。三亚真是一个让人放松身心的好地方。',
        username: '游客',
        tags: ['三亚'],
        images: [
          'https://ts1.tc.mm.bing.net/th/id/OIP-C.C_BlThFcm_vKsebTNpxYpwHaE8?w=240&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2'
        ],
        date: new Date().toISOString(),
        likes: 0,
        isLiked: false,
        comments: [],
        showComments: false
      }
    ];
    saveTravelLogs();
  }
});

// 保存旅游日志到localStorage
const saveTravelLogs = () => {
  localStorage.setItem('travelLogs', JSON.stringify(travelLogs.value));
};

// 过滤日志列表
const filteredTravelLogs = computed(() => {
  if (!searchQuery.value.trim()) {
    return travelLogs.value;
  }

  const query = searchQuery.value.toLowerCase().trim();
  return travelLogs.value.filter(log => {
    // 检查标签是否包含搜索词
    return log.tags.some(tag => tag.toLowerCase().includes(query));
  });
});

// 按标签搜索
const searchByTag = (tag) => {
  searchQuery.value = tag;
};

// 切换点赞状态
const toggleLike = (index) => {
  const log = travelLogs.value[index];
  log.isLiked = !log.isLiked;
  if (log.isLiked) {
    log.likes++;
  } else {
    log.likes--;
  }
  saveTravelLogs();
};

// 切换评论显示状态
const toggleComments = (index) => {
  travelLogs.value[index].showComments = !travelLogs.value[index].showComments;
};

// 添加评论
const addComment = (index) => {
  const comment = newComment.value[index];
  if (!comment) return;

  const newCommentObj = {
    content: comment,
    username: currentUser?.username || '游客',
    date: new Date().toISOString()
  };

  travelLogs.value[index].comments.push(newCommentObj);
  newComment.value[index] = '';
  saveTravelLogs();
};

// 格式化日期
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// 切换标签选择
const toggleTag = (tag) => {
  if (newLogTags.value.includes(tag)) {
    newLogTags.value = newLogTags.value.filter(t => t !== tag);
  } else {
    newLogTags.value.push(tag);
  }
};

// 处理文件上传
const handleFileUpload = (event) => {
  const files = event.target.files;
  if (!files.length) return;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        newLogImages.value.push(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  // 清空input，允许重复选择同一文件
  fileInput.value.value = '';
};

// 移除图片
const removeImage = (index) => {
  newLogImages.value.splice(index, 1);
};

// 发布日志
const publishLog = () => {
  if (!newLogTitle.value || !newLogContent.value) {
    alert('请填写标题和内容');
    return;
  }

  if (newLogTags.value.length === 0) {
    alert('请至少选择一个标签');
    return;
  }

  const newLog = {
    title: newLogTitle.value,
    content: newLogContent.value,
    username: currentUser?.username || '游客',
    tags: newLogTags.value,
    images: newLogImages.value,
    date: new Date().toISOString(),
    likes: 0,
    isLiked: false,
    comments: [],
    showComments: false
  };

  travelLogs.value.unshift(newLog); // 添加到日志列表开头
  saveTravelLogs();

  // 清空表单
  newLogTitle.value = '';
  newLogContent.value = '';
  newLogTags.value = [];
  newLogImages.value = [];

  // 显示成功提示
  alert('日志发布成功！');
};

// 打开图片查看器
const openImageViewer = (images, index) => {
  viewerImages.value = images;
  currentImageIndex.value = index;
  currentImage.value = images[index];
  showImageViewer.value = true;
  document.body.style.overflow = 'hidden'; // 禁止背景滚动
};

// 关闭图片查看器
const closeImageViewer = () => {
  showImageViewer.value = false;
  document.body.style.overflow = ''; // 恢复背景滚动
};

// 上一张图片
const prevImage = () => {
  currentImageIndex.value = (currentImageIndex.value - 1 + viewerImages.value.length) % viewerImages.value.length;
  currentImage.value = viewerImages.value[currentImageIndex.value];
};

// 下一张图片
const nextImage = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % viewerImages.value.length;
  currentImage.value = viewerImages.value[currentImageIndex.value];
};
</script>

<style scoped>
/* 可添加日志页面样式 */
.tag-item {
  transition: all 0.2s ease;
}

.log-item {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.log-item:hover {
  transform: translateY(-2px);
}

.comment-input:focus {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.2);
}

.image-viewer {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>