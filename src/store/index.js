import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state     : {
		trackInfo : []
	},
	getters   : {},
	mutations : {
		getterTrackInfo(state, payload) {
			state.trackInfo = payload;
		}
	},
	actions   : {}
});
