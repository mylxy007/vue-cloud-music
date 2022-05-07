<template>
    <el-carousel
        :interval="4000"
        type="card"
        height="230px"
        class="banner_container"
        indicator-position="outside"
    >
        <el-carousel-item v-for="item in bannerList" :key="item.url">
            <img :src="item.imageUrl" class="banner_img" />
        </el-carousel-item>
    </el-carousel>
</template>

<script>
export default {
    name: "Banner",
    data() {
        return {
            bannerList: [],
        };
    },
    mounted() {
        this.getBanner();
    },
    methods: {
        async getBanner() {
            const result = await this.$API.home.reqBanner();
            if (result.code === 200) {
                this.bannerList = result.banners;
            }
        },
    },
};
</script>

<style scoped>
.banner_container {
    width: 80%;
}

.banner_img {
    width: 100%;
    height: 100%;
}
</style>