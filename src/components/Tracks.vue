<template>
  <div>
    <div class="columns">
      <div class="column">
        <div v-if="topTracks" class="box">
          <p class="heading subtitle is-size-6">Your Favorite Track</p>
          <a target="_blank" v-bind:href="favoriteTrack.external_urls.spotify">
            <img
              class="album-cover"
              v-bind:src="favoriteTrack.album.images[0].url"
            />
          </a>
          <p class="heading is-size-4 title">
            {{ favoriteTrack.name }}
          </p>
          <p class="heading is-size-6 subtitle">
            By {{ favoriteTrack.album.artists[0].name }}
          </p>
        </div>
      </div>
      <div class="column">
        <div v-if="topTracks" class="box">
          <p class="heading subtitle is-size-6">Your Most Underground Track</p>
          <a
            target="_blank"
            v-bind:href="undergroundTrack.external_urls.spotify"
          >
            <img
              class="album-cover"
              v-bind:src="undergroundTrack.album.images[0].url"
            />
          </a>
          <p class="heading is-size-4 title">
            {{ undergroundTrack.name }}
          </p>
          <p class="heading is-size-6 subtitle">
            By {{ undergroundTrack.album.artists[0].name }}
          </p>
        </div>
      </div>
      <div class="column">
        <div v-if="topTracks" class="box">
          <p class="heading subtitle is-size-6">Your Most Mainstream Track</p>

          <a
            target="_blank"
            v-bind:href="mainstreamTrack.external_urls.spotify"
          >
            <img
              class="album-cover"
              v-bind:src="mainstreamTrack.album.images[0].url"
            />
          </a>
          <p class="heading is-size-4 title">
            {{ mainstreamTrack.name }}
          </p>
          <p class="heading is-size-6 subtitle">
            By {{ mainstreamTrack.album.artists[0].name }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import * as d3 from "d3";

Vue.use(VueAxios, axios);

export default {
  name: "Tracks",
  props: ["token"],
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
        async: false,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      }).then(function (response) {
        console.log(response.items.slice(0, 5));
        console.log(response.items.map((d) => d.name));
        self.topTracks = response.items;
      });
      return self.topTracks;
    },
    commaFormat: d3.format(","),
  },
  computed: {
    favoriteTrack: function () {
      var self = this;
      const favorite = self.topTracks[0];
      console.log(favorite);
      return favorite;
    },
    undergroundTrack: function () {
      var self = this;
      const topTracksTemp = [...self.topTracks];
      const popularitySorted = topTracksTemp.sort((a, b) =>
        d3.ascending(a.popularity, b.popularity)
      );
      console.log(popularitySorted[0]);
      return popularitySorted[0];
    },
    mainstreamTrack: function () {
      var self = this;
      const topTracksTemp = [...self.topTracks];
      const popularitySorted = topTracksTemp.sort((a, b) =>
        d3.descending(a.popularity, b.popularity)
      );
      console.log(popularitySorted[0]);
      return popularitySorted[0];
    },
  },
  // created: function () {
  //   this.getUrl();
  // },
  mounted: function () {
    this.getTopTracks();
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.album-cover {
  width: 100px;
  height: 100px;
  object-fit: cover;
}
</style>
