<template>
	<div>
		<div class="level is-mobile mb-0">
			<div class="level-left"></div>
			<div class="level-right">
				<div class="level-item">
					<b-dropdown position="is-bottom-left" aria-role="list">
						<button class="button is-transparent" slot="trigger">
							<div class="media">
								<div class="media-left">
									<figure class="image is-24x24">
										<img
											v-if="imageSrc"
											class="image is-rounded"
											:src="imageSrc"
										/>
									</figure>
								</div>

								<div
									class="media-content vertical-center-content is-hidden-mobile"
								>
									<p class="is-size-6 has-text-weight-bold">
										{{ name }}
									</p>
									<!-- <span class="icon has-text-white">
										<i
											:class="active ? 'fas fa-angle-up' : 'fas fa-angle-down'"
										></i>
									</span> -->
								</div>
							</div>
						</button>

						<!-- <b-dropdown-item class="is-dark" aria-role="listitem">
							Share to Instagram
						</b-dropdown-item> -->
						<b-dropdown-item aria-role="listitem"
							><a
								target="_blank"
								href="https://github.com/connorrothschild/quarantunes"
								>See the Code</a
							></b-dropdown-item
						>
						<b-dropdown-item aria-role="listitem"
							><a target="_blank" href="https://connorrothschild.com"
								>Who Made This?</a
							></b-dropdown-item
						>
					</b-dropdown>
				</div>
			</div>
		</div>
		<div class="level is-mobile">
			<div class="level-left">
				<div class="media mb-4 vertical-center-content">
					<div class="media-left">
						<a :href="spotifyUrl" target="_blank">
							<figure class="image is-96x96">
								<img v-if="imageSrc" class="is-rounded" :src="imageSrc" />
								<img
									v-else
									class="is-rounded"
									src="https://raw.githubusercontent.com/connorrothschild/quarantunes/master/images/placeholder.png"
								/>
							</figure>
						</a>
					</div>
					<div class="media-content">
						<p class="heading is-size-6 is-size-6-desktop is-size-7-mobile">
							Quarantunes
						</p>
						<!-- <p class="heading">quarantune.netlify.app</p> -->

						<p
							class="is-size-3 is-size-3-desktop is-size-4-mobile has-text-weight-bold"
						>
							{{ name }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: "Dropdown",
	props: ["spotifyUrl", "imageSrc", "name"],
};
</script>

<style lang="scss" scoped>
.dropdown-item:hover {
	background-color: rgb(64, 64, 64);
	color: white;
	a:hover {
		color: white;
	}
}

.is-transparent {
	background: transparent;
	border: transparent;
}
</style>