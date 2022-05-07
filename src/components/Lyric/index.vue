<template>
    <el-drawer
        :withHeader="false"
        :visible.sync="drawer"
        :direction="direction"
        class="drawerClass"
        size="100%"
        :modal="false"
    >
        <div class="lyric_container">
            <i class="el-icon-arrow-down icon_close" @click="closeLyric"></i>
            <!-- 歌词区域 -->
            <div class="lyric_info">
                <div class="lyric_cover">
                    <div class="img">
                        <img :src="currentMusicInfo.al.picUrl" />
                    </div>
                </div>
                <div class="lyric_detail">
                    <div class="lyric_box">
                        <h2 class="lyric_title">{{ currentMusicInfo.name }}</h2>
                        <div class="lyric_author">
                            歌手：<span
                                v-for="(author, index) in currentMusicInfo.ar"
                                :key="author.id"
                                >{{
                                    index + 1 === currentMusicInfo.ar.length
                                        ? author.name
                                        : author.name + ", "
                                }}</span
                            >
                        </div>
                        <div class="lyric_main">
                            <ul
                                :class="{
                                    lyric_ul: true,
                                    lyric_ul_transition: isTransition,
                                }"
                                ref="lyricUL"
                                :style="{
                                    transform:
                                        'translateY(' + translate + 'px)',
                                }"
                            >
                                <li
                                    v-for="(item, index) in lyricArr"
                                    :key="index"
                                    :class="{
                                        active_color: lyricIndex == index,
                                    }"
                                >
                                    {{ item }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 评论区域 -->
            <div class="lyric_comment"></div>
        </div>
    </el-drawer>
</template>

<script>
import { mapGetters } from "vuex";
import timeFormat from "@/utils/timeFormat";
export default {
    name: "Lyric",
    data() {
        return {
            direction: "btt", //歌词界面打开方向
            drawer: false,
            lyricArr: [], //存放歌词的数组
            timeArr: [], //存放每句歌词所对应的时间的数组
            lyricIndex: 0, //当前那句歌词的下标
            translate: 0, //歌词偏移量
            isTransition: false,
        };
    },
    props: ["currentTime"],
    mounted() {
        // 绑定事件，打开歌词界面
        this.$bus.$on("showDrawer", this.showDrawer);
    },
    computed: {
        ...mapGetters("music", ["currentMusicId", "currentMusicInfo"]),
    },
    watch: {
        currentMusicId() {
            // 清空，歌词滚动回到初始，切换歌曲是取消动画
            this.translate = 0;
            this.lyricIndex = 0;
            this.isTransition = false;
            // 只有打开歌词界面才开始获取歌词
            if (this.drawer) this.getLyric();
        },
        // 监听音乐时间的变化
        currentTime() {
            let index = 0;
            // 找到当前播放音乐所对应的那句歌词 用音乐时间与歌词对应的时间片比较
            for (var i = this.lyricIndex; i < this.timeArr.length; i++) {
                if (this.currentTime <= this.timeArr[i]) {
                    index = i - 1;
                    break;
                }
            }
            // 最后一句时 保持高亮
            if (i == this.timeArr.length) {
                this.lyricIndex = this.timeArr.length - 1;
            } else this.lyricIndex = index; //保存当前歌词的下标，方便下次查找，提高查找效率
            if (this.lyricIndex === this.timeArr.length - 1) {
                this.isTransition = false;
            }
            // 使高亮歌词保持在中间位置
            if (index >= 4) {
                this.translate = -(index - 4) * 50;
            }
        },
    },
    methods: {
        // 获取音乐歌词
        async getLyric() {
            // 发送请求
            const result = await this.$API.music.reqLyric(this.currentMusicId);
            if (result.code === 200) {
                // 处理数据
                let strArr = result.lrc.lyric.split("\n");
                console.log(result);
                // 删除最后一个空元素
                strArr.length = strArr.length - 1;
                // 拿到歌词对应时间的数组
                this.timeArr = timeFormat(strArr);
                // 拿到歌词数组
                this.lyricArr = strArr.map((item) => {
                    let start = item.indexOf("]") + 1;
                    let end = item.length;
                    return item.slice(start, end).trim();
                });
                // 删除掉歌词数组里面的空元素
                this.lyricArr.forEach((item, index) => {
                    if (item.length === 0) {
                        this.$delete(this.lyricArr, index);
                        this.$delete(this.timeArr, index);
                    }
                });
                // 开启歌词滚动动画
                this.isTransition = true;
            }
        },
        // 打开歌词界面，并获取数据
        showDrawer() {
            this.drawer = true;
            this.getLyric();
        },
        //关闭歌词界面
        closeLyric() {
            this.drawer = false;
        },
    },
};
</script>

<style scoped>
/* 抽屉组件样式 */
.drawerClass {
    background: #f9f9f9;
    width: 100%;
    height: calc(100% - 72px);
}
.lyric_container {
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
}
/* 右上角关闭图标样式 */
.icon_close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 30px;
    height: 30px;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    border-radius: 10px;
}
.icon_close:hover {
    cursor: pointer;
    background: #999;
}
.lyric_info {
    display: flex;
    height: 80vh;
}
/* 封面图片选择动画 */
@keyframes rotate {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}
/* 封面区域样式 */
.lyric_cover {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 45%;
}
/* 转盘样式 */
.lyric_cover .img {
    position: relative;
    width: 350px;
    height: 350px;
    border-radius: 50%;
    background: #e6e5e6;
    animation: rotate 6s linear 0s infinite;
}
.lyric_cover .img::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 330px;
    height: 330px;
    border-radius: 50%;
    background: #000;
}
.img img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 250px;
    height: 250px;
    border-radius: 50%;
    z-index: 9;
}
/* 歌词区域样式 */
.lyric_detail {
    display: flex;
    width: 55%;
    overflow: hidden;
    align-items: center;
}
.lyric_box {
    height: 70%;
    margin-left: 100px;
    overflow: hidden;
}
.lyric_title {
    font-size: 30px;
    margin: 0 0 0 10px;
}
.lyric_author {
    margin: 20px 0 20px 10px;
}
.lyric_main {
    overflow: hidden;
}
.lyric_ul {
    list-style: none;
    margin: 0;
    padding: 0;
}
/* 歌词滚动时添加过渡动画 */
.lyric_ul_transition {
    transition: transform 1s linear 0s;
}
.lyric_ul .active_color {
    color: blue;
    font-size: 24px;
}
.lyric_ul li {
    height: 40px;
    line-height: 40px;
    font-size: 18px;
    border-radius: 10px;
    padding: 5px 10px;
}
.lyric_ul li:hover {
    background: #e6e5e6;
}
</style>