<template>
	<div class="box">
		<!-- For artist types, return an image of the artist -->
		<div v-if="type == 'artist'">
			<a v-bind:href="spotifyUrl" target="_blank">
				<figure class="image is-square">
					<img class="album-cover" v-bind:src="imageSrc" />
				</figure>
			</a>
		</div>

		<!-- For tracks, return album cover -->
		<div v-if="type == 'track'">
			<!-- This also has album-cover-container for CSS hover properties below -->
			<figure class="image is-square album-cover-container">
				<img class="album-cover" v-bind:src="imageSrc" />
			</figure>
		</div>

		<!-- If artist, return 1) the artist name, 2) what they are ('Most Underground') and their number of followers -->
		<div v-if="type == 'artist'">
			<p class="is-size-4 is-size-6-mobile title greyed mt-3">
				<a target="_blank" v-bind:href="spotifyUrl">
					{{ artistName }}
				</a>
			</p>

			<p class="heading is-size-7 is-size-8-mobile subtitle greyed">
				{{ title }} <br />
				{{ commaFormat(followerCount) }} followers
			</p>
		</div>

		<!-- If track, return 1) the track name, 2) what it is ('Most Underground') and the artist -->
		<div v-if="type == 'track'">
			<p class="is-size-4 is-size-6-mobile title greyed mt-3">
				<a target="_blank" v-bind:href="spotifyUrl">
					{{ trackName }}
				</a>
			</p>

			<p class="heading is-size-7 is-size-8-mobile subtitle greyed">
				{{ title }} <br />
				By {{ artistName }}
			</p>
		</div>
	</div>
</template>

<script>
import * as d3 from "d3";

export default {
	name: "ContentBox",
	props: [
		"title",
		"imageSrc",
		"previewUrl",
		"spotifyUrl",
		"followerCount",
		"trackName",
		"artistName",
		"type",
	],
	data() {
		return {
			hovered: false,
			isPlaying: false,
			// sound: null,
		};
	},
	computed: {},
	methods: {
		playSound(sound) {
			var audio = new Audio(sound);
			if (this.isPlaying == sound) {
				audio.pause();
				this.isPlaying = false;
				console.log("Should be paused: ", audio.paused);
				console.log(this.isPlaying);
			} else {
				audio.play();
				this.isPlaying = sound;
				console.log("Should be paused: ", audio.paused);
				console.log(this.isPlaying);
			}
		},
		commaFormat: d3.format(","),
	},
};
</script>

<style lang="scss" scoped>
.album-cover {
	object-fit: cover;
}

.album-cover-container:hover {
	&::before {
		content: "\f04b";
		font-family: FontAwesome;
		color: white;
		border: 1px solid white;
		border-radius: 50%;
		font-size: 35px;
		position: absolute;
		left: 50%;
		top: 50%;
		background: rgba(0, 0, 0, 0.5);
		width: 80px;
		height: 80px;
		line-height: 80px;
		border-radius: 50%;
		text-align: center;
		transform: translate(-50%, -50%);
		z-index: 99;
		cursor: pointer;
	}

	.album-cover {
		filter: brightness(0.6);
		cursor: pointer;
	}
}

.greyed {
	color: #c7c7c7;
}

.box {
	padding: 0;
}

@media screen and (max-width: 768px) {
	.is-size-8-mobile {
		font-size: 0.6rem !important;
	}
}
</style>