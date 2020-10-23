<template>
  <div id="app">
    <div v-if="!userInfo" class="full-page-centered">
      <button class="button is-size-3 is-spotify">
        <a :href="getUrl">Authorize Spotify</a>
      </button>
    </div>

    <UserInfo
      v-if="userInfo"
      :spotifyUrl="userInfo.external_urls.spotify"
      :imageSrc="userInfo.images[0].url"
      :name="userInfo.display_name"
    />
    
    <div v-if="userInfo" class="main-content">
        <b-tabs v-model="activeTab">
            <b-tab-item label="Overview">
              <div class="title is-size-5 mb-0">My Quarantine Artists</div>
                <hr class="spotify-line" />
                <Artists :token="token" />
              <br />
              <div class="title is-size-5 mb-0">My Quarantine Tracks</div>
                <hr class="spotify-line" />
                <Tracks :token="token" />
            </b-tab-item>

            <b-tab-item label="Mood">
              <div v-if="this.$store.state.trackInfo">
                <AudioFeatures :trackInfo="this.$store.state.trackInfo"/>
              </div>
            </b-tab-item>

            <b-tab-item label="Recommendations">
              Recommendations
              <PolarChart/>

            </b-tab-item>
        </b-tabs>
      </div>
    </div>
</template>

<script>
import Artists from "./components/Artists.vue";
import Tracks from "./components/Tracks.vue";
import UserInfo from "./components/UserInfo.vue";
import AudioFeatures from "./components/AudioFeatures.vue";
import PolarChart from "./components/PolarChart.vue";

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
    Artists,
    Tracks,
    UserInfo,
    AudioFeatures,
    PolarChart
  },
  data() {
    return {
      activeTab: 0,
      url: null,
      token: null,
      userInfo: null,
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
    onAuth: function () {
      this.getAccessToken();
      this.getUserInfo();
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
  margin-top: 10px;
}
// a {
//   color: $spotify;
//   &:hover {
//     color: darkgreen;
//   }
// }

.box {
  background: transparent;
}
html {
  padding: 2.5%;
  // if css unsupported:
  background: rgb(24, 24, 24);
  // spotify gradient
  // background: linear-gradient(
  //   0deg,
  //   rgba(24, 24, 24, 1) 0%,
  //   rgba(24, 24, 24, 1) 75%,
  //   rgba(64, 64, 64, 1) 100%
  // );
  // // fix weird repeating bug
  // background-repeat: no-repeat;
  // background-attachment: fixed;
}

body,
.title,
.subtitle,
p {
  color: white;
}
.vertical-center-content {
  display: flex;
  align-items: center;
}

.spotify-line {
  background-color: grey;
  margin: 0.5rem 0 1rem 0;
  height: 0.5px;
}

.tabs {
  text-transform: uppercase;
}

.full-page-centered {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}
</style>
