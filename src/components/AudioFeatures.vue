<template>
    <div class="columns is-1 is-variable is-mobile">
      <div class="column is-2">
      <div v-if="trackInfo">
        <p>Danceability: {{getAverageAudioFeature(trackInfo.map(d => d.danceability))}}</p>
        <b-progress show-value format="percent" :value="getAverageAudioFeature(trackInfo.map(d => d.danceability))" max=1></b-progress>

        <p>Acousticness: {{getAverageAudioFeature(trackInfo.map(d => d.acousticness))}}</p>
        <b-progress show-value format="percent" :value="getAverageAudioFeature(trackInfo.map(d => d.acousticness))" max=1></b-progress>

        <p>Energy: {{getAverageAudioFeature(trackInfo.map(d => d.energy))}}</p>
        <b-progress show-value format="percent" :value="getAverageAudioFeature(trackInfo.map(d => d.energy))" max=1></b-progress>

        <p>Instrumentalness: {{getAverageAudioFeature(trackInfo.map(d => d.instrumentalness))}}</p>
        <b-progress show-value format="percent" :value="getAverageAudioFeature(trackInfo.map(d => d.instrumentalness))" max=1></b-progress>

        <p>Liveness: {{getAverageAudioFeature(trackInfo.map(d => d.liveness))}}</p>
        <b-progress show-value format="percent" :value="getAverageAudioFeature(trackInfo.map(d => d.liveness))" max=1></b-progress>

        <p>Mode: {{getAverageAudioFeature(trackInfo.map(d => d.mode))}}</p>
        <b-progress show-value format="percent" :value="getAverageAudioFeature(trackInfo.map(d => d.mode))" max=1></b-progress>

        <p>Speechiness: {{getAverageAudioFeature(trackInfo.map(d => d.speechiness))}}</p>
        <b-progress show-value format="percent" :value="getAverageAudioFeature(trackInfo.map(d => d.speechiness))" max=1></b-progress>

        <p>Valence: {{getAverageAudioFeature(trackInfo.map(d => d.valence))}}</p>
        <b-progress show-value format="percent" :value="getAverageAudioFeature(trackInfo.map(d => d.valence))" max=1></b-progress>

        <p>Average song duration: {{averageDuration}}</p>
      </div>
    </div>
    </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "AudioFeatures",
  components: {},
  props: ["trackInfo"], // imported from the state
  data() {
    return {};
  },
  methods: {
    getAverageAudioFeature: function (featureArray) {
        const mean = +d3.mean(featureArray).toFixed(2);
        return mean;
    },
    },
  computed: {
    averageDuration: function () {
      const millisToMinutesAndSeconds = (millis) => {
          var minutes = Math.floor(millis / 60000);
          var seconds = ((millis % 60000) / 1000).toFixed(0);
          return `${minutes} minutes and ${(seconds < 10 ? "0" : "")}${seconds} seconds`;
      };

      const durations = this.trackInfo.map(d => d.duration_ms);
      const mean = millisToMinutesAndSeconds(d3.mean(durations));
      // console.log(mean);
      return mean;
    },
  },
  mounted: function () {
      // console.log(this.$store.state.trackInfo);  
      },
};
</script>

<style scoped>
</style>
