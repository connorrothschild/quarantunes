<template>
	<div>
		<!-- Chart title and tooltip-->
		<div class="media space-between">
			<div class="media-left">
				<p class="heading is-size-4 is-size-6-tablet">{{ chartTitle }}</p>
			</div>
			<div class="media-right ml-0">
				<b-tooltip
					:label="tooltip"
					multilined
					size="is-medium"
					position="is-left"
				>
					<button class="button is-dark is-size-7">?</button>
				</b-tooltip>
			</div>
		</div>
		<!-- Chart itself, subtitle -->
		<div>
			<BarChart :trackInfo="trackInfo" :feature="feature" />
			<p class="heading is-size-7 has-text-right">
				{{ subtitle }}
				<a target="_blank" :href="mostFeature(feature).external_urls.spotify">{{
					mostFeature(feature).name
				}}</a>
			</p>
		</div>
	</div>
</template>

<script>
import * as d3 from "d3";
import { mapGetters } from "vuex";

import BarChart from "@/components/BarChart.vue";

export default {
	name: "ChartContainer",
	components: {
		BarChart,
	},
	props: ["feature", "chartTitle", "subtitle", "tooltip"],
	computed: {
		...mapGetters({
			trackInfo: "getTrackInfo",
		}),
	},
	methods: {
		mostFeature: function (feature) {
			// Copy array
			let array = [...this.trackInfo];
			// Grab length
			let n = array.length;

			// Return the object at the *end* of that array
			return array.sort((a, b) => d3.ascending(a[feature], b[feature]))[n - 1];
		},
	},
};
</script>

<style scoped lang="scss">
@import "@/styles/variables";
a {
	color: $spotify;

	&:hover {
		color: $spotify-invert;
	}
}
</style>