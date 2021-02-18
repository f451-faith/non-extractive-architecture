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
              <label for="title">Title</label>
              <div class="sidebar__input__length" :class="{ error: formValue.title.length >= 100 }">
                <span>{{ formValue.title.length }}</span><span>100</span>
              </div>
            </div>
            <textarea
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
              <label for="subtitle">Subtitle</label>
              <div class="sidebar__input__length" :class="{ error: formValue.subtitle.length >= 100 }">
                <span>{{ formValue.subtitle.length }}</span><span>100</span>
              </div>
            </div>
            <textarea
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
              <label for="text_english">Your text</label>
              <div class="sidebar__input__length" :class="{ error: formValue.text.length >= 400 }">
                <span>{{ formValue.text.length }}</span><span>400</span>
              </div>
            </div>
            <textarea
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
        <div class="sidebar__form">
          <div v-for="(image, index) in images" :key="image" class="sidebar__item">
            <div class="sidebar__item__header">
              <label :for="'caption' + index">Caption image {{ index + 1 }}</label>
              <div class="sidebar__input__length" :class="{ error: formValue.caption[index].length >= 200 }">
                <span>{{ formValue.caption[index].length }}</span><span>200</span>
              </div>
            </div>
            <textarea
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

  label {
    @include padding(1 4);
    border: 1px solid var(--color-grey);
    background-color: var(--color-grey);
    color: var(--color-darkgrey);
    border-radius: 5px;
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
  }
}

.sidebar__item__header {
  @include margin(0 0 1 0);
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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
