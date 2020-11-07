<template>
	<div class="columns is-1 is-variable is-mobile" v-if="topTracks">
		<div class="column">
			<ContentBox
				:title="'Favorite'"
				:imageSrc="favoriteTrack.album.images[0].url"
				:previewUrl="favoriteTrack.preview_url"
				:spotifyUrl="favoriteTrack.external_urls.spotify"
				:trackName="favoriteTrack.name"
				:artistName="favoriteTrack.album.artists[0].name"
				:type="'track'"
			/>
		</div>
		<div class="column">
			<ContentBox
				:title="'Most Underground'"
				:spotifyUrl="undergroundTrack.external_urls.spotify"
				:imageSrc="undergroundTrack.album.images[0].url"
				:previewUrl="undergroundTrack.preview_url"
				:trackName="undergroundTrack.name"
				:artistName="undergroundTrack.album.artists[0].name"
				:type="'track'"
			/>
		</div>
		<div class="column">
			<ContentBox
				:title="'Most Mainstream'"
				:spotifyUrl="mainstreamTrack.external_urls.spotify"
				:imageSrc="mainstreamTrack.album.images[0].url"
				:previewUrl="mainstreamTrack.preview_url"
				:trackName="mainstreamTrack.name"
				:artistName="mainstreamTrack.album.artists[0].name"
				:type="'track'"
			/>
		</div>
		<div class="column">
			<ContentBox
				:title="'Most Recently Played'"
				:imageSrc="mostRecentTrack.track.album.images[0].url"
				:previewUrl="mostRecentTrack.track.preview_url"
				:spotifyUrl="mostRecentTrack.track.external_urls.spotify"
				:trackName="mostRecentTrack.track.name"
				:artistName="mostRecentTrack.track.artists[0].name"
				:type="'track'"
			/>
		</div>
	</div>
</template>

<script>
import $ from "jquery";
import * as d3 from "d3";
import ContentBox from "./ContentBox.vue";

export default {
	name: "Tracks",
	props: ["token", "userInfo"],
	components: {
		ContentBox,
	},
	data() {
		return {
			topTracks: null,
			recentlyPlayed: null,
			recommendedPlaylistId: null,
			recommendedTracks: null,
			topTracksPlaylistId: null,
			playlistCreated: false,
		};
	},
	methods: {
		getTopTracks: function () {
			var self = this;
			$.ajax({
				url:
					"https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term",
				type: "GET",
				async: true,
				headers: {
					Authorization: "Bearer " + this.token,
				},
				success: function (result) {
					console.log("Successfully getting top tracks:", result);
				},
				error: function (e) {
					console.log(e);
					console.log("Error getting top tracks");
				},
			}).then(function (response) {
				const topTracks = response.items;
				self.topTracks = response.items;

				// All tracks in concatenated string
				const idString = response.items.map((d) => d.id).join(",");
				const idStringTop5 = response.items
					.slice(0, 5)
					.map((d) => d.id)
					.join(",");
				// console.log(idStringTop5)
				self.getTrackInfo(idString);
				self.getRecommendedTracks(idStringTop5);

				self.$store.commit("setTopTracks", topTracks);
				self.populatePlaylistTopTracks(topTracks);
			});
			return self.topTracks;
		},
		getTrackInfo: function (idString) {
			// https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/
			var self = this;
			$.ajax({
				url: "https://api.spotify.com/v1/audio-features/?ids=" + idString,
				type: "GET",
				async: false,
				headers: {
					Authorization: "Bearer " + self.token,
				},
				success: function (result) {
					console.log("Successfully got track info:", result);
					// self.recommendedPlaylistId = result.id;
				},
				error: function () {
					console.log("Error getting track info");
				},
			}).then(function (response) {
				const audioFeatures = response.audio_features;
				// Merge audio features with other stuff, like song info
				const audioFeaturesMetadata = audioFeatures.map((item, i) =>
					Object.assign({}, item, self.topTracks[i])
				);

				// Add this info to global store
				self.$store.commit("setTrackInfo", audioFeaturesMetadata);
			});
		},
		getRecommendedTracks: function (idString) {
			// https://developer.spotify.com/documentation/web-api/reference/browse/get-recommendations/
			var self = this;
			console.log(idString);
			$.ajax({
				url:
					"https://api.spotify.com/v1/recommendations?seed_tracks=" + idString,
				type: "GET",
				async: false,
				headers: {
					Authorization: "Bearer " + self.token,
				},
				success: function (result) {
					console.log("Successfully getting recommended tracks:", result);
					// self.recommendedPlaylistId = result.id;
				},
				error: function () {
					console.log("Error getting recommended tracks");
				},
			}).then(function (response) {
				const recommendedTracks = response.tracks;
				self.recommendedTracks = response.tracks;
				self.populatePlaylistRecommendedTracks(response.tracks);
				// Add tracks global store
				self.$store.commit("setRecommendedTracks", recommendedTracks);
			});
		},
		getRecentlyPlayed: function () {
			var self = this;
			$.ajax({
				url: "https://api.spotify.com/v1/me/player/recently-played",
				type: "GET",
				async: false,
				headers: {
					Authorization: "Bearer " + self.token,
				},
				success: function (result) {
					console.log("Successfully got recently played track:", result);
				},
				error: function (e) {
					console.log("Error in getting recently played track:", e);
				},
			}).then(function (response) {
				console.log(response);
				self.recentlyPlayed = response.items;
			});
			return self.recentlyPlayed;
		},
		newRecommendationsPlaylist: function () {
			var self = this;
			let jsonData = JSON.stringify({
				name: "My Quarantunes Recommendations",
				description:
					"Music for the next pandemic. Created by Connor Rothschild",
				public: false,
			});
			$.ajax({
				url:
					"https://api.spotify.com/v1/users/" + self.userInfo.id + "/playlists",
				data: jsonData,
				dataType: "json",
				contentType: "application/json",
				type: "POST",
				headers: {
					Authorization: "Bearer " + self.token,
				},
				success: function (result) {
					console.log(
						"Successfully created recommended tracks playlist:",
						result
					);
					self.$store.commit(
						"setRecommendedPlaylistId",
						"https://open.spotify.com/embed/playlist/" + result.id
					);
					self.recommendedPlaylistId = result.id;
				},
				error: function () {
					console.log("Error creating recommended tracks playlist");
				},
			});
		},
		newTopTracksPlaylist: function () {
			var self = this;
			let jsonData = JSON.stringify({
				name: "My Quarantunes",
				description:
					"What I'm listening to this pandemic. Created by Connor Rothschild",
				public: false,
			});
			$.ajax({
				url:
					"https://api.spotify.com/v1/users/" + self.userInfo.id + "/playlists",
				data: jsonData,
				dataType: "json",
				contentType: "application/json",
				type: "POST",
				headers: {
					Authorization: "Bearer " + self.token,
				},
				success: function (result) {
					console.log("Successfully created top tracks playlist:", result);
					self.$store.commit(
						"setTopTracksPlaylistId",
						"https://open.spotify.com/embed/playlist/" + result.id
					);
					self.topTracksPlaylistId = result.id;
				},
				error: function (e) {
					console.log(e);
					console.log("Error creating top tracks playlist");
				},
			});
		},
		populatePlaylistTopTracks: function (topTracks) {
			var self = this;
			var uris = topTracks.map((d) => d.uri).join(",");
			console.log(uris);
			$.ajax({
				url:
					"https://api.spotify.com/v1/playlists/" +
					self.topTracksPlaylistId +
					"/tracks?uris=" +
					uris,
				contentType: "application/json",
				type: "POST",
				headers: {
					Authorization: "Bearer " + self.token,
				},
				success: function (result) {
					console.log("Successfully populated top tracks playlist:", result);
				},
				error: function (e) {
					console.log(e);
					console.log("Error populating top tracks playlist");
				},
			});
		},
		populatePlaylistRecommendedTracks: function (recommendedTracks) {
			var self = this;
			let uris = recommendedTracks.map((d) => d.uri).join(",");
			$.ajax({
				url:
					"https://api.spotify.com/v1/playlists/" +
					self.recommendedPlaylistId +
					"/tracks?uris=" +
					uris,
				contentType: "application/json",
				type: "POST",
				headers: {
					Authorization: "Bearer " + self.token,
				},
				success: function (result) {
					console.log(
						"Successfully populated recommended tracks playlist:",
						result
					);
				},
				error: function () {
					console.log("Error populating recommended tracks playlist");
				},
			});
		},
	},
	computed: {
		mostRecentTrack: function () {
			var self = this;
			const recentlyPlayed = self.recentlyPlayed[0];
			// console.log(recentlyPlayed);
			return recentlyPlayed;
		},
		favoriteTrack: function () {
			var self = this;
			const favorite = self.topTracks[0];
			// console.log(favorite);
			return favorite;
		},
		undergroundTrack: function () {
			var self = this;
			const topTracksTemp = [...self.topTracks];
			const popularitySorted = topTracksTemp.sort((a, b) =>
				d3.ascending(a.popularity, b.popularity)
			);
			// console.log(popularitySorted[0]);
			return popularitySorted[0];
		},
		mainstreamTrack: function () {
			var self = this;
			const topTracksTemp = [...self.topTracks];
			const popularitySorted = topTracksTemp.sort((a, b) =>
				d3.descending(a.popularity, b.popularity)
			);
			// console.log(popularitySorted[0]);
			return popularitySorted[0];
		},
	},
	created: function () {
		// // Need to cache this for user so that we don't recreate a new playlist every time a user refreshes
		// // Ask Jonathan about this
		//// Uncomment when ready:
		if (this.playlistCreated == false) {
			this.newRecommendationsPlaylist();
			this.newTopTracksPlaylist();
		}
		this.playlistCreated = true;
	},
	mounted: function () {
		this.getRecentlyPlayed();
		this.getTopTracks();
	},
};
</script>

<style>
</style>
