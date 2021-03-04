<template>
  <section class="print" :style="{ '--columnsNb': width, '--rowsNb': height}">
    <div class="print__page">
      <div class="print__overview">
        <div class="print__overview__inner" :style="{ transform: `scale(${scaleSheets})`}">
          <div class="js-printPage" />
          <div class="print__overview__borders">
            <div v-for="(n, index) in totalNumber" :key="index" />
          </div>
        </div>
      </div>
    </div>
    <div v-for="(n, index) in totalNumber" :key="index" class="print__page" :style="{ '--x': Math.floor(index / width), '--y': index % width}">
      <div class="print__page__inner js-printPage" />
    </div>
  </section>
</template>

<script>
export default {
  name: 'Print',
  props: {
    template: {
      type: Object,
      default: null
    }
  },

  computed: {
    width () {
      return this.template.width
    },

    height () {
      return this.template.height
    },

    totalNumber () {
      return this.width * this.height
    },

    scaleSheets () {
      const sheetsHeight = this.height * 297
      const sheetsWidth = this.width * 420
      const sheetsRatio = sheetsWidth / sheetsHeight
      const windowRatio = (420 - 40) / (297 - 40)
      let scale = null
      if (sheetsRatio >= windowRatio) {
        scale = (420 - 40) / sheetsWidth
      } else {
        scale = (297 - 40) / sheetsHeight
      }
      return scale
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
  height: calc(297mm - 0.5px);
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

.print__overview {
  padding: 20mm;
}

.print__overview__inner {
  transform-origin: top left;
  position: relative;
}

.print__overview__borders {
  display: grid;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  border: 1px solid black;
  grid-template-columns: repeat(var(--columnsNb), 1fr);
  grid-template-rows: repeat(var(--rowsNb), 1fr);

  & > div {
    border: 1px solid black;
  }
}
</style>
