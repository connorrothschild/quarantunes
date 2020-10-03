<template>
  <div>
    <div class="media">
      <div class="media-left">
        <figure class="image is-24x24">
          <img class="image is-rounded" :src="imageSrc" />
        </figure>
      </div>

      <div class="media-content">
        <p class="is-size-6 has-text-weight-bold">
          {{ name }}
        </p>
        <span class="icon is-small" style="display: inline-block">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
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

<style scoped></style>