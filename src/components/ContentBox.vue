<template>
  <div class="box">
    <div v-if="type == 'artist'">
      <figure class="image is-square">
        <img class="album-cover" v-bind:src="imageSrc" />
      </figure>
    </div>

    <div v-if="type == 'track'">
      <!-- <img
        class="album-cover"
        v-bind:src="imageSrc"
        @mouseover="hovered = true"
        @mouseleave="hovered = false"
        :class="{ hovered: hovered }"
        @click="playSound(previewUrl)"
      /> -->
      <figure class="image is-square album-cover-container">
        <img class="album-cover" v-bind:src="imageSrc" />
      </figure>
      <!-- <audio controls>
        <source :src="previewUrl" type="audio/mpeg" />
      </audio> -->
    </div>

    <div v-if="type == 'artist'">
      <p class="is-size-4 title greyed mt-3">
        <a target="_blank" v-bind:href="spotifyUrl">
          {{ artistName }}
        </a>
      </p>

      <p class="heading is-size-7 subtitle greyed">
        {{ title }} <br />
        {{ commaFormat(followerCount) }} followers
      </p>
    </div>

    <div v-if="type == 'track'">
      <p class="is-size-4 title greyed mt-3">
        <a target="_blank" v-bind:href="spotifyUrl">
          {{ trackName }}
        </a>
      </p>

      <p class="heading is-size-7 subtitle greyed">
        {{ title }} <br />
        By {{ artistName }}
      </p>
    </div>
  </div>
</template>

<script>
import * as d3 from "d3";

export default {
  name: "ContentBox",
  props: [
    "title",
    "imageSrc",
    "previewUrl",
    "spotifyUrl",
    "followerCount",
    "trackName",
    "artistName",
    "type",
  ],
  data() {
    return {
      hovered: false,
      isPlaying: false,
      // sound: null,
    };
  },
  computed: {},
  methods: {
    playSound(sound) {
      var audio = new Audio(sound);
      if (this.isPlaying == sound) {
        audio.pause();
        this.isPlaying = false;
        console.log("Should be paused: ", audio.paused);
        console.log(this.isPlaying);
      } else {
        audio.play();
        this.isPlaying = sound;
        console.log("Should be paused: ", audio.paused);
        console.log(this.isPlaying);
      }
    },
    commaFormat: d3.format(","),
  },
};
</script>

<style lang="scss" scoped>
.album-cover {
  object-fit: cover;
}

.album-cover-container:hover {
  &::before {
    content: "\f04b";
    font-family: FontAwesome;
    color: white;
    border: 1px solid white;
    border-radius: 50%;
    font-size: 35px;
    position: absolute;
    left: 50%;
    top: 50%;
    background: rgba(0, 0, 0, 0.5);
    width: 80px;
    height: 80px;
    line-height: 80px;
    border-radius: 50%;
    text-align: center;
    transform: translate(-50%, -50%);
    z-index: 99;
    cursor: pointer;
  }

  .album-cover {
    filter: brightness(0.6);
    cursor: pointer;
  }
}

.greyed {
  color: #c7c7c7;
}

.box {
  padding: 0;
}
</style>