export const state = () => ({
  array: []
})

export const mutations = {
  add (state, arr) {
    state.array.push({
      name: arr.name,
      image: arr.image,
      ratio: arr.ratio
    })
  },

  addDitheredImage (state, arr) {
    state.array[arr.index].ditheredImage = arr.url
  },

  orderImages (state, orientations) {
    const imagesSorted = []
    let images = state.array
    orientations.forEach(function (key) {
      let found = false
      images = images.filter(function (item) {
        const ratio = item.ratio > 1 ? 'landscape' : 'portrait'
        if (!found && ratio === key) {
          imagesSorted.push(item)
          found = true
          return false
        } else {
          return true
        }
      })
    })
    state.array = imagesSorted
  }
}
