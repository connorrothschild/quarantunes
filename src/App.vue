<template>
	<div id="app">
		<div v-if="!userInfo" class="full-page-centered">
			<p class="title is-size-3 has-text-weight-bolder">
				Welcome to Quarantunes!
			</p>
			<p class="title is-size-4 has-text-weight-medium">
				In order to check your listening history, I'll need you to log in:
			</p>
			<a :href="getUrl">
				<button class="button is-size-4 is-spotify">Authorize Spotify</button>
			</a>
			<p class="has-text-weight-light mt-4">
				(Or check out the project on
				<a href="https://github.com/connorrothschild/quarantunes">GitHub</a>)
			</p>
		</div>

		<div class="userInfo">
			<UserInfo
				v-if="userInfo"
				:spotifyUrl="userInfo.external_urls.spotify"
				:imageSrc="
					userInfo.images[0] != undefined
						? userInfo.images[0].url
						: placeholderImage
				"
				:name="userInfo.display_name"
			/>
		</div>
		<div v-if="userInfo" class="main-content">
			<b-tabs class="spotify-tabs" v-model="activeTab">
				<b-tab-item label="Overview">
					<div class="title is-size-5 mb-0">My Quarantine Artists</div>
					<hr class="spotify-line" />
					<Artists :token="token" />
					<br />
					<div class="title is-size-5 mb-0">My Quarantine Tracks</div>
					<hr class="spotify-line" />
					<Tracks :token="token" :userInfo="userInfo" />
				</b-tab-item>

				<b-tab-item label="Mood">
					<div>
						<p class="title is-size-4">Your top tracks, sorted by...</p>
						<!-- Only load charts if tab is active (activeTab == 1),
              to prevent display: none https://github.com/apertureless/vue-chartjs/issues/157#issuecomment-318434516 -->
						<div v-if="trackInfo.length > 0 && activeTab == 1" class="columns">
							<div class="column is-one-quarter">
								<ChartContainer
									trackInfo="trackInfo"
									chartTitle="Danceability"
									subtitle="Most danceable:"
									feature="danceability"
									tooltip="Danceability describes how suitable a track is for dancing based on a combination of musical elements including tempo, rhythm stability, beat strength, and overall regularity."
								/>
							</div>
							<div class="column is-one-quarter">
								<ChartContainer
									trackInfo="trackInfo"
									chartTitle="Energy"
									subtitle="Most energetic:"
									feature="energy"
									tooltip="Energy represents a perceptual measure of intensity and activity. Typically, energetic tracks feel fast, loud, and noisy. "
								/>
							</div>
							<div class="column is-one-quarter">
								<ChartContainer
									trackInfo="trackInfo"
									chartTitle="Tempo"
									subtitle="Highest tempo:"
									feature="tempo"
									tooltip="The overall estimated tempo of a track in beats per minute (BPM)."
								/>
							</div>
							<div class="column is-one-quarter">
								<ChartContainer
									trackInfo="trackInfo"
									chartTitle="Valence"
									subtitle="Most positive:"
									feature="valence"
									tooltip="Tracks with high valence sound more positive (e.g. happy, cheerful, euphoric), while tracks with low valence sound more negative (e.g. sad, depressed, angry)."
								/>
							</div>
						</div>
						<!-- <div v-if="trackInfo.length > 0 && activeTab == 1" class="columns">
							<div class="column is-one-quarter">
								<ChartContainer
									trackInfo="trackInfo"
									chartTitle="Popularity"
									subtitle="Most popular:"
									feature="popularity"
									tooltip="The popularity is calculated by algorithm and is based, in the most part, on the total number of plays the track has had and how recent those plays are."
								/>
							</div>
							<div class="column is-one-quarter">
								<ChartContainer
									trackInfo="trackInfo"
									chartTitle="Duration"
									subtitle="Longest:"
									feature="duration_ms"
									tooltip="The duration of the song in milliseconds."
								/>
							</div>
						</div> -->
					</div>
				</b-tab-item>

				<b-tab-item label="Recommendations">
					<div
						class="columns"
						v-if="topTracks.length > 0 && recommendedTracks.length > 0"
					>
						<div class="column">
							<p class="title is-size-4">Your top tracks:</p>
							<div class="resp-container">
								<iframe
									class="resp-iframe"
									:src="topTracksPlaylistId"
									v-if="topTracks.length > 0"
									frameborder="0"
									allowtransparency="true"
									allow="encrypted-media"
								>
								</iframe>
							</div>
						</div>
						<div class="column">
							<p class="title is-size-4">Some recommendations:</p>
							<div class="resp-container">
								<iframe
									class="resp-iframe"
									:src="recommendedPlaylistId"
									v-if="recommendedTracks.length > 0"
									frameborder="0"
									allowtransparency="true"
									allow="encrypted-media"
								>
								</iframe>
							</div>
						</div>
					</div>
				</b-tab-item>
			</b-tabs>
		</div>
	</div>
</template>

<script>
import Artists from "./components/Artists.vue";
import Tracks from "./components/Tracks.vue";
import UserInfo from "./components/UserInfo.vue";
import ChartContainer from "./components/ChartContainer.vue";

import $ from "jquery";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import * as d3 from "d3";
import Buefy from "buefy";
import { mapGetters } from "vuex";
import "./styles/_variables.scss";

Vue.use(VueAxios, axios);
Vue.use(Buefy);

export default {
	name: "App",
	components: {
		Artists,
		Tracks,
		UserInfo,
		ChartContainer,
	},
	data() {
		return {
			activeTab: 0,
			url: null,
			token: null,
			userInfo: null,
			placeholderImage:
				"https://raw.githubusercontent.com/connorrothschild/quarantunes/master/images/placeholder.png",
		};
	},
	methods: {
		getAccessToken: function () {
			var self = this;
			// Get authorization token
			var hashString = location.hash;
			var myRe = /^#access_token=.+?(?=&)/g;
			var result = myRe.exec(hashString.toString())[0];
			self.token = result.slice(14);
			return self.token;
		},
		getUserInfo: function () {
			var self = this;
			$.ajax({
				url: "https://api.spotify.com/v1/me",
				type: "GET",
				async: true,
				headers: {
					Authorization: "Bearer " + self.token,
				},
			}).then(function (response) {
				self.userInfo = response;
			});
			return self.userInfo;
		},
		commaFormat: d3.format(","),
	},
	computed: {
		...mapGetters({
			trackInfo: "getTrackInfo",
			recommendedTracks: "getRecommendedTracks",
			topTracks: "getTopTracks",
			recommendedPlaylistId: "getRecommendedPlaylistId",
			topTracksPlaylistId: "getTopTracksPlaylistId",
		}),
		getUrl: function () {
			var self = this;
			self.url =
				"https://accounts.spotify.com/authorize?client_id=" +
				process.env.VUE_APP_CLIENT_ID +
				"&redirect_uri=" +
				process.env.VUE_APP_REDIRECT_URI + // if testing: VUE_APP_TESTING_REDIRECT_URI
				"&scope=user-top-read%20ugc-image-upload%20playlist-read-private%20playlist-modify-private%20playlist-modify-public%20user-read-recently-played&response_type=token&state=123";
			return self.url;
		},
	},
	created: function () {
		this.getAccessToken();
		this.getUserInfo();
	},
};
</script>

<style lang="scss">
@import "styles/variables";
#app {
	font-family: Proxima Nova, Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	margin-top: 10px;
}

a {
	&:hover {
		color: $spotify;
	}
}

.box {
	background: transparent;
}
html {
	padding: 1% 3% 1% 3%;
	// if css unsupported:
	background: rgb(24, 24, 24);
	// spotify gradient
	background: linear-gradient(
		0deg,
		rgba(24, 24, 24, 1) 0%,
		rgba(24, 24, 24, 1) 75%,
		rgba(64, 64, 64, 1) 100%
	);
	// fix weird repeating bug
	background-repeat: no-repeat;
	background-attachment: fixed;
}

body,
.title,
.subtitle,
p {
	color: white;
}
.vertical-center-content {
	display: flex;
	align-items: center;
}

.spotify-line {
	background-color: grey;
	margin: 0.5rem 0 1rem 0;
	height: 0.5px;
}

.full-page-centered {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 80vh;
	max-width: 768px;
	margin: 0 auto;
	text-align: center;
}

// responsive iframe https://blog.theodo.com/2018/01/responsive-iframes-css-trick/
.resp-container {
	position: relative;
	overflow: hidden;
	padding-top: 56.25%;
	height: 600px; // set iframe height here
}

.resp-iframe {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
}

// flex media
.space-between {
	justify-content: space-between;
}

// tabs
.spotify-tabs {
	a:hover {
		border-bottom: none;
	}
	.tabs {
		span {
			text-transform: uppercase;
			display: inline-block;
			padding-bottom: 5px;
			position: relative;
		}
		.is-active {
			span {
				font-weight: 500;
			}
			span:before {
				content: "";
				position: absolute;
				width: 50%;
				height: 1px;
				bottom: 0;
				left: 25%;
				border-bottom: 1px solid $spotify;
			}
		}
	}
}

// Tooltips on tab 2 for tablet size devices
@media (min-width: 769px) and (max-width: 1096px) {
	.b-tooltip .tooltip-content {
		width: 150px !important;
		font-size: 0.75rem !important;
	}
}

.b-tooltip .tooltip-content {
	text-align: left !important;
}
</style>
