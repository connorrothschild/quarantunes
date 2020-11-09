<template>
	<div class="columns is-1 is-variable is-mobile" v-if="topArtists">
		<div class="column">
			<ContentBox
				:title="'Favorite'"
				:imageSrc="favoriteArtist.images[0].url"
				:spotifyUrl="favoriteArtist.external_urls.spotify"
				:followerCount="favoriteArtist.followers.total"
				:artistName="favoriteArtist.name"
				:type="'artist'"
			/>
		</div>
		<div class="column">
			<ContentBox
				:title="'Most Underground'"
				:imageSrc="undergroundArtist.images[0].url"
				:spotifyUrl="undergroundArtist.external_urls.spotify"
				:followerCount="undergroundArtist.followers.total"
				:artistName="undergroundArtist.name"
				:type="'artist'"
			/>
		</div>
		<div class="column">
			<ContentBox
				:title="'Most Mainstream'"
				:imageSrc="mainstreamArtist.images[0].url"
				:spotifyUrl="mainstreamArtist.external_urls.spotify"
				:followerCount="mainstreamArtist.followers.total"
				:artistName="mainstreamArtist.name"
				:type="'artist'"
			/>
		</div>
		<div class="column">
			<ContentBox
				:title="'Deserves More Listens'"
				:imageSrc="topRecommendation.images[0].url"
				:spotifyUrl="topRecommendation.external_urls.spotify"
				:followerCount="topRecommendation.followers.total"
				:artistName="topRecommendation.name"
				:type="'artist'"
			/>
		</div>
	</div>
</template>

<script>
import $ from "jquery";
import * as d3 from "d3";
import ContentBox from "./ContentBox.vue";
import _ from "lodash";

export default {
	name: "Artists",
	props: ["token"],
	components: {
		ContentBox,
	},
	data() {
		return {
			topArtists: null,
			topRecommendation: null, // FIXME: lots of undefined and null because of the order the app computes everything
		};
	},
	methods: {
		getTopArtists: function () {
			var self = this;
			$.ajax({
				url:
					"https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term",
				type: "GET",
				async: true,
				headers: {
					Authorization: "Bearer " + self.token,
				},
			}).then(function (response) {
				self.topArtists = response.items;
				self.getRecommendations(response.items);
			});
			return self.topArtists;
		},
		getRecommendations: function (originalArtists) {
			var self = this;
			const emptyArray = [];
			const ids = originalArtists.map((d) => d.id);
			ids.forEach((id) => {
				$.ajax({
					url: "https://api.spotify.com/v1/artists/" + id + "/related-artists",
					type: "GET",
					async: true,
					headers: {
						Authorization: "Bearer " + this.token,
					},
				}).then(function (response) {
					// Grab artists from the response
					const artists = response.artists;
					// Push those artists to our originally empty array, flatten it
					emptyArray.push(artists);
					const recommendationsArray = emptyArray.flat();
					const recommendationsArtistNames = recommendationsArray.map(
						(d) => d.name
					);
					// Find counts of each artist's name
					const counts = _.map(
						_.countBy(recommendationsArtistNames),
						(val, key) => ({ name: key, count: val })
					);
					// Filter out artists they've been listening to
					const notInMyArtists = counts.filter(
						(i) => !originalArtists.map((d) => d.name).includes(i.name)
					);
					// Sort according to frequency, grab the first result
					const sorted = notInMyArtists.sort((a, b) =>
						d3.descending(a.count, b.count)
					);
					// console.log(sorted);
					const topRecommendationName = sorted[0].name;
					// Go back to the array of artists object and select the one that matches this name
					self.topRecommendation = artists.filter((i) =>
						topRecommendationName.includes(i.name)
					)[0];
				});
				return self.topRecommendation;
			});
		},
	},
	computed: {
		favoriteArtist: function () {
			var self = this;
			const favorite = self.topArtists[0];
			return favorite;
		},
		undergroundArtist: function () {
			var self = this;
			const topArtistsTemp = [...self.topArtists];
			const popularitySorted = topArtistsTemp.sort((a, b) =>
				d3.ascending(a.popularity, b.popularity)
			);
			return popularitySorted[0];
		},
		mainstreamArtist: function () {
			var self = this;
			const topArtistsTemp = [...self.topArtists];
			const popularitySorted = topArtistsTemp.sort((a, b) =>
				d3.descending(a.popularity, b.popularity)
			);
			return popularitySorted[0];
		},
	},
	mounted() {
		this.getTopArtists();
	},
};
</script>

<style scoped>
</style>
