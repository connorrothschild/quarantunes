import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
	state     : {
		trackInfo             : [],
		recommendedTracks     : [],
		topTracks             : [],
		recommendedPlaylistId : null,
		topTracksPlaylistId   : null
	},
	getters   : {
		getTrackInfo             : (state) => state.trackInfo,
		getRecommendedTracks     : (state) => state.recommendedTracks,
		getTopTracks             : (state) => state.topTracks,
		getRecommendedPlaylistId : (state) => state.recommendedPlaylistId,
		getTopTracksPlaylistId   : (state) => state.topTracksPlaylistId
	},
	mutations : {
		setTrackInfo             : (state, data) => (state.trackInfo = data),
		setRecommendedTracks     : (state, data) => (state.recommendedTracks = data),
		setTopTracks             : (state, data) => (state.topTracks = data),
		setRecommendedPlaylistId : (state, data) => (state.recommendedPlaylistId = data),
		setTopTracksPlaylistId   : (state, data) => (state.topTracksPlaylistId = data)
	}
});
