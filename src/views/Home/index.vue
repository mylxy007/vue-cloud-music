<template>
    <div class="home_container">
        <Banner></Banner>
        <PlayList></PlayList>
        <ForYou></ForYou>
    </div>
</template>

<script>
import PlayList from "./PlayList";
import Banner from "./Banner";
import ForYou from "./ForYou";
export default {
    name: "Home",
    components: {
        PlayList,
        Banner,
        ForYou,
    },
};
</script>

<style scoped>
.home_container {
    display: flex;
    flex-direction: column;
    align-items: center;
}
</style>