<template>
  <section class="sheets" :data-template="template">
    <div ref="sheets" class="sheets__inner" :style="{ transform: `scale(${scaleSheets})`}">
      <div v-if="images" class="sheets__grid">
        <div v-for="(image, index) in images" :key="image" class="sheets__image">
          <img :src="image">
          <div class="sheets__image__number">
            {{ index + 1 }}
          </div>
        </div>
        <div class="sheets__titles">
          <div class="sheets__header">
            <div class="sheets__header__left">
              <div class="sheets__title">
                {{ formValue.title }}
              </div>
              <div class="sheets__subtitle">
                {{ formValue.subtitle }}
              </div>
            </div>
            <div class="sheets__header__right">
              <div class="sheets__arrow" :class="{ down: isDownArrow }" />
            </div>
          </div>
          <div class="sheets__captions">
            <div class="sheets__caption">
              <span class="sheets__caption__number">〈 1 〉</span>
              <span class="sheets__caption__text">Caption Image One, Auteur. Precise reference and copyrights, 2021</span>
            </div>
          </div>
        </div>
        <div class="sheets__texts">
          <div v-if="formValue.text" class="sheets__text" lang="en">
            <p>{{ formValue.text }}</p>
          </div>
          <div v-if="formValue.text || formValue.title || formValue.subtitle" class="sheets__text" lang="it">
            <p>{{ italianTitle }}</p>
            <p>{{ italianSubtitle }}</p>
            <p>{{ italianText }}</p>
          </div>
        </div>
      </div>
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
    },
    formValue: {
      type: Object,
      default: null
    }
  },

  data () {
    return {
      sheetsHeight: 0,
      windowHeight: window.innerHeight,
      templatesDown: [
        'template-3-4-1'
      ]
    }
  },

  computed: {
    scaleSheets () {
      const sheetsHeight = this.sheetsHeight
      const scale = (this.windowHeight - 20) / sheetsHeight
      return scale
    },

    isDownArrow () {
      if (this.templatesDown.includes(this.template)) { return true }
      return false
    },

    italianTitle () {
      return this.getTranslation(this.formValue.title)
    },

    italianSubtitle () {
      return this.getTranslation(this.formValue.subtitle)
    },

    italianText () {
      return this.getTranslation(this.formValue.text)
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.sheetsHeight = this.$refs.sheets.clientHeight
      window.addEventListener('resize', this.onResize)
    })
  },

  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },

  methods: {
    onResize () {
      this.windowHeight = window.innerHeight
    },

    getTranslation (text) {
      return text
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
  @extend .h2;
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
}

.sheets__inner {
  transform-origin: top left;
  border: 1px solid var(--color-blue);
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

  img {
    filter: grayscale(1);
  }

  & > div {
    overflow: hidden;
  }

  [data-template="template-1-2-1"] & {
    --columns: 1;
    --rows: 2;
  }

  [data-template="template-2-3-1"] & {
    --columns: 2;
    --rows: 3;
  }

  [data-template="template-3-4-1"] & {
    --columns: 3;
    --rows: 4;
  }
}

.sheets__image {
  padding: var(--outside);
  position: relative;

  [data-template="template-1-2-1"] & {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  [data-template="template-2-3-1"] & {
    grid-column: 1 / 3;
    grid-row: 1 / 3;

    img {
      @extend .cover;
    }
  }

  [data-template="template-3-4-1"] & {
    grid-column: 1 / 4;
    grid-row: 2 / 5;

    img {
      @extend .cover;
    }
  }
}

.sheets__image__number {
  position: absolute;
  bottom: calc(var(--outside) + 10mm);
  right: calc(var(--outside) + 10mm);
  line-height: 1;

  &:before {
    content: '〈 ';
  }

  &:after {
    content: ' 〉';
  }
}

.sheets__titles {
  padding: var(--outside);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  word-break: break-word;

  [data-template="template-1-2-1"] & {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }

  [data-template="template-2-3-1"] & {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
  }

  [data-template="template-3-4-1"] & {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }
}

.sheets__texts {
  padding: var(--outside);

  [data-template="template-1-2-1"] & {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }

  [data-template="template-2-3-1"] & {
    grid-column: 2 / 3;
    grid-row: 3 / 4;
  }

  [data-template="template-3-4-1"] & {
    grid-column: 2 / 3;
    grid-row: 1 / 2;
  }
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

.sheets__caption__number {
  margin-right: 10mm;
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

  p {
    white-space: pre;
  }

  &:not(:last-child) {
    margin-bottom: var(--space-xl-d);
  }

  &[lang="en"] {
    & p:first-child:before {
      content: "En  ";
      margin-right: 10mm;
      color: var(--color-subtitle)
    }
  }

  &[lang="it"] {
    & p:first-child:before {
      content: "It  ";
      margin-right: 10mm;
      color: var(--color-subtitle)
    }
  }
}
</style>
