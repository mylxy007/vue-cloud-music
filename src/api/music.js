// 音乐相关信息模块
import request from "@/utils/request";

// 获取音乐歌词
export const reqLyric = (musicId) => request({
    url: '/lyric',
    method: 'get',
    params: {
        id: musicId
    }
})