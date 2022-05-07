<template>
    <div class="playlist_container">
        <div class="playlist_header">
            <h2>推荐歌单</h2>
        </div>
        <div class="playlist_main">
            <div class="playlist_item" v-for="item in playList" :key="item.id">
                <div class="playlist_img" @click="toDetail(item.id)">
                    <img :src="item.picUrl" />
                    <div class="video-play-icon">
                        <i class="iconfont icon-bofang"></i>
                    </div>
                </div>
                <span class="play_count"
                    ><i class="el-icon-video-play"></i
                    >{{ (item.playCount / 10000).toFixed(1) }}万</span
                >
                <span class="play_title">{{ item.name }}</span>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "PlayList",
    data() {
        return {
            playList: [],
        };
    },
    mounted() {
        // 初始化，获取数据
        this.getData();
    },
    methods: {
        // 获取推荐歌单数据
        async getData() {
            const result = await this.$API.home.reqRecommendPlayList(10);
            if (result.code === 200) {
                this.playList = result.result;
            }
        },
        // 跳转到歌单详情页面
        toDetail(id) {
            this.$router.push({
                path: "/plDetail",
                query: {
                    id,
                },
            });
        },
    },
};
</script>

<style scoped>
.playlist_container {
    width: 80%;
}
.playlist_header {
    text-align: left;
    font-size: 20px;
}
.playlist_main {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
}
.playlist_item {
    width: 18%;
    /* height: 4.375rem; */
    display: flex;
    flex-direction: column;

    margin-bottom: 50px;
}
.playlist_img {
    position: relative;
    width: 100%;
    /* height: 3.5938rem; */
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
}
.playlist_img img {
    width: 100%;
    height: 100%;
}
.video-play-icon {
    display: none;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
}
.playlist_img:hover .video-play-icon {
    display: block;
}
.video-play-icon:hover {
    background: rgba(255, 255, 255, 0.7);
}
.icon-bofang {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-43%, -50%);
    font-size: 24px;
    color: #fff;
}
.play_count {
    font-size: 12px;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.play_title {
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    text-align: left;
    font-size: 16px;
}
.play_title:hover {
    text-decoration: underline;
    cursor: pointer;
}
</style>