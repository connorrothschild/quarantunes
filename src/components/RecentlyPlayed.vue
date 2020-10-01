<template>
  <div class="columns">
    <div class="column">
      <div v-if="recentlyPlayed" class="box">
        <p class="heading subtitle is-size-6">Most Recently Played</p>
        <a
          target="_blank"
          v-bind:href="mostRecentTrack.track.external_urls.spotify"
        >
          <img
            class="album-cover"
            v-bind:src="mostRecentTrack.track.album.images[0].url"
          />
        </a>
        <p class="heading is-size-4 title">
          {{ mostRecentTrack.track.name }}
        </p>
        <p class="heading is-size-6 subtitle">
          By {{ mostRecentTrack.track.artists[0].name }}
        </p>
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
      recentlyPlayed: null,
    };
  },
  methods: {
    getRecentlyPlayed: function () {
      var self = this;
      $.ajax({
        url: "https://api.spotify.com/v1/me/player/recently-played",
        type: "GET",
        async: false,
        headers: {
          Authorization: "Bearer " + this.token,
        },
      }).then(function (response) {
        console.log(response);
        console.log(response.items.slice(0, 5));
        console.log(response.items.map((d) => d.track.name));
        self.recentlyPlayed = response.items;
      });
      return self.recentlyPlayed;
    },
    commaFormat: d3.format(","),
  },
  computed: {
    mostRecentTrack: function () {
      var self = this;
      const recentlyPlayed = self.recentlyPlayed[0];
      console.log(recentlyPlayed);
      return recentlyPlayed;
    },
  },
  mounted() {
    this.getRecentlyPlayed();
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
