<template>
    <div class="player_container">
        <div class="player_info">
            <img :src="currentMusicInfo.al.picUrl" class="player_img" />
            <div class="player_name_and_author">
                <span class="player_name">{{ currentMusicInfo.name }}</span>
                <span class="player_author">{{
                    currentMusicInfo.ar[0].name
                }}</span>
            </div>
            <div class="player_star"></div>
        </div>
        <div class="player_center_control_buttons">
            <button
                class="iconfont icon-shangyishou player_icon_prev"
                @click="prevMusic"
                title="上一首"
            ></button>
            <button
                class="iconfont icon-bofang1 player_icon_play"
                v-if="!isPlay"
                @click="playMusic"
                title="播放"
            ></button>
            <button
                class="iconfont icon-weibiaoti519 player_icon_pause"
                v-else
                @click="pauseMusic"
                title="暂停"
            ></button>
            <button
                class="iconfont icon-xiayishou player_icon_next"
                @click="nextMusic"
                title="下一首"
            ></button>
        </div>
        <div class="player_right_control_buttons">
            <button
                class="iconfont icon-yinlebofangliebiao player_icon_list"
                title="播放列表"
            ></button>
            <button
                v-if="playType === 0"
                class="iconfont icon-xunhuanbofang player_icon_xunhuan"
                :style="{ color: playType === 0 ? 'blue' : 'black' }"
                title="循环播放"
                @click="changePlayType(1)"
            ></button>
            <button
                v-else-if="playType === 1"
                class="iconfont icon-danquxunhuan player_icon_danqu"
                :style="{ color: playType === 1 ? 'blue' : 'black' }"
                title="循环播放"
                @click="changePlayType(2)"
            ></button>
            <button
                v-else-if="playType === 2"
                class="iconfont icon-suijibofang player_icon_shuiji"
                title="随机播放"
                :style="{ color: playType === 2 ? 'blue' : 'black' }"
                @click="changePlayType(0)"
            ></button>
            <button
                v-show="!muted"
                class="iconfont icon-yinliang player_icon_yinliang"
                title="音量"
                @click="isMuted(true)"
            ></button>
            <button
                v-show="muted"
                class="iconfont icon-jinyin player_icon_jinyin"
                title="静音"
                @click="isMuted(false)"
            ></button>
            <div class="player_block">
                <el-slider v-model="value1"></el-slider>
            </div>
            <button
                class="el-icon-arrow-up player_icon_lyric"
                title="歌词"
                @click="showDrawer"
            ></button>
        </div>
        <div class="player_progress">
            <div class="player_progress_container">
                <div
                    class="player_progress_fill"
                    :style="{ width: width + '%' }"
                >
                    <div
                        class="player_slider_button"
                        @mousedown="sliderButtonDown"
                        @mouseup="windowMouseup"
                    ></div>
                </div>
            </div>
        </div>
        <audio
            :src="musicUrl"
            ref="audio"
            @ended="ended"
            @timeupdate="timeupdate"
        ></audio>
        <Lyric :currentTime="currentTime"></Lyric>
    </div>
</template>

<script>
import { debounce, throttle } from "lodash-es";
import Lyric from "../Lyric";
import { mapGetters, mapState } from "vuex";
export default {
    name: "Player",
    components: {
        Lyric,
    },
    data() {
        return {
            value1: 10, //音量
            musicUrl: "", //正在播放音乐的url
            isPlay: false, //标识播放还是暂停
            width: 0, //进度条填充部分长度
            time: null, //节流控制
            isPress: false, //标识进度条小圆点是否按下
            drawer: false, //控制歌词界面
            playType: 0, //0：循环播放，1：单曲循环，2：随机播放，默认循环播放
            muted: false, //控制静音，true 为静音
            musicId: "", //当前音乐id
            currentTime: 0,
        };
    },
    mounted() {
        // window 绑定鼠标监听事件
        window.addEventListener("mousemove", this.windowMousemove);
        window.addEventListener("mouseup", this.windowMouseup);
        this.$bus.$on("play", () => {
            this.getMusicUrl();
        });
    },
    computed: {
        // 获取仓库中的数据
        ...mapState("music", ["trackList", "currentMusicIndex", "length"]),
        ...mapGetters("music", ["currentMusicId"]),
        // 正在播放音乐的信息，跟随index变化
        currentMusicInfo() {
            return (
                this.trackList[this.currentMusicIndex] || {
                    al: {},
                    ar: [{}],
                }
            );
        },
    },
    watch: {
        value1() {
            this.$refs.audio.volume = this.value1 / 100;
        },
        currentMusicIndex() {
            this.getMusicUrl();
        },
    },
    methods: {
        // 获取音乐url
        async getMusicUrl() {
            // 清空数据
            this.musicUrl = "";
            this.width = 0;
            // 发送请求，获取url
            const result = await this.$API.playList.reqMusicUrl(
                this.currentMusicId
            );
            if (result.code === 200) {
                this.musicUrl = result.data[0].url;
            }
            // 获取的音乐url为空
            if (!this.musicUrl) {
                this.$message("无法播放该歌曲");
                return;
            } else {
                // 标识正在播放
                this.isPlay = true;
                // 视图更新后再播放，不然使用play方法会报错
                this.$nextTick(
                    // 防抖
                    debounce(() => {
                        this.$refs.audio && this.$refs.audio.play();
                        this.$refs.audio &&
                            (this.$refs.audio.volume = this.value1 / 100);
                    }, 2000)
                );
            }
        },
        // 播放音乐按钮的回调
        playMusic() {
            if (this.musicUrl) {
                this.$refs.audio.play();
                this.isPlay = true;
            } else {
                this.$message({
                    type: "info",
                    message: "请选择一首音乐",
                });
            }
        },
        // 暂停音乐按钮的回调
        pauseMusic() {
            // 暂停音乐
            this.$refs.audio.pause();
            this.isPlay = false;
        },
        //上一首按钮的回调
        prevMusic() {
            let { currentMusicIndex, length } = this;
            if (this.playType === 0) {
                // 循环播放，判断边界
                currentMusicIndex =
                    currentMusicIndex === 0
                        ? length - 1
                        : currentMusicIndex - 1;
            } else if (this.playType === 2) {
                //随机播放 确保下一首和当前这一首不重复
                let ran = parseInt(Math.random() * length);
                while (ran == currentMusicIndex) {
                    ran = parseInt(Math.random() * length);
                }
                currentMusicIndex = ran;
            }
            //如果上面都不执行，那就是单曲循环模式
            this.$store.commit(
                "music/SAVECURRENTMUSICINDEX",
                currentMusicIndex
            );
        },
        // 下一首按钮的回调
        nextMusic() {
            let { currentMusicIndex, length } = this;
            if (this.playType === 0) {
                //循环播放
                // 循环播放，判断边界
                currentMusicIndex =
                    currentMusicIndex === length - 1
                        ? 0
                        : currentMusicIndex + 1;
            } else if (this.playType === 2) {
                //随机播放 确保下一首和当前这一首不重复
                let ran = parseInt(Math.random() * length);
                while (ran == currentMusicIndex) {
                    ran = parseInt(Math.random() * length);
                }
                currentMusicIndex = ran;
            }
            //如果上面都不执行，那就是单曲循环模式
            this.$store.commit(
                "music/SAVECURRENTMUSICINDEX",
                currentMusicIndex
            );
        },
        // 音乐播放结束
        ended() {
            // 自动播放下一首
            this.nextMusic();
        },
        // 音乐播放时间发生变化
        timeupdate() {
            this.currentTime = this.$refs.audio.currentTime;
            if (!this.isPress) {
                // 进图条动态改变，为当前时间和总时长的比值
                let currentTime =
                    this.$refs.audio && this.$refs.audio.currentTime; //确保audio加载完毕
                let duration = this.$refs.audio && this.$refs.audio.duration;
                this.width = (currentTime / duration) * 100;
                this.time = null;
            }
        },
        // 进度条小圆点被按下
        sliderButtonDown() {
            this.isPress = true;
        },
        //window 监听鼠标移动事件的回调
        windowMousemove(e) {
            let htmlWidth = document.documentElement.clientWidth;
            if (this.isPress) {
                let x = e.x;
                this.width = (x / htmlWidth) * 100;
            }
        },
        // 鼠标左键松开
        windowMouseup() {
            // 如果进度条的小圆点是被压下的状态时，松开鼠标左键后，当前音乐时间发送改变
            if (this.isPress) {
                this.isPress = false;
                this.$refs.audio.currentTime =
                    (this.$refs.audio.duration * this.width) / 100;
            }
        },
        // 显示歌词界面
        showDrawer() {
            if (this.musicUrl) {
                this.$bus.$emit("showDrawer");
            } else {
                this.$message("请选择一首音乐");
            }
        },
        // 切换音乐播放模式
        changePlayType(type) {
            this.playType = type;
        },
        // 控制静音
        isMuted(muted) {
            // 静音
            this.$refs.audio.muted = muted;
            this.muted = muted;
        },
    },
    beforeDestroy() {
        clearInterval(this.time);
    },
};
</script>

<style scoped>
/* 清除button按钮默认样式 */
button {
    border: 0;
    background: #fff;
    padding: 0;
    margin: 0;
}
/* 播放器区域样式 */
.player_container {
    position: relative;
    display: flex;
    padding: 0 192px;
    font-size: 16px;
}
/* 左侧区域样式 */
.player_info {
    flex: 1;
    display: flex;
    height: 70px;
    align-items: center;
}
.player_name_and_author {
    display: flex;
    flex-direction: column;
    font-size: 16px;
    margin-left: 10px;
    white-space: nowrap;
    /* text-overflow: ellipsis;
    overflow: hidden; */
}
.palyer_author {
    font-size: 12px;
    text-align: left;
}
.player_img {
    width: 46px;
    height: 46px;
    border-radius: 5px;
}
/* 清除 img标签 src为空时，默认的边框 */
img[src=""],
img:not([src]) {
    opacity: 0;
}
/* 中间区域样式 */
.player_center_control_buttons {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.player_icon_prev,
.icon-xiayishou,
.player_icon_play,
.player_icon_pause {
    width: 30px;
    height: 30px;
    font-size: 30px;
    line-height: 30px;
    text-align: center;
    border-radius: 10px;
}
.player_icon_prev:hover,
.icon-xiayishou:hover,
.player_icon_play:hover,
.player_icon_pause:hover {
    cursor: pointer;
    background: #999;
}
.player_icon_play {
    width: 42px;
    height: 42px;
    line-height: 42px;
    font-size: 40px;
    margin: 0 10px;
}
.player_icon_pause {
    width: 42px;
    height: 42px;
    line-height: 42px;
    font-size: 36px;
    margin: 0 10px;
}
.player_right_control_buttons {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: right;
}
.player_icon_yinliang,
.player_icon_jinyin,
.player_icon_shuiji,
.player_icon_xunhuan,
.player_icon_danqu,
.player_icon_list,
.player_icon_lyric {
    width: 30px;
    height: 30px;
    font-size: 20px;
    line-height: 30px;
    text-align: center;
    border-radius: 10px;
    margin: 0 5px;
}
/* 右边按钮动态改变颜色 */
.right_color {
    color: blue;
}
.player_icon_yinliang:hover,
.player_icon_jinyin:hover,
.player_icon_shuiji:hover,
.player_icon_xunhuan:hover,
.player_icon_danqu:hover,
.player_icon_list:hover,
.player_icon_lyric:hover {
    cursor: pointer;
    background: #999;
}
.player_block {
    width: 100px;
    margin-left: 10px;
}
>>> .el-tooltip {
    border: 1px solid #eee;
    width: 10px;
    height: 10px;
}
>>> .el-slider__bar {
    background: #000;
}
.player_progress {
    position: absolute;
    left: -20px;
    transform: translate(0, -50%);
    width: calc(100% + 40px);
    height: 30px;
}
.player_progress_container {
    position: absolute;
    width: 100%;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    height: 3px;
    background: #999;
}
.player_progress_fill {
    position: absolute;
    left: 0;
    top: 0;
    height: 3px;
    background: blue;
}
.player_slider_button {
    display: none;
    position: absolute;
    right: 0;
    top: 48%;
    transform: translate(50%, -50%);
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #fff;
}
.player_progress:hover .player_slider_button {
    display: block;
    cursor: pointer;
}
</style>