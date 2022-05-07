import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex);
import music from './music'
export default new Vuex.Store({
    modules: {
        music
    }
})