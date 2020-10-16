<template>
<div>
  <div class="level is-mobile mb-0">
    <div class="level-left"></div>
    <div class="level-right">
      <div class="level-item">
        <b-dropdown position="is-bottom-left" aria-role="list">
          <button
            class="button is-transparent"
            slot="trigger"
            slot-scope="{ active }"
          >
            <div class="media">
              <div class="media-left">
                <figure class="image is-24x24">
                  <img class="image is-rounded" :src="imageSrc" />
                </figure>
              </div>

              <div class="media-content vertical-center-content">
                <p class="is-size-6 has-text-weight-bold mr-">
                  {{ name }}
                </p>
                <span class="icon has-text-white">
                  <i
                    :class="active ? 'fas fa-angle-up' : 'fas fa-angle-down'"
                  ></i>
                </span>
              </div>
            </div>
          </button>

          <b-dropdown-item class="is-dark" aria-role="listitem">
            Share to Instagram
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem">See the Code</b-dropdown-item>
          <b-dropdown-item aria-role="listitem">Something else</b-dropdown-item>
        </b-dropdown>
      </div>
    </div>
  </div>
  <div class="level is-mobile">
    <div class="level-left">
      <div class="media mb-4 vertical-center-content">
        <div class="media-left">
          <a :href="spotifyUrl">
            <figure class="image is-96x96">
              <img class="image is-rounded" :src="imageSrc" />
            </figure>
          </a>
        </div>
        <div class="media-content">
          <p class="heading is-size-6">User</p>
          <p class="is-size-3 has-text-weight-bold">
            {{ name }}
          </p>
        </div>
      </div>
    </div>
  </div>
  </div>

  <!-- <div class="dropdown is-right">
    <div class="dropdown-trigger">
      <button
        class="button"
        aria-haspopup="true"
        aria-controls="dropdown-menu2"
      >
        <figure class="image is-24x24">
          <img class="image is-rounded" :src="imageSrc" />
        </figure>
        <p class="is-size-6 has-text-weight-bold">
          {{ name }}
        </p>
        <span class="icon is-small">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </button>
    </div>
    <div class="dropdown-menu" id="dropdown-menu2" role="menu">
      <div class="dropdown-content">
        <div class="dropdown-item">
          <p>
            You can insert <strong>any type of content</strong> within the
            dropdown menu.
          </p>
        </div>
        <hr class="dropdown-divider" />
        <div class="dropdown-item">
          <p>You simply need to use a <code>&lt;div&gt;</code> instead.</p>
        </div>
        <hr class="dropdown-divider" />
        <a href="#" class="dropdown-item"> This is a link </a>
      </div>
    </div>
  </div> -->
</template>

<script>
export default {
  name: "Dropdown",
  props: ["spotifyUrl", "imageSrc", "name"],
};
</script>

<style scoped>
.dropdown-item:hover {
  background-color: rgb(64, 64, 64);
  color: white;
}

.is-transparent {
  background: transparent;
  border: transparent;
}
</style>