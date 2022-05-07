// 存储音乐相关信息
const actions = {}
const mutations = {
    SAVETRACKLIST(state, trackList) {
        state.trackList = trackList;
        state.length = trackList.length;
    },
    SAVECURRENTMUSICINDEX(state, index) {
        state.currentMusicIndex = index;
    }
}
const state = {
    currentMusicIndex: -1,
    // currentMusicId: -1,
    history: [], //历史播放记录
    trackList: [], //播放列表
    length: 0, //播放列表长度
}
const getters = {
    currentMusicId(state) {
        return state.trackList[state.currentMusicIndex] && state.trackList[state.currentMusicIndex].id
    },
    currentMusicInfo(state) {
        return state.trackList[state.currentMusicIndex] || {
            al: {},
            ar: []
        }
    }
}

export default {
    namespaced: true,
    actions,
    mutations,
    state,
    getters
}