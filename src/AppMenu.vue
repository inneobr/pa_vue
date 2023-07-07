<template>
	<AppSubmenu class="layout-menu" :items="model" :menuMode="menuMode" :menuActive="active" :isSlimOrHorItemClick="isSlimOrHorItemClick" :root="true" :parentMenuItemActive="true" :mobileMenuActive="mobileMenuActive" @menuitem-click="onMenuItemClick" @root-menuitem-click="onRootMenuItemClick"/>
</template>

<script>
import AppSubmenu from './AppSubmenu';

export default {
	name: "AppMenu",
	emits: ["menu-click", "menuitem-click", "root-menuitem-click", "carregarFavoritos"],
	props: {
		model: Array,
		menuMode: String,
		active: Boolean,
		mobileMenuActive: Boolean,
		isSlimOrHorItemClick: Boolean
	},
	components: {
		'AppSubmenu': AppSubmenu
	},
	methods: {
		onMenuClick(event) {
            this.$emit("menu-click", event);
        },
        onMenuItemClick(event) {
            this.$emit("menuitem-click", event);
        },
		onRootMenuItemClick(event) {
			this.$emit("root-menuitem-click", event);
		}
	}
}
</script>

<style scoped>

</style>