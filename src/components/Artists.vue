<template>
  <div>
    <div class="columns">
      <div class="column">
        <ContentBox
          v-if="topArtists"
          :title="'Your Favorite Artist'"
          :imageSrc="favoriteArtist.images[0].url"
          :spotifyUrl="favoriteArtist.external_urls.spotify"
          :followerCount="favoriteArtist.followers.total"
          :artistName="favoriteArtist.name"
          :type="'artist'"
        />
      </div>
      <div class="column">
        <ContentBox
          v-if="topArtists"
          :title="'Your Most Underground Artist'"
          :imageSrc="undergroundArtist.images[0].url"
          :spotifyUrl="undergroundArtist.external_urls.spotify"
          :followerCount="undergroundArtist.followers.total"
          :artistName="undergroundArtist.name"
          :type="'artist'"
        />
      </div>
      <div class="column">
        <ContentBox
          v-if="topArtists"
          :title="'Your Most Mainstream Artist'"
          :imageSrc="mainstreamArtist.images[0].url"
          :spotifyUrl="mainstreamArtist.external_urls.spotify"
          :followerCount="mainstreamArtist.followers.total"
          :artistName="mainstreamArtist.name"
          :type="'artist'"
        />
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import * as d3 from "d3";
import ContentBox from "./ContentBox.vue";

export default {
  name: "Artists",
  props: ["token"],
  components: {
    ContentBox,
  },
  data() {
    return {
      topArtists: null,
      topArtistTrack: null,
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
    // getTopArtistsTracks: function () {
    //   var self = this;
    //   $.ajax({
    //     url:
    //       "https://api.spotify.com/v1/artists/" +
    //       this.favoriteArtist.id +
    //       "/top-tracks?country=US",
    //     type: "GET",
    //     async: false,
    //     headers: {
    //       Authorization: "Bearer " + this.token,
    //     },
    //   }).then(function (response) {
    //     console.log(response);
    //     self.topArtistTrack = response.tracks[0];
    //   });
    //   return self.topArtistTrack;
    // },
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
    // this.getTopArtistsTracks();
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
