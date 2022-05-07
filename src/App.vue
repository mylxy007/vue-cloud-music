<template>
    <el-container>
        <el-header height="80px">Header</el-header>
        <el-container>
            <el-aside width="300px">
                <el-menu default-active="2" class="el-menu-vertical-demo">
                    <el-menu-item index="1">
                        <template slot="title">
                            <router-link to="/home">首页</router-link>
                        </template>
                    </el-menu-item>
                    <el-menu-item index="2">
                        <span slot="title">导航二</span>
                    </el-menu-item>
                    <el-menu-item index="3">
                        <span slot="title">导航三</span>
                    </el-menu-item>
                    <el-menu-item index="4">
                        <span slot="title">导航四</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
        <el-footer height="70px">
            <Player></Player>
        </el-footer>
    </el-container>
</template>

<script>
import Home from "@/views/Home";
import Player from "@/components/Player";
export default {
    name: "App",
    components: {
        Home,
        Player,
    },
};
</script>

<style>
html,
body,
#app,
.el-container {
    padding: 0px;
    margin: 0px;
    height: 100%;
    overflow: hidden;
    min-width: 768px;
}

.el-header,
.el-footer {
}

.el-aside {
    background-color: #d3dce6;
    text-align: center;
}

.el-main {
    background: var(--color-body-bg);
    text-align: center;
}
:root {
    --color-body-bg: #fff;
    --color-text: #000;
    --color-primary: #335eea;
    --color-primary-bg: #eaeffd;
    --color-secondary: #7a7a7b;
    --color-secondary-bg: #f5f5f7;
    --color-navbar-bg: hsla(0, 0%, 100%, 0.86);
    --color-primary-bg-for-transparent: rgba(189, 207, 255, 0.28);
    --color-secondary-bg-for-transparent: rgba(209, 209, 214, 0.28);
    --html-overflow-y: overlay;
}
</style>
