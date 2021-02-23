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
    <canvas v-for="(img, index) in images" :key="index" ref="canvas" />
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

    getImageDimensions (index) {
      const image = this.template.images[index]
      const columns = image.width
      const rows = image.height
      const width = columns * 420 - 40 + (columns - 1) * 10
      const height = rows * 297 - 40 + (rows - 1) * 10
      const ratio = width / height
      const imageRatio = this.images[index].ratio
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
      this.images.forEach((el, index) => {
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
      this.images[index].ditheredImage = url
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
