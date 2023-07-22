<template>
  <div class="app">
    <navbar />
    <div class="app__content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Navbar from "@/components/navbar.vue";
import "@/assets/main.scss";
</script>

<style lang="scss">
.app {
  position: relative;
  display: flex;
  flex-direction: column;

  &__content {
    height: 100%;
  }
}
</style>
