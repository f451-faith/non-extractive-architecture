<template>
  <section class="sheets">
    <div v-if="images">
      <img v-for="image in images" :key="image" :src="image">
    </div>
  </section>
</template>

<script>
export default {
  name: 'Sheets',
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
