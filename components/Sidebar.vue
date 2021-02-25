<template>
  <section class="sidebar">
    <div class="sidebar__inner">
      <div class="sidebar__header">
        <h1>Non-Extractive Architecture</h1>
        <h2>Research Software</h2>
      </div>
      <div class="sidebar__body">
        <div class="sidebar__form">
          <div class="sidebar__item">
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
          <div class="sidebar__item" :class="{ disabled: formValue.title.length === 0 }">
            <div class="sidebar__item__header">
              <label class="sidebar__item__label" for="subtitle">Subtitle</label>
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
          <div class="sidebar__item" :class="{ disabled: formValue.title.length === 0 || formValue.subtitle.length === 0 }">
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
        </div>
        <div v-for="(image, index) in baseImages" :key="index" class="sidebar__form">
          <div v-if="baseImages.length > 1" class="sidebar__item">
            <div class="sidebar__item__header">
              <label class="sidebar__item__label" :for="'select' + index">Image {{ index + 1 }}</label>
            </div>
            <select :id="'select' + index" :name="'select' + index" :class="{ load: sheetsLoading }" @change="changeImageDisplayed(index, $event)">
              <option v-for="(img, i) in baseImages" :key="i" :value="img.name.replace(/\.[^/.]+$/, '')" :selected="i === index">
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
                  checked
                  @change="formatImage"
                >
                <label for="cover-fill">Fill</label>
              </div>
              <div>
                <input
                  id="cover-fit"
                  type="radio"
                  name="cover"
                  value="contain"
                  @change="formatImage"
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
          <button class="sidebar__button" :class="{ disabled: formValue.title.length === 0 || formValue.subtitle.length === 0 || formValue.text.length === 0 }" @click.prevent="printSheets">
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
    baseImages: {
      type: Array,
      default: null
    },
    displayedImages: {
      type: Array,
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

  watch: {
    formValue () {
      this.$emit('inputUpdate', this.formValue)
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
      const imageIndex = event.target.selectedIndex
      this.displayedImages[index] = this.baseImages[imageIndex]
      this.$emit('displayedImagesUpdate', this.displayedImages)
    },

    formatImage (event) {
      this.$emit('formatImageUpdate', event.target.value)
    }
  }
}
</script>

<style lang="scss">
.sidebar {
  @include padding(2);
  position: fixed;
  max-height: 100vh;
  display: flex;
  right: 0;
  top: 0;

  @include print {
    display: none;
  }
}

.sidebar__inner {
  width: 400px;
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

    &:last-child {
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
