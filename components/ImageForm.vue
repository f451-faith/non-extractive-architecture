<template>
  <section class="imageform">
    <div class="imageform__inner">
      <div class="imageform__header">
        <h1>Non-Extractive Architecture</h1>
        <h2>Research Software</h2>
      </div>
      <div class="imageform__body">
        <form class="imageform__body__inner js-imageFormBodyInner">
          <button class="imageform__button js-imageFormImageButton" @click="getImageForm">
            I want to build a module with image(s).
          </button>
          <button class="imageform__button js-imageFormTextButton">
            I want to build a text only module.
          </button>
          <div class="imageform__images js-imageFormInputContainer">
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
          <div class="imageform__submit js-imageFormSubmit">
            <input type="submit" name="submit" value="Create the composition">
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ImageForm',

  methods: {
    getImageForm (event) {
      event.preventDefault()
      const buttonText = document.querySelector('.js-imageFormTextButton')
      const buttonImage = document.querySelector('.js-imageFormImageButton')
      const formContainer = document.querySelector('.js-imageFormInputContainer')
      buttonText.classList.add('hidden')
      buttonImage.classList.add('inactive')

      setTimeout(() => {
        formContainer.style.display = 'flex'
        buttonText.style.display = 'none'
      }, 300)

      setTimeout(() => {
        formContainer.classList.add('active')
      }, 350)
    },

    displayImageName (event) {
      let fileName = ''
      if (event.target.files && event.target.files.length > 4) {
        document.querySelector('.js-imageFormBodyInner').reset()
        fileName = 'Please select 4 images or less'
      } else if (event.target.files && event.target.files.length > 1) {
        fileName = event.target.files.length + ' files selected'
      } else if (event.target.value) {
        fileName = event.target.value.split('\\').pop()
      }

      const labelVal = fileName || 'Upload between 1 and 4 image(s)'
      document.querySelector('.js-imageFormInputLabel').innerHTML = labelVal

      if ((event.target.files && event.target.files.length > 1) || event.target.value) {
        const bodyInner = document.querySelector('.js-imageFormBodyInner')
        const buttonImage = document.querySelector('.js-imageFormImageButton')
        const formContainer = document.querySelector('.js-imageFormInputContainer')
        const formSubmit = document.querySelector('.js-imageFormSubmit')

        if (!formSubmit.classList.contains('active')) {
          formContainer.classList.add('inactive')
          bodyInner.style.minHeight = bodyInner.clientHeight + 'px'
          bodyInner.style.minHeight = (bodyInner.clientHeight + buttonImage.clientHeight) + 'px'

          setTimeout(() => {
            formSubmit.style.display = 'flex'
          }, 300)

          setTimeout(() => {
            formSubmit.classList.add('active')
          }, 350)
        }
      }
    }
  }
}
</script>

<style lang="scss">
.imageform {
  display: flex;
  min-height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
  background-color: white;
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
  display: flex;
  flex-direction: column;
  transition-property: opacity, min-height;

  &.inactive {
    opacity: 0;
  }
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
    opacity: 0;
    pointer-events: none;
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
  display: none;
  opacity: 0;
  transition-property: opacity;

  &.active {
    opacity: 1;
  }

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

  & * {
      pointer-events: none;
  }
}

.imageform__submit {
  display: none;

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
    opacity: 0;
  }

  &.active input {
    opacity: 1
  }
}
</style>
