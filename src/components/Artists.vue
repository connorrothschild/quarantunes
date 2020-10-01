<template>
  <div>
    <div class="columns">
      <div class="column">
        <div v-if="topArtists" class="box">
          <p class="heading subtitle is-size-6">Your Favorite Artist</p>
          <a target="_blank" v-bind:href="favoriteArtist.external_urls.spotify">
            <img
              class="album-cover"
              v-bind:src="favoriteArtist.images[0].url"
            />
          </a>
          <p class="heading is-size-4 title">
            {{ favoriteArtist.name }}
          </p>
          <p class="heading is-size-6 subtitle">
            {{ commaFormat(favoriteArtist.followers.total) }} followers
          </p>
        </div>
      </div>
      <div class="column">
        <div v-if="topArtists" class="box">
          <p class="heading subtitle is-size-6">Your Most Underground Artist</p>
          <a
            target="_blank"
            v-bind:href="undergroundArtist.external_urls.spotify"
          >
            <img
              class="album-cover"
              v-bind:src="undergroundArtist.images[0].url"
            />
          </a>
          <p class="heading is-size-4 title">
            {{ undergroundArtist.name }}
          </p>
          <p class="heading is-size-6 subtitle">
            {{ commaFormat(undergroundArtist.followers.total) }} followers
          </p>
        </div>
      </div>
      <div class="column">
        <div v-if="topArtists" class="box">
          <p class="heading subtitle is-size-6">Your Most Mainstream Artist</p>

          <a
            target="_blank"
            v-bind:href="mainstreamArtist.external_urls.spotify"
          >
            <img
              class="album-cover"
              v-bind:src="mainstreamArtist.images[0].url"
            />
          </a>
          <p class="heading is-size-4 title">
            {{ mainstreamArtist.name }}
          </p>
          <p class="heading is-size-6 subtitle">
            {{ commaFormat(mainstreamArtist.followers.total) }} followers
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
  name: "Artists",
  props: ["token"],
  data() {
    return {
      topArtists: null,
    };
  },
  methods: {
    getTopArtists: function () {
      var self = this;
      $.ajax({
        url:
          "https://api.spotify.com/v1/me/top/artists?limit=50&time_range=medium_term",
        type: "GET",
        async: false,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      }).then(function (response) {
        console.log(response.items.slice(0, 5));
        console.log(response.items.map((d) => d.name));
        self.topArtists = response.items;
      });
      return self.topArtists;
    },
    commaFormat: d3.format(","),
  },
  computed: {
    favoriteArtist: function () {
      var self = this;
      const favorite = self.topArtists[0];
      console.log(favorite);
      return favorite;
    },
    undergroundArtist: function () {
      var self = this;
      const topArtistsTemp = [...self.topArtists];
      const popularitySorted = topArtistsTemp.sort((a, b) =>
        d3.ascending(a.popularity, b.popularity)
      );
      console.log(popularitySorted[0]);
      return popularitySorted[0];
    },
    mainstreamArtist: function () {
      var self = this;
      const topArtistsTemp = [...self.topArtists];
      const popularitySorted = topArtistsTemp.sort((a, b) =>
        d3.descending(a.popularity, b.popularity)
      );
      console.log(popularitySorted[0]);
      return popularitySorted[0];
    },
  },
  mounted() {
    this.getTopArtists();
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
