<template>
  <main class="container">
    <ImageForm
      v-if="!sidebar"
      :images="images"
      @submitImagesToParent="submitImages"
      @submitTemplateToParent="submitTemplate"
    />
    <Sheets
      v-if="sidebar"
      :images="images"
      :template="template"
      :form-value="formValue"
    />
    <Sidebar
      v-if="sidebar"
      :images="images"
      :template="template"
      :form-value="formValue"
      @inputUpdate="formValue = formValue"
    />
    <Print
      v-if="sidebar"
      :template="template"
    />
  </main>
</template>

<script>
export default {
  data () {
    return {
      sidebar: false,
      images: [],
      template: null,
      formValue: {
        title: '',
        subtitle: '',
        text: '',
        caption: []
      }
    }
  },

  methods: {
    submitImages (imagesFromForm) {
      imagesFromForm.forEach((img) => {
        this.createImage(img)
      })
    },

    submitTemplate (templateFromForm) {
      this.template = templateFromForm
      setTimeout(() => {
        this.sidebar = true
      }, 300)
    },

    createImage (file) {
      const reader = new FileReader()
      const vm = this

      reader.onload = (e) => {
        const image = new Image()
        image.src = e.target.result
        image.onload = function () {
          const height = this.height
          const width = this.width
          const ratio = height / width
          vm.images.push({
            url: e.target.result,
            ratio
          })
          vm.updateCaptions()
        }
      }
      reader.readAsDataURL(file)
    },

    updateCaptions () {
      const arr = []
      this.images.forEach((el) => {
        arr.push('')
      })
      this.formValue.caption = arr
    }
  }
}
</script>

<style lang="scss">
</style>
