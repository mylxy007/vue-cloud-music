import request from '@/utils/request'
// 获取轮播图接口
export const reqBanner = (type = 0) => request({
    url: '/banner',
    method: 'get',
    params: {
        type
    }
})
// 推荐歌单接口
export const reqRecommendPlayList = (limit) => request({
    url: '/personalized',
    method: 'get',
    params: {
        limit
    }
})