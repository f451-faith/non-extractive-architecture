<template>
  <section class="sheets">
    <div ref="sheets" class="sheets__inner js-sheetsInner" :style="{ transform: `scale(${scaleSheets})`}" :data-template="template.name">
      <div v-if="displayedImages" class="sheets__grid" :style="{ '--columns': template.width, '--rows': template.height }">
        <div v-for="(image, index) in displayedImages" :key="index" :class="{ load: sheetsLoading }" :style="{ gridColumn: template.images[index].columns, gridRow: template.images[index].rows, margin: template.images[index].padding.replaceAll('1', 'var(--outside)') }" class="sheets__image">
          <img :src="image.ditheredImage">
          <div class="sheets__image__number">
            {{ index + 1 }}
          </div>
        </div>
        <div class="sheets__titles" :style="{ gridColumn: template.titles.columns, gridRow: template.titles.rows }">
          <div class="sheets__header">
            <div class="sheets__header__left">
              <div class="sheets__title" v-html="md(formValue.title)" />
              <div class="sheets__subtitle" v-html="md(formValue.subtitle)" />
            </div>
            <div v-if="formValue.title.length > 0" class="sheets__header__right">
              <div class="sheets__arrow" :class="{ down: template.arrow === 'down' }" />
            </div>
          </div>
          <div class="sheets__captions">
            <div v-for="(caption, index) in formValue.caption" :key="index" class="sheets__caption">
              <span class="sheets__caption__text" :style="{ '--number': index + 1 }" v-html="md(caption)" />
            </div>
          </div>
        </div>
        <div class="sheets__texts" :style="{ gridColumn: template.texts.columns, gridRow: template.texts.rows }">
          <div v-if="formValue.text" class="sheets__text" lang="en" v-html="md(formValue.text)" />
          <div v-if="formValue.text || formValue.title || formValue.subtitle" class="sheets__text" lang="it" v-html="md(italianTranslation)" />
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import marked from 'marked'

export default {
  name: 'Sheets',
  props: {
    baseImages: {
      type: Array,
      default: null
    },
    displayedImages: {
      type: Array,
      default: null
    },
    template: {
      type: Object,
      default: null
    },
    formValue: {
      type: Object,
      default: null
    },
    sheetsLoading: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      sheetsHeight: 0,
      sheetsWidth: 0,
      windowHeight: window.innerHeight,
      windowWidth: window.innerWidth - 420
    }
  },

  computed: {
    scaleSheets () {
      const sheetsHeight = this.sheetsHeight
      const sheetsWidth = this.sheetsWidth
      const sheetsRatio = sheetsWidth / sheetsHeight
      const windowRatio = this.windowWidth / this.windowHeight
      let scale = null
      if (sheetsRatio >= windowRatio) {
        scale = (this.windowWidth - 40) / sheetsWidth
      } else {
        scale = (this.windowHeight - 20) / sheetsHeight
      }
      return scale
    },

    italianTranslation () {
      return this.formValue.title + '\r\r' + this.formValue.subtitle + '\r\r' + this.formValue.text
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.sheetsHeight = this.$refs.sheets.clientHeight
      this.sheetsWidth = this.$refs.sheets.clientWidth
      window.addEventListener('resize', this.onResize)
    })
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    onResize () {
      this.windowHeight = window.innerHeight
      this.windowWidth = window.innerWidth - 420
    },

    md (str) {
      return marked(str)
    }
  }
}
</script>

<style lang="scss">
:root {
  --inside: 10mm;
  --outside: 20mm;
  --external: 40mm; // --outside * 2
  --aspect-ratio: 1.414;
}

.sheets {
  @include padding(2);
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;

  @include print {
    display: none;
  }
}

.sheets__inner {
  @extend .h2;
  transform-origin: top left;
  border: 1px solid var(--color-blue);

  .print & {
    border: none;
  }
}

.sheets__grid {
  --totalInside: calc(var(--inside) * (var(--rows) - 1));
  --cellWidth: calc((100vh - var(--external) - var(--totalInside)) / var(--rows) * var(--aspect-ratio));
  --rowsPercentage: calc(100% / var(--rows));
  --colsPercentage: calc(100% / var(--columns));
  display: grid;
  grid-column-gap: var(--inside);
  grid-row-gap: var(--inside);
  grid-template-columns: repeat(var(--columns), 420mm);
  grid-template-rows: repeat(var(--rows), 297mm);
  mask-composite: source-in, xor;
  mask-image: linear-gradient(90deg, transparent 0%, transparent calc(var(--inside) / 2), black calc(var(--inside) / 2), black calc(100% - var(--inside) / 2), transparent calc(100% - var(--inside) / 2), transparent calc(100% + var(--inside) / 2)),
              linear-gradient(transparent 0%, transparent calc(var(--inside) / 2), black calc(var(--inside) / 2), black calc(100% - var(--inside) / 2), transparent calc(100% - var(--inside) / 2), transparent calc(100% + var(--inside) / 2));
  mask-repeat: repeat;
  mask-size: var(--colsPercentage) var(--rowsPercentage);
  mask-position: top left;

  .print & {
    mask: none;
    grid-column-gap: 0;
    grid-row-gap: 0;
  }

  img {
    filter: grayscale(1);
  }

  & > div {
    overflow: hidden;
  }
}

.sheets__image {
  position: relative;

  img {
    @extend .cover;
  }

  &.load {
    background-color: var(--color-blue);

    img {
      opacity: 0;
    }

    &:after {
      content: 'Loading…';
      position: absolute;
      top: 10mm;
      left: 10mm;
      background: white;
    }
  }
}

.sheets__image__number {
  position: absolute;
  bottom: 10mm;
  right: 10mm;
  line-height: 1;
  display: flex;
  align-items: center;
  background-color: white;

  &:before {
    content: '〈 ';
    margin-top: -5px;
    display: flex;
    white-space: pre;
  }

  &:after {
    content: ' 〉';
    margin-top: -5px;
    display: flex;
    white-space: pre;
  }
}

.sheets__titles {
  padding: var(--outside);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  word-break: break-word;

  p {
    white-space: pre;
  }
}

.sheets__texts {
  padding: var(--outside);
}

.sheets__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.sheets__subtitle {
  color: var(--color-subtitle)
}

.sheets__captions {
  @extend .h3;
}

.sheets__caption__text {
  p:first-child:before {
    counter-increment: caption var(--number);
    content: '〈 ' counter(caption) ' 〉';
    margin-right: 10mm;
  }
}

.sheets__arrow {
  &:before {
    content: '';
  }

  &.down:before {
    content: '';
  }
}

.sheets__text {
  word-break: break-word;

  &:not(:last-child) {
    margin-bottom: var(--space-xl-d);
  }

  &[lang="en"] {
    p:first-child:before {
      content: "En  ";
      margin-right: 10mm;
      color: var(--color-subtitle)
    }
  }

  &[lang="it"] {
    p:first-child:before {
      content: "It  ";
      margin-right: 10mm;
      color: var(--color-subtitle)
    }
  }
}
</style>
