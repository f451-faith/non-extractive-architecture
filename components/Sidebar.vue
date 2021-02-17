<template>
  <section class="sidebar" />
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    images: {
      type: Array,
      default: null
    },
    template: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
</style>
