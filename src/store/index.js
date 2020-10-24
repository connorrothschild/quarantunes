import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state     : {
		trackInfo : []
	},
	getters   : {
		getTrackInfo : (state) => state.trackInfo
	},
	mutations : {
		setTrackInfo : (state, data) => (state.trackInfo = data)
	},
	actions   : {}
});
