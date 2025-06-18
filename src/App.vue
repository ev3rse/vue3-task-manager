<template>
  <div class="container">
    <div class="wrapper">
      <HomeView />
    </div>
  </div>
</template>

<script setup lang="ts">
import HomeView from './views/HomeView.vue'
</script>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: rem(100) rem(10);
}

.wrapper {
  max-width: rem(400);
  width: 100%;
}
</style>
