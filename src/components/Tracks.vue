<template>
    <div class="columns is-1 is-variable is-mobile">
      <div class="column">
        <ContentBox
          v-if="topTracks"
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
          v-if="topTracks"
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
          v-if="topTracks"
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
        <RecentlyPlayed :token="token" />
      </div>
    </div>
</template>

<script>
import $ from "jquery";
import * as d3 from "d3";
import ContentBox from "./ContentBox.vue";
import RecentlyPlayed from "./RecentlyPlayed.vue";

export default {
  name: "Tracks",
  props: ["token"],
  components: {
    ContentBox,
    RecentlyPlayed,
  },
  data() {
    return {
      topTracks: null,
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
      }).then(function (response) {
        // console.log(response.items.slice(0, 5));
        
        // All tracks in concatenated string
        const idString = response.items.map((d) => d.id).join(",");
        self.getTrackInfo(idString);
        self.topTracks = response.items;
      });
      return self.topTracks;
    },
  getTrackInfo: function (idString) {
    // https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/
      var self = this;
        $.ajax({
        url:
          "https://api.spotify.com/v1/audio-features/?ids=" + idString,
        type: "GET",
        async: true,
        headers: {
          Authorization: "Bearer " + self.token,
        },
      }).then(function (response) {
        // Add this info to global store
        self.$store.commit("getterTrackInfo", response.audio_features);
      })
    },
    getAverageAudioFeature: function (featureArray) {
      const mean = d3.mean(featureArray).toFixed(2);
      return mean;
    },
    },
  computed: {
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
  mounted: function () {
    this.getTopTracks();
  },
};
</script>

<style>
</style>
