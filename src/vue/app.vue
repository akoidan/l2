<template>
  <div class="page-container">
    <router-view/>
  </div>
</template>
<style lang="scss">
@import '@/assets/sass/global-styles';
@import '@/assets/sass/global-variables';
</style>
<style lang="scss" scoped>
.page-container {
  display: flex;
  max-width: 100%;
  min-height: 100vh;
}
</style>
