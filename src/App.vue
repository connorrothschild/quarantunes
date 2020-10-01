<template>
  <div id="app">
    <div v-if="userInfo" class="media ml-6 mb-6 vertical-center-content">
      <div class="media-left">
        <figure class="image is-96x96">
          <img
            class="profile-image"
            v-if="userInfo"
            v-bind:src="userInfo.images[0].url"
          />
        </figure>
      </div>
      <div class="media-content">
        <p class="heading is-size-6">User</p>
        <p class="is-size-3 has-text-weight-bold">
          {{ userInfo.display_name }}
        </p>
      </div>
    </div>
    <button v-if="!token" class="button">
      <a v-bind:href="getUrl">Authorize Spotify</a>
    </button>
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
import "./styles/_variables.scss";

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

<style lang="scss">
@import "styles/variables";
#app {
  font-family: Proxima Nova, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin-top: 60px;
}
a {
  color: $spotify;
  &:hover {
    color: darkgreen;
  }
}

.box {
  background: transparent;
  text-align: center;
}
html {
  // css unsupported
  // background: rgb(24, 24, 24);
  // spotify gradient
  background: linear-gradient(
    0deg,
    rgba(24, 24, 24, 1) 0%,
    rgba(24, 24, 24, 1) 75%,
    rgba(64, 64, 64, 1) 100%
  );
  background-repeat: no-repeat;
  background-attachment: fixed;
}
.title,
.subtitle,
p {
  color: white;
}

.profile-image {
  border-radius: 50%;
}

.vertical-center-content {
  align-items: center;
}
</style>
