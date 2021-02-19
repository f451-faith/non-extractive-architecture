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
      :form-value="formValue"
      @inputUpdate="formValue = formValue"
    />
    <Print
      v-if="sidebar"
      :template="template"
    />
    <canvas ref="canvas" />
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
      },
      lumR: [],
      lumG: [],
      lumB: [],
      col1: [162, 185, 61],
      col2: [26, 54, 20],
      canvasWidth: 1,
      canvasHeight: 1,
      threshold: 120,
      pixelSize: 2
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
      this.setCanvas()
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
          const ratio = image.width / image.height
          vm.images.push({ image, ratio })
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
      if (this.gameBoyMode) {
        if (!lightPixel) {
          imageData.data[currentPixel] = this.col1[0]
          imageData.data[currentPixel + 1] = this.col1[1]
          imageData.data[currentPixel + 2] = this.col1[2]
        } else {
          imageData.data[currentPixel] = this.col2[0]
          imageData.data[currentPixel + 1] = this.col2[1]
          imageData.data[currentPixel + 2] = this.col2[2]
        }
      } else {
        imageData.data[currentPixel + 1] = imageData.data[currentPixel + 2] = imageData.data[currentPixel]
      }
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

    getImageDimensions () {
      const image = this.template.images[0]
      const columns = image.width
      const rows = image.height
      const width = columns * 420 - 40 + (columns - 1) * 10
      const height = rows * 297 - 40 + (rows - 1) * 10
      const ratio = width / height
      const imageRatio = this.images[0].ratio
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

    setCanvas () {
      const ctx = this.$refs.canvas.getContext('2d')
      const image = this.images[0].image
      this.resizeCanvas()
      ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
      ctx.drawImage(image, 0, 0, (this.canvasWidth / (window.devicePixelRatio * this.pixelSize)), (this.canvasWidth / (window.devicePixelRatio * this.pixelSize)) * image.height / image.width)
      this.finalizeBitmap(ctx)
    },

    resizeCanvas () {
      const imageDimensions = this.getImageDimensions()
      this.canvasWidth = Math.round(this.getCanvasWidth(imageDimensions[0]))
      this.canvasHeight = Math.round(this.getCanvasHeight(imageDimensions[1]))
      this.$refs.canvas.setAttribute('width', this.canvasWidth)
      this.$refs.canvas.setAttribute('height', this.canvasHeight)
      const ctx = this.$refs.canvas.getContext('2d')
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

    finalizeBitmap (ctx) {
      const ditheredImage = this.monochrome(ctx.getImageData(0, 0, this.canvasWidth, this.canvasHeight), this.threshold)
      createImageBitmap(ditheredImage).then((ditheredImageBmp) => {
        ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight)
        ctx.drawImage(ditheredImageBmp, 0, 0, this.canvasWidth / window.devicePixelRatio * this.pixelSize, this.canvasHeight / window.devicePixelRatio * this.pixelSize)
        this.addToImageArray()
      })
    },

    addToImageArray () {
      const url = this.$refs.canvas.toDataURL('image/png')
      this.images[0].ditheredImage = url
    }
  }
}
</script>

<style lang="scss">
canvas {
  position: absolute;
  left: -9999px;
  opacity: 0;
  z-index: -9999;

  @include print {
    display: none
  }
}
</style>
