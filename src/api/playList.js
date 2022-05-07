import request from "@/utils/request";
// 歌单相关接口
// 歌单详情接口
export const reqPlayListDetail = (id) => request({
    url: '/playlist/detail',
    method: 'get',
    params: {
        id
    }
})
// 获取歌单所有音乐
export const reqPlayListAllTrack = (id) => request({
    url: '/playlist/track/all',
    method: 'get',
    params: {
        id
    }
})
// 获取音乐url
export const reqMusicUrl = (musicId) => request({
    url: '/song/url',
    method: 'get',
    params: {
        id: musicId
    }
})