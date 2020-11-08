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
		};
	},
	methods: {
		// Gets a list of top tracks,
		// Gets recommended tracks
		init: function () {
			var self = this;
			$.ajax({
				url:
					"https://api.spotify.com/v1/me/top/tracks?limit=50&time_range=medium_term",
				type: "GET",
				async: false,
				headers: {
					Authorization: "Bearer " + this.token,
				},
				success: function (result) {
					console.log("Successfully getting top tracks:", result);
				},
				error: function (e) {
					console.log("Error getting top tracks:", e);
				},
			}).then(function (response) {
				const topTracks = response.items;
				self.topTracks = response.items;
				self.$store.commit("setTopTracks", topTracks);

				// Put all tracks in concatenated string and grab the top 5
				const idString = response.items.map((d) => d.id).join(",");
				const idStringTop5 = response.items
					.slice(0, 5)
					.map((d) => d.id)
					.join(",");

				// run getTrackInfo() to get metadata like audio features
				self.getTrackInfo(idString);
				// Get recommended tracks based on top 5 'seed' songs
				self.getRecommendedTracks(idStringTop5);

				self.createTopTracksPlaylistIfNoExist(topTracks);
				self.createRecommendedTracksPlaylistIfNoExist(self.recommendedTracks);
			});
			// return self.topTracks;
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
				},
				error: function (e) {
					console.log("Error getting track info:", e);
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
				},
				error: function () {
					console.log("Error getting recommended tracks");
				},
			}).then(function (response) {
				const recommendedTracks = response.tracks;
				self.recommendedTracks = recommendedTracks;

				// Add recommended tracks to global store
				self.$store.commit("setRecommendedTracks", recommendedTracks);

				// self.createRecommendedTracksPlaylistIfNoExist(recommendedTracks);
			});
			return self.recommendedTracks;
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
				async: false,
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
				error: function (e) {
					console.log("Error creating recommended tracks playlist", e);
				},
			});
			return self.recommendedPlaylistId;
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
				async: false,
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
					console.log("Error creating top tracks playlist", e);
				},
			});
			return self.topTracksPlaylistId;
		},
		populatePlaylistTopTracks: function (topTracks) {
			var self = this;
			var uris = topTracks.map((d) => d.uri).join(",");

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
					console.log("Error populating top tracks playlist:", e);
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
				error: function (e) {
					console.log("Error populating recommended tracks playlist:", e);
				},
			});
		},
		// Here, search through all user playlists
		// If they have "My Quarantunes", store that ID and move on
		// If not, create My Quarantunes and populate it.
		createTopTracksPlaylistIfNoExist: function (topTracks) {
			var self = this;
			$.ajax({
				url: "https://api.spotify.com/v1/me/playlists?limit=50",
				contentType: "application/json",
				type: "GET",
				headers: {
					Authorization: "Bearer " + self.token,
				},
				success: function (result) {
					console.log("List of playlists:", result);
				},
				error: function (e) {
					console.log("Error getting playlists:", e);
				},
			}).then(function (response) {
				// Array of playlist titles
				console.log(response.items.map((d) => d.name));

				// User already has "My Quarantunes" playlist:
				const playlistExists = response.items.filter(
					(d) => d.name == "My Quarantunes"
				);

				if (playlistExists.length > 0) {
					console.log(
						"The user already has " +
							playlistExists.length +
							" playlists titled My Quarantunes: ",
						playlistExists
					);

					// Which is the most populated?
					const mostPopulated = playlistExists.sort((a, b) =>
						d3.descending(a.tracks.total, b.tracks.total)
					)[0];

					// Save that playlist ID and return it; if a playlist exists, we should show it
					const playlistExistsId = mostPopulated.id;
					console.log(playlistExistsId);

					self.$store.commit(
						"setTopTracksPlaylistId",
						"https://open.spotify.com/embed/playlist/" + playlistExistsId
					);
					self.topTracksPlaylistId = playlistExistsId;
				} else {
					console.log(
						"User does not yet have a My Quarantunes playlist. Let's create one!"
					);
					// Create playlist
					self.newTopTracksPlaylist();
					console.log("Created My Quarantunes");
					console.log(self.topTracksPlaylistId);

					// Populate top tracks playlist with these tracks
					self.populatePlaylistTopTracks(topTracks);
					console.log("Populated tracks");
				}
			});
		},
		// Here, search through all user playlists
		// If they have "My Quarantunes Recommendations", store that ID and move on
		// If not, create My Quarantunes Recommendations and populate it.
		createRecommendedTracksPlaylistIfNoExist: function () {
			var self = this;
			$.ajax({
				url: "https://api.spotify.com/v1/me/playlists?limit=50",
				contentType: "application/json",
				type: "GET",
				headers: {
					Authorization: "Bearer " + self.token,
				},
				success: function (result) {
					console.log("List of playlists:", result);
				},
				error: function (e) {
					console.log("Error getting playlists:", e);
				},
			}).then(function (response) {
				// Array of playlist titles
				console.log(response.items.map((d) => d.name));

				// User already has "My Quarantunes Recommendations" playlist:
				const playlistExists = response.items.filter(
					(d) => d.name == "My Quarantunes Recommendations"
				);

				if (playlistExists.length > 0) {
					console.log(
						"The user already has " +
							playlistExists.length +
							" playlists titled My Quarantunes Recommendations: ",
						playlistExists
					);

					// Which is the most populated?
					const mostPopulated = playlistExists.sort((a, b) =>
						d3.descending(a.tracks.total, b.tracks.total)
					)[0];

					// Save that playlist ID and return it; if a playlist exists, we should show it
					const playlistExistsId = mostPopulated.id;

					self.$store.commit(
						"setRecommendedPlaylistId",
						"https://open.spotify.com/embed/playlist/" + playlistExistsId
					);
					self.recommendedPlaylistId = playlistExistsId;
				} else {
					console.log(
						"User does not yet have a My Quarantunes Recommendations playlist. Let's create one!"
					);
					// Create playlist
					self.newRecommendationsPlaylist();
					console.log("Created My Quarantunes Recommendations");
					console.log(self.recommendedPlaylistId);

					// Populate recommended tracks playlist with these tracks
					console.log(self.recommendedTracks);
					self.populatePlaylistRecommendedTracks(self.recommendedTracks);
					console.log("Populated tracks");
				}
			});
		},
	},
	computed: {
		mostRecentTrack: function () {
			var self = this;
			const recentlyPlayed = self.recentlyPlayed[0];

			return recentlyPlayed;
		},
		favoriteTrack: function () {
			var self = this;
			const favorite = self.topTracks[0];

			return favorite;
		},
		undergroundTrack: function () {
			var self = this;
			const topTracksTemp = [...self.topTracks];
			const popularitySorted = topTracksTemp.sort((a, b) =>
				d3.ascending(a.popularity, b.popularity)
			);

			return popularitySorted[0];
		},
		mainstreamTrack: function () {
			var self = this;
			const topTracksTemp = [...self.topTracks];
			const popularitySorted = topTracksTemp.sort((a, b) =>
				d3.descending(a.popularity, b.popularity)
			);

			return popularitySorted[0];
		},
	},
	created() {
		this.getRecentlyPlayed();
		this.init();
	},
	mounted() {},
	watch: {},
};
</script>

<style>
</style>
