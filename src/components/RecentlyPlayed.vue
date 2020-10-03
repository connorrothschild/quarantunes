<template>
  <ContentBox
    v-if="recentlyPlayed"
    :title="'Most Recently Played'"
    :imageSrc="mostRecentTrack.track.album.images[0].url"
    :previewUrl="mostRecentTrack.track.preview_url"
    :spotifyUrl="mostRecentTrack.track.external_urls.spotify"
    :trackName="mostRecentTrack.track.name"
    :artistName="mostRecentTrack.track.artists[0].name"
    :type="'track'"
  />
</template>

<script>
import $ from "jquery";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import * as d3 from "d3";
import ContentBox from "./ContentBox.vue";

Vue.use(VueAxios, axios);

export default {
  name: "Artists",
  props: ["token"],
  components: {
    ContentBox,
  },
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
</style>
