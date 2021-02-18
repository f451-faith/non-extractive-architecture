<template>
  <section class="print" :style="{ '--columnsNb': width, '--rowsNb': height}">
    <div v-for="(n, index) in totalNumber" :key="n" class="print__page" :style="{ '--x': Math.floor(index / width), '--y': index % width}">
      <div class="print__page__inner js-printPage" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'Print',
  props: {
    template: {
      type: String,
      default: ''
    }
  },

  computed: {
    width () {
      return this.template.charAt(9)
    },

    height () {
      return this.template.charAt(11)
    },

    totalNumber () {
      return this.width * this.height
    }
  }
}
</script>

<style lang="scss">
.print {
  display: none;
  flex-direction: column;
  pointer-events: none;

  @include print {
    display: flex;
  }
}

.print__page {
  display: flex;
  width: 420mm;
  height: 297mm;
  overflow: hidden;
}

.print__page__inner {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  transform: translate(calc(-100% * var(--y)), calc(-100% * var(--x)));
}
</style>
