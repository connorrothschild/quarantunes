<template>
  <div class="box">
    <p class="heading subtitle is-size-6">{{ title }}</p>
    <img
      class="album-cover"
      v-bind:src="imageSrc"
      @mouseover="hovered = true"
      @mouseleave="hovered = false"
      :class="{ hovered: hovered }"
      @click="playSound(previewUrl)"
    />

    <div v-if="type == 'track'">
      <p class="heading is-size-4 title">
        <a target="_blank" v-bind:href="spotifyUrl">
          {{ trackName }}
        </a>
      </p>

      <p class="heading is-size-6 subtitle">By {{ artistName }}</p>
    </div>

    <div v-if="type == 'artist'">
      <p class="heading is-size-4 title">
        <a target="_blank" v-bind:href="spotifyUrl">
          {{ artistName }}
        </a>
      </p>

      <p class="heading is-size-6 subtitle">
        {{ commaFormat(followerCount) }} followers
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
    };
  },
  computed: {
    // hasSlot() {
    //   return !!this.$slots.default;
    // },
  },
  methods: {
    playSound(sound) {
      if (sound) {
        var audio = new Audio(sound);
        audio.play();
      }
    },
    commaFormat: d3.format(","),
  },
};
</script>

<style scoped>
.album-cover {
  width: 100px;
  height: 100px;
  object-fit: cover;
}

.hovered {
  filter: brightness(0.6);
  cursor: pointer;
}
</style>