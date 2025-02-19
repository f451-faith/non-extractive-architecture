<template>
  <main class="container">
    <ImageForm
      v-if="!sidebar"
      :form-loading="formLoading"
      @submitImagesToParent="submitImages"
      @submitImageTemplateToParent="submitImageTemplate"
      @submitTextTemplateToParent="submitTextTemplate"
    />
    <Sheets
      v-if="sidebar"
      :key="componentKey"
      :sheets-loading="sheetsLoading"
      :displayed-images="displayedImages"
      :template="template"
      :form-value="formValue"
      :translation="translation"
      :format-image="formatImage"
    />
    <Sidebar
      v-if="sidebar"
      :sheets-loading="sheetsLoading"
      :displayed-images="displayedImages"
      :form-value="formValue"
      :translation="translation"
      :format-image="formatImage"
      @inputUpdate="formValue = formValue"
      @displayedImagesUpdate="updateDisplayedImages"
      @formatImageUpdate="updateFormatImage"
      @translationUpdate="updateTranslation"
    />
    <Print
      v-if="sidebar"
      :template="template"
    />
    <canvas v-for="(img, index) in $store.state.images.array" :key="'canvas' + index" ref="canvas" />
    <Footer />
  </main>
</template>

<script>
import slugify from 'slugify'

export default {
  data () {
    return {
      sidebar: false,
      componentKey: 0,
      displayedImages: [],
      template: null,
      formValue: {
        title: '',
        subtitle: '',
        text: '',
        caption: []
      },
      formatImage: 'cover',
      translation: true,
      formLoading: false,
      sheetsLoading: false,
      lumR: [],
      lumG: [],
      lumB: [],
      col1: [162, 185, 61],
      col2: [26, 54, 20],
      threshold: 120,
      pixelSize: 3
    }
  },

  methods: {
    submitImages (imagesFromForm) {
      imagesFromForm.forEach((img) => {
        this.createImage(img)
      })
    },

    submitTextTemplate (templateFromForm) {
      this.template = templateFromForm
      setTimeout(() => {
        this.sidebar = true
      }, 200)
    },

    submitImageTemplate (templateFromForm) {
      this.template = templateFromForm
      this.formLoading = true
      setTimeout(() => {
        this.setCanvas(true)
        setTimeout(() => {
          this.displayedImages = JSON.parse(JSON.stringify(this.$store.state.images.array))
          this.sidebar = true
          this.formLoading = false
        }, 200)
      }, 200)
    },

    updateFormatImage (formatImage) {
      this.formatImage = formatImage
    },

    updateTranslation (translation) {
      this.translation = translation
    },

    updateDisplayedImages (displayedImages) {
      this.displayedImages = displayedImages
      this.sheetsLoading = true
      setTimeout(() => {
        this.setCanvas(false)
        this.componentKey += 1
        setTimeout(() => {
          this.sheetsLoading = false
        }, 200)
      }, 200)
    },

    createImage (file) {
      const reader = new FileReader()
      const vm = this

      reader.fileName = this.createFileName(file.name)
      reader.onload = (e) => {
        const image = new Image()
        const name = reader.fileName
        image.src = e.target.result
        image.onload = function () {
          const ratio = image.width / image.height
          vm.$store.commit('images/add', { name, image, ratio })
          vm.updateCaptions()
        }
      }
      reader.readAsDataURL(file)
    },

    createFileName (name) {
      name = slugify(name, { lower: true })
      const fileNameExtension = name.replace(/^.*[\\/]/, '')
      const fileName = fileNameExtension.substring(0, fileNameExtension.lastIndexOf('.'))
      const extension = fileNameExtension.split('.').pop()
      const slugifiedFileName = slugify(fileName, { lower: true, strict: true }) + '.' + slugify(extension, { lower: true, strict: true })
      return slugifiedFileName
    },

    updateCaptions () {
      const arr = []
      this.$store.state.images.array.forEach((el) => { arr.push('') })
      this.formValue.caption = arr
    },

    monochrome (imageData, threshold) {
      let newPixel, err
      const imageDataLength = imageData.data.length
      for (let i = 0; i <= imageDataLength; i += 4) {
        imageData.data[i] = Math.floor(this.lumR[imageData.data[i]] + this.lumG[imageData.data[i + 1]] + this.lumB[imageData.data[i + 2]])
      }
      const w = imageData.width
      imageData = this.floydsteinberg(imageData, imageDataLength, threshold, w, newPixel, err)

      return imageData
    },

    floydsteinberg (imageData, imageDataLength, threshold, w, newPixel, err) {
      let lightPixel
      for (let currentPixel = 0; currentPixel <= imageDataLength; currentPixel += 4) {
        lightPixel = imageData.data[currentPixel] < threshold
        newPixel = lightPixel ? 0 : 255
        err = Math.floor((imageData.data[currentPixel] - newPixel) / 16)
        imageData.data[currentPixel] = newPixel

        imageData.data[currentPixel + 4] += err * 7
        imageData.data[currentPixel + 4 * w - 4] += err * 3
        imageData.data[currentPixel + 4 * w] += err * 5
        imageData.data[currentPixel + 4 * w + 4] += err * 1
        imageData = this.equalizeColors(imageData, currentPixel, lightPixel)
      }
      return imageData
    },

    equalizeColors (imageData, currentPixel, lightPixel) {
      imageData.data[currentPixel + 1] = imageData.data[currentPixel + 2] = imageData.data[currentPixel]
      return imageData
    },

    getCanvasWidth (width = 420) {
      return this.getPxFromMm(width)
    },

    getCanvasHeight (height = 297) {
      return this.getPxFromMm(height)
    },

    getPxFromMm (mm) {
      return (mm / 25.4) * 96
    },

    getImageDimensions (index) {
      const images = this.template.images
      const image = images[index]
      const columnsArr = image.columns.split('/')
      const columns = columnsArr[1] - columnsArr[0]
      const rowsArr = image.rows.split('/')
      const rows = rowsArr[1] - rowsArr[0]
      const width = columns * 420 - 40 + (columns - 1) * 10
      const height = rows * 297 - 40 + (rows - 1) * 10
      const ratio = width / height
      const imageRatio = this.$store.state.images.array[index].ratio
      let imageHeight = null
      let imageWidth = null
      if (ratio > imageRatio) {
        imageWidth = width
        imageHeight = imageWidth / imageRatio
      } else if (ratio < imageRatio) {
        imageHeight = height
        imageWidth = imageHeight * imageRatio
      } else {
        imageWidth = width
        imageHeight = height
      }
      return [imageWidth, imageHeight]
    },

    setCanvas (sortImages = true) {
      if (sortImages) {
        const orientations = this.template.images.map(value => value.orientation)
        this.$store.commit('images/orderImages', orientations)
      }

      if (this.template.images.length === 1 && this.template.images[0].orientation === 'portrait') {
        this.formatImage = 'contain'
      }

      this.$store.state.images.array.forEach((el, index) => {
        const ctx = this.$refs.canvas[index].getContext('2d')
        const image = el.image
        const imageDimensions = this.getImageDimensions(index)
        const canvasWidth = Math.round(this.getCanvasWidth(imageDimensions[0]))
        const canvasHeight = Math.round(this.getCanvasHeight(imageDimensions[1]))
        this.resizeCanvas(ctx, index, canvasWidth, canvasHeight)
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.drawImage(image, 0, 0, (canvasWidth / (window.devicePixelRatio * this.pixelSize)), (canvasWidth / (window.devicePixelRatio * this.pixelSize)) * image.height / image.width)
        this.finalizeBitmap(ctx, index, canvasWidth, canvasHeight)
      })
    },

    resizeCanvas (ctx, index, canvasWidth, canvasHeight) {
      this.$refs.canvas[index].setAttribute('width', canvasWidth)
      this.$refs.canvas[index].setAttribute('height', canvasHeight)
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
      ctx.imageSmoothingEnabled = false
      ctx.mozImageSmoothingEnabled = false
      ctx.webkitImageSmoothingEnabled = false
      ctx.msImageSmoothingEnabled = false
      for (let i = 0; i < 256; i++) {
        this.lumR[i] = i * 0.299
        this.lumG[i] = i * 0.587
        this.lumB[i] = i * 0.114
      }
    },

    finalizeBitmap (ctx, index, canvasWidth, canvasHeight) {
      const ditheredImage = this.monochrome(ctx.getImageData(0, 0, canvasWidth, canvasHeight), this.threshold)
      createImageBitmap(ditheredImage).then((ditheredImageBmp) => {
        ctx.clearRect(0, 0, canvasWidth, canvasHeight)
        ctx.drawImage(ditheredImageBmp, 0, 0, canvasWidth / window.devicePixelRatio * this.pixelSize, canvasHeight / window.devicePixelRatio * this.pixelSize)
        this.addToImageArray(index)
      })
    },

    addToImageArray (index) {
      const url = this.$refs.canvas[index].toDataURL('image/png')
      this.$store.commit('images/addDitheredImage', { index, url })
    }
  }
}
</script>

<style lang="scss">
canvas {
  position: absolute;
  left: -99999px;
  opacity: 0;
  z-index: -99999;

  @include print {
    display: none
  }
}
</style>
