<template>
  <div id="app">
    <p v-if="userInfo" class="title is-size-3">
      {{ userInfo.display_name }}
    </p>
    <p class="subtitle is-size-3">Quarantunes</p>
    <div v-if="!token" class="content">
      <a v-bind:href="getUrl">Authorize Spotify</a>
    </div>
    <Artists :token="token" />
    <Tracks :token="token" />
    <RecentlyPlayed :token="token" />
  </div>
</template>

<script>
import Artists from "./components/Artists.vue";
import Tracks from "./components/Tracks.vue";
import RecentlyPlayed from "./components/RecentlyPlayed.vue";
import $ from "jquery";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import * as d3 from "d3";
import Buefy from "buefy";
import "buefy/dist/buefy.css";

Vue.use(VueAxios, axios);

// TO DO: Add play buttons https://codepen.io/djodi/pen/NXJBRp/

Vue.use(Buefy);

export default {
  name: "App",
  components: {
    // Auth,
    Artists,
    Tracks,
    RecentlyPlayed,
  },
  data() {
    return {
      url: null,
      token: null,
      userInfo: null,
      topArtists: null,
      topTracks: null,
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
      // console.log(self.token);
      return self.token;
    },
    getUserInfo: function () {
      var self = this;
      $.ajax({
        url: "https://api.spotify.com/v1/me",
        type: "GET",
        async: false,
        headers: {
          Authorization: "Bearer " + self.token,
        },
      }).then(function (response) {
        console.log(response);
        self.userInfo = response;
        // console.log(self.userId);
      });
      return self.userInfo;
    },
    commaFormat: d3.format(","),
  },
  computed: {
    getUrl: function () {
      var self = this;
      self.url =
        "https://accounts.spotify.com/authorize?client_id=" +
        process.env.VUE_APP_CLIENT_ID +
        "&redirect_uri=" +
        process.env.VUE_APP_REDIRECT_URI +
        "&scope=user-read-private%20user-read-email&response_type=token&state=123";
      console.log(self.url);
      return self.url;
    },
  },
  // created: function () {
  //   this.getUrl();
  // },
  created: function () {
    // this.getUrl();
    this.getAccessToken();
    this.getUserInfo();
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

a {
  color: green;
}

a:hover {
  color: darkolivegreen;
}
</style>
