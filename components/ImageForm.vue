<template>
  <section class="imageform" :class="{ inactive: getSidebar }">
    <div class="imageform__inner">
      <div class="imageform__header">
        <h1>Non-Extractive Architecture</h1>
        <h2>Exhibition Format Editor</h2>
      </div>
      <div class="imageform__body">
        <div class="imageform__body__inner js-imageFormBodyInner" :class="{ inactive: bodyInnerInactive }">
          <form v-if="showForm" class="imageform__body__form js-imageFormBodyForm" @submit.prevent="processForm">
            <button class="imageform__button js-imageFormImageButton" :class="{ hidden: showTextInput, inactive: showImageInput }" @click.prevent="getImageForm">
              I want to build a module with image(s).
            </button>
            <button class="imageform__button js-imageFormTextButton" :class="{ hidden: showImageInput, inactive: showTextInput }" @click.prevent="getTextForm">
              I want to build a text only module.
            </button>
            <div v-if="showImageInput" class="imageform__images js-imageFormInputContainer" :class="{ inactive: showImageSubmit }">
              <input
                id="images"
                type="file"
                name="images[]"
                class="js-imageFormInputFile"
                multiple
                @change="displayImageName"
              >
              <label for="images" class="imageform__label js-imageFormInputLabel">Upload between 1 and 3 image(s)</label>
            </div>
            <div v-if="showImageSubmit" class="imageform__submit js-imageFormSubmit">
              <input type="submit" name="submit" value="Create the composition">
            </div>
          </form>
          <div v-else class="imageform__body__templates">
            <div class="imageform__body__help">
              <div v-if="showImageInput">
                Choose a template for your module
              </div>
              <div v-if="showTextInput">
                I want the typeface to be…
              </div>
            </div>
            <div v-if="showImageInput" class="imageform__body__buttons">
              <div v-for="(template, index) in filteredTemplates" :key="index" class="imageform__body__template" @click="chooseImageTemplate(template)">
                <img :src="getImageSrc(template)">
              </div>
            </div>
            <div v-if="showTextInput" class="imageform__body__buttons">
              <div v-for="(template, index) in textTemplates" :key="index" class="imageform__body__template" @click="chooseTextTemplate(template)">
                <span>{{ template.title }}</span>
              </div>
            </div>
            <div :class="{ load: formLoading }" class="imageform__body__loading">
              Processing your images…
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import templates from '@/assets/json/templates.json'

export default {
  name: 'ImageForm',
  props: {
    formLoading: {
      type: Boolean,
      default: false
    },
    baseImages: {
      type: Array,
      default: null
    }
  },

  data () {
    return {
      imageNumber: null,
      getSidebar: false,
      showForm: true,
      showImageInput: false,
      showTextInput: false,
      showImageSubmit: false,
      bodyInnerInactive: false,
      textTemplates: [
        {
          name: 'T1',
          title: 'Small',
          width: 2,
          height: 1,
          fontSize: '109px'
        },
        {
          name: 'T2',
          title: 'Medium',
          width: 3,
          height: 1,
          fontSize: '139px'
        },
        {
          name: 'T3',
          title: 'Large',
          width: 4,
          height: 1,
          fontSize: '160px'
        }
      ],
      templates
    }
  },

  computed: {
    filteredTemplates () {
      const images = this.baseImages
      const ratios = []
      images.forEach((img) => {
        if (img.ratio < 1) { ratios.push('portrait') }
        if (img.ratio >= 1) { ratios.push('landscape') }
      })
      return this.templates.filter((t) => {
        const imagesTemplate = t.images
        const ratiosTemplate = []
        imagesTemplate.forEach((img) => {
          ratiosTemplate.push(img.orientation)
        })
        const ratiosTemplateSorted = ratiosTemplate.slice().sort()
        return ratios.length === ratiosTemplateSorted.length && ratios.slice().sort().every(function (value, index) {
          return value === ratiosTemplateSorted[index]
        })
      })
    }
  },

  methods: {
    getImageSrc (image) {
      return require('@/assets/images/' + image.name + '.svg')
    },

    getImageForm () {
      this.showImageInput = true
    },

    getTextForm () {
      this.showForm = false
      this.showTextInput = true
    },

    displayImageName (event) {
      let fileName = ''
      if (event.target.files && event.target.files.length > 3) {
        document.querySelector('.js-imageFormBodyForm').reset()
        fileName = 'Please select 3 images or less'
      } else if (event.target.files && event.target.files.length > 1) {
        fileName = event.target.files.length + ' files selected'
      } else if (event.target.value) {
        fileName = event.target.value.split('\\').pop()
      }

      const labelVal = fileName || 'Upload between 1 and 3 image(s)'
      document.querySelector('.js-imageFormInputLabel').innerHTML = labelVal

      if ((event.target.files && event.target.files.length > 1) || event.target.value) {
        this.showImageSubmit = true
      }
    },

    processForm () {
      const files = document.querySelector('.js-imageFormInputFile').files
      if (!files.length) { return }
      this.imageNumber = files.length
      this.$emit('submitImagesToParent', files)
      this.bodyInnerInactive = true
      setTimeout(() => {
        this.showForm = false
        this.bodyInnerInactive = false
      }, 300)
    },

    chooseImageTemplate (template) {
      this.$emit('submitImageTemplateToParent', template)
    },

    chooseTextTemplate (template) {
      this.$emit('submitTextTemplateToParent', template)
    }
  }
}
</script>

<style lang="scss">
.imageform {
  @extend .transition;
  display: flex;
  min-height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
  background-color: white;

  &.inactive {
    opacity: 0;
    pointer-events: none;
  }
}

.imageform__inner {
  width: 450px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px 0px rgba(0,0,255,0.25);
  border-radius: 5px;
}

.imageform__header {
  @include padding(1);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-blue);
}

.imageform__body {
  @include padding(1);
  display: flex;
  flex-direction: column;
}

.imageform__body__inner {
  @extend .transition;

  &.inactive {
    opacity: 0;
    pointer-events: none;
  }
}

.imageform__body__form {
  display: flex;
  flex-direction: column;
}

.imageform__button {
  @extend .transition;
  @include padding(4);
  background-color: white;
  color: var(--color-blue);
  border: 1px solid var(--color-blue);
  border-radius: 5px;
  cursor: pointer;
  outline: none;

  &.hidden {
    display: none
  }

  &.inactive {
    @include padding(1 4);
    background-color: var(--color-grey);
    border-color: var(--color-grey);
    color: var(--color-darkgrey);
    cursor: default;
  }

  &:first-child {
    @include margin(0 0 1 0);
  }

  &:not(.inactive):hover {
    background-color: var(--color-blue);
    color: white
  }
}

.imageform__images {
  @extend .transition;
  width: 100%;
  position: relative;
  background-color: var(--color-blue);
  color: white;
  border: 1px solid var(--color-blue);
  border-radius: 5px;
  display: flex;
  transition-property: opacity;

  &.inactive {
    background-color: var(--color-grey);
    border-color: var(--color-grey);
    color: var(--color-darkgrey);
    cursor: default;
  }

  input {
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
  }
}

.imageform__label {
  @include padding(4);
  text-align: center;
  cursor: pointer;
  outline: none;
  width: 100%;
  line-height: 18px;
  word-break: break-word;

  & * {
    pointer-events: none;
  }
}

.imageform__submit {
  display: flex;

  input {
    @extend .transition;
    @include margin(1 0 0 0);
    @include padding(1 4);
    background-color: var(--color-blue);
    color: white;
    border: 1px solid var(--color-blue);
    border-radius: 5px;
    cursor: pointer;
    outline: none;
    width: 100%;
    opacity: 1
  }
}

.imageform__body__help {
  @include margin(0 0 1 0);
  @include padding(1 4);
  background-color: var(--color-grey);
  color: var(--color-darkgrey);
  border: 1px solid var(--color-grey);
  border-radius: 5px;
  text-align: center
}

.imageform__body__buttons {
  @include margin(-0.5);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.imageform__body__templates {
  position: relative
}

.imageform__body__template {
  @include margin(0.5);
  cursor: pointer;
  border: 1px solid var(--color-grey);
  border-radius: 5px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 100%;
    width: auto;
  }

  span {
    @include padding(0 4);
  }

  &:hover {
    border-color: var(--color-blue);
  }
}

.imageform__body__loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-blue);
  opacity: 0;
  pointer-events: none;
  background-color: white;

  &.load {
    opacity: 1;
    pointer-events: initial;
  }
}
</style>
