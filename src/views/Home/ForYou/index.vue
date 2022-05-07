<template>
    <div class="foryou_container">
        <div class="foryou_header">
            <h2>For You</h2>
        </div>
        <div class="foryou_main">
            <div class="foryou_recommend">
                <img src="@/assets/image/84463.jpg" class="img" />
                <div class="title">
                    <span>每</span>
                    <span>日</span>
                    <span>推</span>
                    <span>荐</span>
                </div>
                <div class="video-play-icon">
                    <i class="iconfont icon-bofang"></i>
                </div>
            </div>
            <div class="foryou_fm"></div>
        </div>
    </div>
</template>

<script>
export default {
    name: "ForYou",
};
</script>

<style scoped>
/* ForYou容器样式 */
.foryou_container {
    width: 80%;
}
/* 头部区域样式 */
.foryou_header {
    text-align: left;
    font-size: 20px;
}
/* 主体区域样式 */
.foryou_main {
    display: flex;
    /* height: 200px; */
    justify-content: space-between;
}
/* 左边每日推荐样式 */
.foryou_recommend {
    position: relative;
    width: 49%;
    height: 180px;
    border: 1px solid;
    border-radius: 20px;
    overflow: hidden;
}
.foryou_recommend img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
}
.title {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translate(0, -50%);
    width: 140px;
    height: 140px;
    display: flex;
    flex-wrap: wrap;
    margin-left: 30px;
    font-weight: 700;
    color: #fff;
}
.title span {
    width: 50%;
    font-size: 50px;
    line-height: 70px;
}
/* 播放按钮样式 */
.video-play-icon {
    position: absolute;
    right: 10px;
    bottom: 10px;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
}
.icon-bofang {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-43%, -50%);
    font-size: 18px;
    color: #fff;
}
.video-play-icon:hover {
    background: rgba(255, 255, 255, 0.7);
}
/* 右边 fm 区域样式 */
.foryou_fm {
    width: 48%;
    height: 180px;
    border: 1px solid;
    border-radius: 20px;
}
</style>