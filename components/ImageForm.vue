<template>
  <section class="imageform" :class="{ inactive: getSidebar }">
    <div class="imageform__inner">
      <div class="imageform__header">
        <h1>Non-Extractive Architecture</h1>
        <h2>Research Software</h2>
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
              <label for="images" class="imageform__label js-imageFormInputLabel">Upload between 1 and 4 image(s)</label>
            </div>
            <div v-if="showImageSubmit" class="imageform__submit js-imageFormSubmit">
              <input type="submit" name="submit" value="Create the composition">
            </div>
          </form>
          <div v-else class="imageform__body__templates">
            <div class="imageform__body__help">
              Choose a template for your module
            </div>
            <div class="imageform__body__buttons">
              <div v-for="template in filteredTemplates" :key="template" class="imageform__body__template" @click="chooseTemplate(template)">
                <img :src="getImageSrc(template)">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ImageForm',

  data () {
    return {
      imageNumber: null,
      getSidebar: false,
      showForm: true,
      showImageInput: false,
      showTextInput: false,
      showImageSubmit: false,
      bodyInnerInactive: false,
      templates: [
        'template-1-2-1',
        'template-2-3-1',
        'template-3-4-1',
        'template-1-2-2',
        'template-2-3-2',
        'template-3-4-2',
        'template-1-2-3',
        'template-2-3-3',
        'template-3-4-3',
        'template-1-2-4',
        'template-2-3-4',
        'template-3-4-4'
      ]
    }
  },

  computed: {
    filteredTemplates () {
      const number = this.imageNumber.toString().trim()
      return this.templates.filter(t => t.slice(-1) === number)
    }
  },

  methods: {
    getImageSrc (image) {
      return require('@/assets/images/' + image + '.svg')
    },

    getImageForm () {
      this.showImageInput = true
    },

    getTextForm () {
      this.showTextInput = true
    },

    displayImageName (event) {
      let fileName = ''
      if (event.target.files && event.target.files.length > 4) {
        document.querySelector('.js-imageFormBodyForm').reset()
        fileName = 'Please select 4 images or less'
      } else if (event.target.files && event.target.files.length > 1) {
        fileName = event.target.files.length + ' files selected'
      } else if (event.target.value) {
        fileName = event.target.value.split('\\').pop()
      }

      const labelVal = fileName || 'Upload between 1 and 4 image(s)'
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

    chooseTemplate (template) {
      this.$emit('submitTemplateToParent', template)
      this.getSidebar = true
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
  width: 400px;
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
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.imageform__body__template {
  cursor: pointer;
  border: 1px solid var(--color-blue);
  border-radius: 5px;

  img {
    width: 65px;
  }

  &:hover {
    background-color: var(--color-blue);
  }

  &:not(:last-child) {
    @include margin(0 1 0 0);
  }
}
</style>
