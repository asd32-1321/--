const express = require('express');
const app = express();
const port = 3000;

// 模拟景点数据
let places = [
    {
      name: '黄山',
      image: 'https://tse3-mm.cn.bing.net/th/id/OIP-C.XNdH8E-90NnzQTCLyK9kBgHaE8?w=261&h=180&c=7&r=0&o=5&dpr=1.5&pid=1.7',
      description: '黄山以奇松、怪石、云海、温泉“四绝”闻名于世，有“五岳归来不看山，黄山归来不看岳”之名。',
      likes: 0,
      isLiked: false,
      rating: 0,
      ratingsCount: 0
    },
    {
      name: '张家界',
      image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.aIGPTYUXFint77jzmxo4XgHaE8?w=259&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2',
      description: '张家界奇峰异石林立，拥有中国第一个国家森林公园——张家界国家森林公园，是电影《阿凡达》中“哈利路亚山”的原型取景地。',
      likes: 0,
      isLiked: false,
      rating: 0,
      ratingsCount: 0
    },
    {
      name: '三亚',
      image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.C_BlThFcm_vKsebTNpxYpwHaE8?w=240&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2',
      description: '三亚是中国著名的海滨旅游城市，有美丽的海滩、温暖的气候和丰富的海鲜，是度假的好去处。',
      likes: 0,
      isLiked: false,
      rating: 0,
      ratingsCount: 0
    },
    {
      name: '桂林',
      image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.5HjektOIikSBU1vw0JVKwgHaE8?w=240&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2',
      description: '桂林山水甲天下，漓江两岸的山峰奇特，江水清澈，乘坐竹筏游览漓江是一种非常美妙的体验。',
      likes: 0,
      isLiked: false,
      rating: 0,
      ratingsCount: 0
    },
    {
      name: '成都',
      image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.xJoRzuYca30Fg9xFbvuQ4wHaFF?w=245&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2',
      description: '成都是一座充满生活气息的城市，有可爱的大熊猫、美味的川菜和悠闲的茶馆文化，让人来了就不想走。',
      likes: 0,
      isLiked: false,
      rating: 0,
      ratingsCount: 0
    },
    {
      name: '杭州',
      image: 'https://ts1.tc.mm.bing.net/th/id/OIP-C.ymxme5eaVMaoXAC5w92J2gHaE7?w=242&h=211&c=8&rs=1&qlt=90&o=6&dpr=1.5&pid=3.1&rm=2',
      description: '杭州有美丽的西湖，湖光山色，风景如画，还有灵隐寺、岳王庙等历史文化古迹。',
      likes: 0,
      isLiked: false,
      rating: 0,
      ratingsCount: 0
    }
  ];

app.use(express.json());

// 获取所有景点数据
app.get('/places', (req, res) => {
    res.json(places);
});

// 更新景点数据
app.put('/places/:name', (req, res) => {
    const name = req.params.name;
    const { likes, rating, ratingsCount } = req.body;
    const place = places.find(p => p.name === name);
    if (place) {
        if (likes !== undefined) {
            place.likes = likes;
        }
        if (rating !== undefined) {
            place.rating = rating;
        }
        if (ratingsCount !== undefined) {
            place.ratingsCount = ratingsCount;
        }
        res.json(place);
    } else {
        res.status(404).json({ message: '景点未找到' });
    }
});

app.listen(port, () => {
    console.log(`服务器运行在 http://localhost:${port}`);
});