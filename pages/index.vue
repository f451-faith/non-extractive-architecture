<template>
  <main class="container">
    <!-- <div v-if="images">
      <img v-for="image in images" :key="image" :src="image">
    </div> -->
    <ImageForm
      v-if="!sidebar"
      @submitImagesToParent="submitImages"
      @submitTemplateToParent="submitTemplate"
    />
    <Sheets
      v-if="sidebar"
      :images="images"
      :template="template"
    />
    <Sidebar
      v-if="sidebar"
      :images="images"
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
      template: null
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
        vm.images.push(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }
}
</script>

<style lang="scss">

  // .sheets {
  //   padding: 8mm;
  //   height: calc(297mm - 1px);
  //   width: calc(420mm - 1px);
  //   background-color: red;
  // }
</style>
