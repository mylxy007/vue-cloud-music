<template>
    <div class="pl_detail_container">
        <!-- 头部区域 -->
        <div class="pl_detail_header">
            <div class="pl_img">
                <img :src="playlist.coverImgUrl" />
            </div>
            <div class="pl_info">
                <h3 class="title">{{ playlist.name }}</h3>
                <span class="pl_author">{{ playlist.creator.nickname }}</span>
                <span class="pl_date">{{ timeStr }}</span>
                <span class="pl_desc">{{ description }}</span>
                <div class="button">
                    <el-button type="primary" plain
                        ><i class="iconfont icon-bofang bofang"></i
                        >播放</el-button
                    >
                    <el-button icon="el-icon-star-off"></el-button>
                    <el-button icon="el-icon-more"></el-button>
                </div>
            </div>
        </div>
        <!-- 歌曲列表区域 -->
        <div class="pl_detail_list">
            <div
                :class="{
                    active: currentMusicIndex === index,
                    list_item: true,
                }"
                v-for="(item, index) in trackList"
                :key="index"
                @click="sendMusciInfo(index)"
            >
                <div class="song_index">
                    {{ index + 1 >= 10 ? index + 1 : "0" + (index + 1) }}
                </div>
                <div class="song_img">
                    <img :src="item.al.picUrl" />
                </div>
                <div class="song_info">
                    <div class="song_title">{{ item.name.trim() }}</div>
                    <div class="song_author">
                        <a
                            href=""
                            v-for="(author, index) in item.ar"
                            :key="author.id + index"
                            >{{
                                index + 1 === item.ar.length
                                    ? author.name
                                    : author.name + ", "
                            }}</a
                        >
                    </div>
                </div>
                <a class="song_url">{{ item.name.trim() }}</a>

                <div class="song_time">
                    {{
                        Math.floor(item.dt / 60000) +
                        ":" +
                        Math.floor((item.dt / 1000) % 60)
                    }}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
// 引入第三方库 dayjs
import dayjs from "dayjs";
import { mapState } from "vuex";
export default {
    name: "PLDetail",
    data() {
        return {
            playlist: { creator: {} }, //歌单详情信息
            trackList: [], //歌单所有音乐
        };
    },
    mounted() {
        this.getPLDetail();
    },
    methods: {
        // 初始化获取数据
        async getPLDetail() {
            // 获取歌单详情
            const result = await this.$API.playList.reqPlayListDetail(
                this.$route.query.id
            );
            if (result.code === 200) {
                this.playlist = result.playlist;
            }
            // 获取歌单所有音乐id
            const result2 = await this.$API.playList.reqPlayListAllTrack(
                this.$route.query.id
            );
            if (result2.code === 200) {
                this.trackList = result2.songs;
                // 把trackList保存到store中
                this.$store.commit("music/SAVETRACKLIST", result2.songs);
            }
        },
        // 修改仓库中当前播放歌曲的下标
        sendMusciInfo(index) {
            // 点击的是同一首音乐
            if (this.currentMusicIndex === index) {
                this.$bus.$emit("play");
                return;
            }
            this.$store.commit("music/SAVECURRENTMUSICINDEX", index);
        },
    },
    computed: {
        ...mapState("music", ["currentMusicIndex"]),
        // 最后更新时间
        timeStr() {
            let year = dayjs(this.playlist.updateTime).get("year");
            let month = dayjs(this.playlist.updateTime).get("month");
            let date = dayjs(this.playlist.updateTime).get("date");
            return `最后更新于${year}年${month}月${date}日 · ${this.playlist.trackCount}首歌`;
        },
        // 歌单描述，取出\n
        description() {
            let desc = this.playlist.description || "";
            return desc.replace(/\n/g, "");
        },
    },
};
</script>

<style scoped>
/* 头部区域样式 */
.pl_detail_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    min-width: 810px;
}
.pl_detail_header {
    display: flex;
    width: 90%;
    height: 280px;
}
.pl_img {
    width: 280px;
    height: 280px;
    border-radius: 20px;
    overflow: hidden;
}
.pl_img img {
    width: 100%;
    height: 100%;
}
.pl_info {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 56px;
}
.pl_info .title {
    margin: 20px 0;
    font-size: 36px;
}
.pl_author {
    font-size: 18px;
    margin-bottom: 5px;
}
.pl_date {
    font-size: 14px;
    color: #333c;
}

.pl_desc {
    /* height: 0.8438rem; */
    min-height: 48px;
    margin: 20px 0;
    font-size: 14px;
    text-align: left;
    color: #333c;
    /* 超过三行 省略号表示 */
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    word-break: break-all;
}
.button {
    display: flex;
    width: 100%;
    height: 40px;
}
>>> .el-button {
    display: flex;
    font-size: 18px;
    font-weight: 700;
    align-items: center;
}
.bofang {
    margin-right: 10px;
}
/* 歌曲列表区域样式 */
.pl_detail_list {
    display: flex;
    flex-direction: column;
    width: 90%;
    margin-top: 50px;
}
.list_item {
    display: flex;
    align-items: center;
    height: 64px;
    border-radius: 10px;
    /* border: 1px solid blue; */
}
.list_item:hover {
    background: var(--color-primary-bg);
}
.active {
    background: var(--color-primary-bg);
}
.song_index {
    margin: 0 20px;
    color: #999;
}
.song_img {
    width: 48px;
    height: 48px;
    line-height: 48px;
    margin-left: 10px;
}
.song_img img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
}
.song_info {
    flex: 1;
    display: flex;
    height: 40px;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-start;
    margin-left: 20px;
}
.song_title {
    font-size: 18px;
    font-weight: 700;
    text-align: left;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
}
.song_author {
    font-size: 12px;
    text-align: left;
}
.song_author a {
    text-decoration: none;
    color: #000;
}
.song_author a:hover {
    text-decoration: underline;
}
.song_url {
    flex: 1;
    font-size: 16px;
    text-decoration: none;
    text-align: left;
}
.song_url:hover {
    text-decoration: underline;
}
.song_time {
    width: 60px;
    height: 19px;
    font-size: 16px;
    text-align: left;
}
</style>