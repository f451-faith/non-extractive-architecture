<template>
  <section class="sheets">
    <div ref="sheets" class="sheets__inner js-sheetsInner" :style="{ transform: `scale(${scaleSheets})`}" :data-template="template.name">
      <div v-if="displayedImages && displayedImages.length > 0" class="sheets__grid" :style="{ '--columns': template.width, '--rows': template.height }">
        <div v-for="(image, index) in displayedImages" :key="'image' + index" :class="{ load: sheetsLoading }" :style="{ gridColumn: template.images[index].columns, gridRow: template.images[index].rows, margin: template.images[index].padding.replaceAll('1', 'var(--outside)') }" class="sheets__image">
          <div v-if="isSingleTemplate(template)" class="sheets__header sheets__header--image">
            <div class="sheets__header__left">
              <div class="sheets__title" v-html="md(formValue.title)" />
              <div class="sheets__subtitle" v-html="md(formValue.subtitle)" />
            </div>
            <div class="sheets__header__right">
              <div class="sheets__arrow" :class="{ down: template.arrow === 'down' }" />
            </div>
          </div>
          <div class="sheets__image__container">
            <img :class="{ contain: displayedImages.length === 1 && formatImage == 'contain'}" :src="image.ditheredImage">
            <div class="sheets__image__number">
              {{ index + 1 }}
            </div>
          </div>
        </div>
        <div v-if="!isSingleTemplate(template)" class="sheets__titles" :style="{ gridColumn: template.titles.columns, gridRow: template.titles.rows }">
          <div class="sheets__header" :class="{ invert: template.arrow === 'left'}">
            <div class="sheets__header__left">
              <div class="sheets__title" v-html="md(formValue.title)" />
              <div class="sheets__subtitle" v-html="md(formValue.subtitle)" />
            </div>
            <div v-if="formValue.title.length > 0" class="sheets__header__right">
              <div class="sheets__arrow" :class="template.arrow" />
            </div>
          </div>
          <div class="sheets__captions">
            <div v-for="(caption, index) in formValue.caption" :key="'caption' + index" class="sheets__caption">
              <span class="sheets__caption__text" :style="{ '--number': index + 1 }" v-html="md(caption)" />
            </div>
          </div>
        </div>
        <div class="sheets__texts" :style="{ gridColumn: template.texts.columns, gridRow: template.texts.rows }">
          <div>
            <div v-if="formValue.text" class="sheets__text" lang="en" v-html="md(formValue.text)" />
            <div v-if="formValue.text || formValue.title || formValue.subtitle" class="sheets__text" lang="it" v-html="italianString" />
          </div>
          <div v-if="isSingleTemplate(template)" class="sheets__captions">
            <div v-for="(caption, index) in formValue.caption" :key="'caption' + index" class="sheets__caption">
              <span class="sheets__caption__text" :style="{ '--number': index + 1 }" v-html="md(caption)" />
            </div>
          </div>
        </div>
      </div>
      <div v-else class="sheets__grid" :style="{ '--columns': template.width, '--rows': template.height, '--size': template.fontSize }">
        <div class="sheets__text__item" lang="en" v-html="md(formValue.text)" />
      </div>
    </div>
  </section>
</template>

<script>
import marked from 'marked'
import { debounce } from 'debounce'

export default {
  name: 'Sheets',
  props: {
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
    formatImage: {
      type: String,
      default: 'cover'
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
      windowWidth: window.innerWidth - 470,
      italianString: '',
      italianText: {
        title: '',
        subtitle: '',
        text: ''
      }
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
    }
  },

  watch: {
    formValue: {
      handler () {
        this.debouncedGetTranslation()
      },
      deep: true
    }
  },

  created () {
    this.debouncedGetTranslation = debounce(this.getItalianTranslation, 300)
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
      this.windowWidth = window.innerWidth - 470
    },

    md (str) {
      return marked(str)
    },

    isSingleTemplate (template) {
      if (template.titles.columns === template.texts.columns && template.titles.rows === template.texts.rows) { return true }
      return false
    },

    async getItalianTranslation () {
      const titleEN = encodeURI(this.formValue.title)
      const subtitleEN = encodeURI(this.formValue.subtitle)
      const textEN = encodeURI(this.formValue.text)
      const deepl = await this.$axios.$get(`https://api.deepl.com/v2/translate?auth_key=4430afb5-ae5b-090d-8bf0-cec1abd97303&text=${titleEN}&text=${subtitleEN}&text=${textEN}&target_lang=it&source_lang=en&preserve_formatting=1`)
      const titleIT = deepl.translations[0].text
      const subtitleIT = deepl.translations[1].text
      const textIT = deepl.translations[2].text
      this.italianText = {
        title: titleIT,
        subtitle: subtitleIT,
        text: textIT
      }
      this.italianString = this.md(this.italianText.title + '\r\r' + this.italianText.subtitle + '\r\r' + this.italianText.text)
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
  -webkit-mask-composite: source-in, xor;
  mask-composite: intersect;
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
  display: flex;
  flex-direction: column;

  img {
    @extend .cover;

    &.contain {
      object-fit: contain;
      object-position: top left;
      width: 100%;
      height: 100%;
    }
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

.sheets__image__container {
  overflow: hidden;
  position: relative;
  height: 100%;
  width: 100%;
}

.sheets__image__number {
  position: absolute;
  top: 10mm;
  left: 10mm;
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
}

.sheets__texts {
  padding: var(--outside);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.sheets__header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  &--image {
    margin-bottom: var(--inside);
    min-height: 2em;
  }
}

.sheets__header__left {
  margin-right: var(--outside);

  .sheets__header.invert & {
    margin-right: 0;
    margin-left: var(--outside);
    order: 1;
  }
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
  &.up:before {
    content: '';
  }

  &.down:before {
    content: '';
  }

  &.left:before {
    content: '';
  }

  &.right:before {
    content: '';
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

.sheets__text__item {
  word-break: break-word;
  margin: var(--outside);
  grid-column: 1 / -1;
  grid-row: 1 / -1;
  font-size: var(--size);
}
</style>
