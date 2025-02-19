<template>
  <section class="sidebar">
    <div class="sidebar__inner">
      <div class="sidebar__header">
        <h1>Non-Extractive Architecture</h1>
        <h2>Exhibition Format Editor</h2>
      </div>
      <div class="sidebar__body">
        <div class="sidebar__form">
          <div v-if="displayedImages.length > 0" class="sidebar__item">
            <div class="sidebar__item__header">
              <label class="sidebar__item__label" for="title">Title</label>
              <div class="sidebar__input__length" :class="{ error: formValue.title.length >= 100 }">
                <span>{{ formValue.title.length }}</span><span>100</span>
              </div>
            </div>
            <textarea
              id="title"
              v-model="formValue.title"
              class="sidebar__input__area"
              name="title"
              maxlength="100"
              rows="1"
              @input="autogrow"
              @focus="autogrow"
            />
          </div>
          <div v-if="displayedImages.length > 0" class="sidebar__item" :class="{ disabled: formValue.title.length === 0 }">
            <div class="sidebar__item__header">
              <label class="sidebar__item__label" for="subtitle">Subtitle/Author</label>
              <div class="sidebar__input__length" :class="{ error: formValue.subtitle.length >= 100 }">
                <span>{{ formValue.subtitle.length }}</span><span>100</span>
              </div>
            </div>
            <textarea
              id="subtitle"
              v-model="formValue.subtitle"
              class="sidebar__input__area"
              name="subtitle"
              maxlength="100"
              rows="1"
              @input="autogrow"
              @focus="autogrow"
            />
          </div>
          <div v-if="displayedImages.length > 0" class="sidebar__item" :class="{ disabled: formValue.title.length === 0 || formValue.subtitle.length === 0 }">
            <div class="sidebar__item__header">
              <label class="sidebar__item__label" for="text_english">Your text</label>
              <div class="sidebar__input__length" :class="{ error: formValue.text.length >= 400 }">
                <span>{{ formValue.text.length }}</span><span>400</span>
              </div>
            </div>
            <textarea
              id="text_english"
              v-model="formValue.text"
              class="sidebar__input__area"
              name="text_english"
              maxlength="400"
              rows="2"
              @input="autogrow"
              @focus="autogrow"
            />
          </div>
          <div v-if="displayedImages.length === 0" class="sidebar__item">
            <div class="sidebar__item__header">
              <label class="sidebar__item__label" for="text_english">Your text</label>
              <div class="sidebar__input__length" :class="{ error: formValue.text.length >= 500 }">
                <span>{{ formValue.text.length }}</span><span>500</span>
              </div>
            </div>
            <textarea
              id="text_english"
              v-model="formValue.text"
              class="sidebar__input__area"
              name="text_english"
              maxlength="500"
              rows="2"
              @input="autogrow"
              @focus="autogrow"
            />
          </div>
          <div v-if="displayedImages.length > 0" class="sidebar__item">
            <div class="sidebar__check">
              <label class="sidebar__check__container" for="translation">
                Disable Italian translation on title and subtitle
                <input
                  id="translation"
                  type="checkbox"
                  name="translation"
                  value="translation"
                  @change="changeTranslation"
                >
                <span class="sidebar__checkmark" />
              </label>
            </div>
          </div>
        </div>
        <div v-for="(image, index) in displayedImages" :key="'image' + index" class="sidebar__form">
          <div v-if="displayedImages.length > 1" class="sidebar__item">
            <div class="sidebar__item__header">
              <label class="sidebar__item__label" :for="'select' + index">Image {{ index + 1 }}</label>
            </div>
            <select :id="'select' + index" :name="'select' + index" :class="{ load: sheetsLoading }" @change="changeImageDisplayed(index, $event)">
              <option v-for="(img, i) in $store.state.images.array" :key="'select' + i" :value="img.name.replace(/\.[^/.]+$/, '')" :selected="img.name === image.name">
                {{ img.name }}
              </option>
            </select>
          </div>
          <div v-else class="sidebar__item">
            <div class="sidebar__item__header">
              <div class="sidebar__item__label">
                Image {{ index + 1 }}
              </div>
            </div>
            <div class="sidebar__radio">
              <div>
                <input
                  id="cover-fill"
                  type="radio"
                  name="cover"
                  value="cover"
                  :checked="formatImage === 'cover'"
                  @change="changeFormatImage"
                >
                <label for="cover-fill">Fill</label>
              </div>
              <div>
                <input
                  id="cover-fit"
                  type="radio"
                  name="cover"
                  value="contain"
                  :checked="formatImage === 'contain'"
                  @change="changeFormatImage"
                >
                <label for="cover-fit">Fit</label>
              </div>
            </div>
          </div>
          <div class="sidebar__item">
            <div class="sidebar__item__header">
              <label class="sidebar__item__label" :for="'caption' + index">Caption image {{ index + 1 }}</label>
              <div class="sidebar__input__length" :class="{ error: formValue.caption[index].length >= 200 }">
                <span>{{ formValue.caption[index].length }}</span><span>200</span>
              </div>
            </div>
            <textarea
              :id="'caption' + index"
              v-model="formValue.caption[index]"
              class="sidebar__input__area"
              :name="'caption' + index"
              maxlength="200"
              rows="1"
              @input="autogrow"
              @focus="autogrow"
            />
          </div>
        </div>
        <div class="sidebar__form">
          <button class="sidebar__button" :class="{ disabled: (displayedImages.length > 0 && (formValue.title.length === 0 || formValue.subtitle.length === 0 || formValue.text.length === 0)) || (displayedImages.length === 0 && formValue.text.length === 0) }" @click.prevent="printSheets">
            Print the composition
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Sidebar',
  props: {
    displayedImages: {
      type: Array,
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
    translation: {
      type: Boolean,
      default: true
    },
    sheetsLoading: {
      type: Boolean,
      default: false
    },
    templateType: {
      type: String,
      default: 'image'
    }
  },

  methods: {
    autogrow (event) {
      const el = event.target
      const rows = el.getAttribute('rows')
      el.style.minHeight = '0'
      el.style.height = '5px'
      el.style.minHeight = (rows * 18 + 12) + 'px'
      el.style.height = (el.scrollHeight + 2) + 'px'
    },

    printSheets () {
      const sheets = document.querySelector('.js-sheetsInner')
      const printPages = document.querySelectorAll('.js-printPage')
      Array.from(printPages).forEach((page) => {
        const clone = sheets.cloneNode(true)
        clone.style = ''
        page.innerHTML = ''
        page.appendChild(clone)
      })
      window.print()

      window.addEventListener('afterprint', function () {
        Array.from(printPages).forEach((page) => {
          page.innerHTML = ''
        })
      })
    },

    changeImageDisplayed (index, event) {
      const imageText = event.target.value
      const item = this.$store.state.images.array.find((obj) => { return obj.name.replace(/\.[^/.]+$/, '') === imageText })
      this.displayedImages[index] = item
      this.$emit('displayedImagesUpdate', this.displayedImages)
    },

    changeFormatImage (event) {
      this.$emit('formatImageUpdate', event.target.value)
    },

    changeTranslation (event) {
      this.$emit('translationUpdate', !event.target.checked)
    }
  }
}
</script>

<style lang="scss">
.sidebar {
  @include padding(2);
  position: fixed;
  max-height: calc(100vh - 2em - 20px);
  display: flex;
  right: 0;
  top: 0;

  @include print {
    display: none;
  }
}

.sidebar__inner {
  width: 450px;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 0px 10px 0px rgba(0,0,255,0.25);
  border-radius: 5px;
  background: white;
}

.sidebar__header {
  @include padding(1);
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-blue);
}

.sidebar__body {
  @include padding(1);
  display: flex;
  flex-direction: column;
  overflow: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

.sidebar__form {
  display: flex;
  flex-direction: column;

  &:not(:last-child) {
    @include padding(0 0 2 0);
    @include margin(0 0 2 0);
    border-bottom: 1px solid var(--color-grey);
  }
}

.sidebar__item {
  @extend .transition;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition-property: opacity;

  &.disabled {
    opacity: 0.25;

    textarea {
      pointer-events: none;
    }
  }

  &:not(:last-child) {
    @include margin(0 0 2 0);
  }

  select {
    @include padding(1 10 1 4);
    border: 1px solid var(--color-blue);
    background-color: white;
    color: var(--color-blue);
    border-radius: 5px;
    width: 100%;
    outline: none;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-image: url(~@/assets/images/arrow-s.svg);
    background-repeat: no-repeat;
    background-position-x: calc(100% - 20px);
    background-position-y: center;
    background-size: auto 50%;
    cursor: pointer;

    &.load {
      background-color: var(--color-blue);
      color: white;
      pointer-events: none
    }
  }

  textarea {
    @include padding(1 4);
    background-color: white;
    border: 1px solid var(--color-blue);
    color: var(--color-blue);
    border-radius: 5px;
    outline: none;
    width: 100%;
    resize: none;

    &::placeholder {
      color: var(--color-blue);
      opacity: 0.25;
    }
  }
}

.sidebar__check__container {
  display: flex;
  align-items: center;
  position: relative;
  padding-left: 38px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  height: 28px;
  line-height: 1;
  color: var(--color-darkgrey);

  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }
}

.sidebar__checkmark {
  position: absolute;
  top: 0;
  left: 0;
  height: 28px;
  width: 28px;
  background-color: var(--color-grey);
  border-radius: 5px;

  .sidebar__check__container:hover input ~ & {
    background-color: var(--color-darkgrey);
  }

  .sidebar__check__container input:checked ~ & {
    background-color: var(--color-blue);
  }
}

.sidebar__item__header {
  @include margin(0 0 1 0);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}

.sidebar__item__label {
  @include padding(1 4);
  border: 1px solid var(--color-grey);
  background-color: var(--color-grey);
  color: var(--color-darkgrey);
  border-radius: 5px;
}

.sidebar__input__length {
  @extend .h6, .transition;
  color: var(--color-darkgrey);
  opacity: 0;
  transition-property: opacity;
  pointer-events: none;

  .sidebar__item:focus-within & {
    opacity: 1;
  }

  &.error {
    color: var(--color-error)
  }

  & > span {
    &:first-child {
      @include margin(0 1 0 0);
    }

    &:last-child:not(:first-child) {
      &:before {
        @include margin(0 1 0 0);
        content: '<';
      }
    }
  }
}

.sidebar__radio {
  display: flex;
  width: 100%;
  border: 1px solid var(--color-grey);
  background-color: white;
  color: var(--color-darkgrey);
  border-radius: 5px;

  & > div {
    flex: 1;
    border-radius: 5px;
    display: flex;
    position: relative;

    input {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      appearance: none;
      outline: none;
      cursor: pointer;

      &:checked + label {
        background: var(--color-blue);
        color: white
      }
    }

    label {
      @include padding(1.2 4);
      width: 100%;
      border-radius: 5px;
    }
  }
}

.sidebar__button {
  @extend .transition;
  @include padding(4);
  background-color: var(--color-blue);
  color: white;
  border: 1px solid var(--color-blue);
  border-radius: 5px;
  cursor: pointer;
  outline: none;

  &.disabled {
    opacity: 0.25;
    pointer-events: none;
  }
}
</style>
