import Vue from 'vue'
import Vuex from 'vuex'
import module from "@/store/module";
import {getMenuByRouter} from "@/lib/utils";
import routers from "@/router/routers";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      menuList: getMenuByRouter(routers)
  },
  modules: {
      module
  }
})
