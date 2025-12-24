import { createStore } from "vuex";
import menu from './menu'
import createPersistedstate from 'vuex-persistedstate'

export default createStore({
    plugins: [new createPersistedstate({
        key: 'pzv2_v3pz'
    })],
    modules: {
        menu
    }
})