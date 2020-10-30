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
              <div>
              <p class="title is-size-4">Your tracks, sorted by...</p>
              <!-- Only load charts if tab is active (activeTab == 1),
              to prevent display: none https://github.com/apertureless/vue-chartjs/issues/157#issuecomment-318434516 -->
                  <div v-if="trackInfo.length > 0 && activeTab == 1" class="columns">
                    <div class="column has-text-centered is-one-quarter">
                        <p class="heading is-size-4">Danceability</p>
                        <p class="heading is-size-7">Most danceable: {{mostFeature('danceability')}}</p>
                        <PolarChart :trackInfo="trackInfo" feature="danceability"/>
                      </div>
                      <div class="column has-text-centered is-one-quarter">
                        <p class="heading is-size-4">Energy</p>
                        <p class="heading is-size-7">Most energetic: {{mostFeature('energy')}}</p>
                        <PolarChart :trackInfo="trackInfo" feature="energy"/>
                      </div>
                      <div class="column has-text-centered is-one-quarter">
                        <p class="heading is-size-4">Valence</p>
                        <p class="heading is-size-7">Most positive: {{mostFeature('valence')}}</p>
                        <PolarChart :trackInfo="trackInfo" feature="valence"/>
                      </div>
                      <div class="column has-text-centered is-one-quarter">
                        <p class="heading is-size-4">Tempo</p>
                        <p class="heading is-size-7">Highest tempo: {{mostFeature('tempo')}}</p>
                        <PolarChart :trackInfo="trackInfo" feature="tempo"/>
                      </div>
                  </div>
              </div>
            </b-tab-item>

            <b-tab-item label="Recommendations">
            </b-tab-item>
        </b-tabs>
      </div>
    </div>
</template>

<script>
import Artists from "./components/Artists.vue";
import Tracks from "./components/Tracks.vue";
import UserInfo from "./components/UserInfo.vue";
// import AudioFeatures from "./components/AudioFeatures.vue";
// import ChartContainer from "./components/ChartContainer.vue";
import PolarChart from "./components/PolarChart.vue";

import $ from "jquery";
import Vue from "vue";
import axios from "axios";
import VueAxios from "vue-axios";
import * as d3 from "d3";
import Buefy from "buefy";
import { mapGetters } from "vuex";
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
    // AudioFeatures,
    // ChartContainer,
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
        async: true,
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
    mostFeature: function(feature) {
      let array = [... this.trackInfo];
      let n = array.length;
      console.log(n)
      console.log(array.sort((a, b) => d3.ascending(a[feature], b[feature]))[n - 1].name)
      return array.sort((a, b) => d3.ascending(a[feature], b[feature]))[n - 1].name
    }
  },
  computed: {
    ...mapGetters({
      trackInfo: "getTrackInfo",
    }),
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
    console.log(this.trackInfo.length);
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
