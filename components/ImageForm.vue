<template>
  <section class="imageform" :class="{ inactive: getSidebar }">
    <div class="imageform__inner">
      <div class="imageform__header">
        <h1>Non-Extractive Architecture</h1>
        <h2>Exhibition Format Editor</h2>
      </div>
      <div class="imageform__body">
        <div class="imageform__body__inner js-imageFormBodyInner" :class="{ inactive: bodyInnerInactive }">
          <form v-if="showForm" class="imageform__body__form js-imageFormBodyForm" @submit.prevent="processForm">
            <button class="imageform__button js-imageFormImageButton" :class="{ hidden: showTextInput, inactive: showImageInput }" @click.prevent="getImageForm">
              I want to build a module with image(s).
            </button>
            <button class="imageform__button js-imageFormTextButton" :class="{ hidden: showImageInput, inactive: showTextInput }" @click.prevent="getTextForm">
              I want to build a text only module.
            </button>
            <div v-if="showImageInput" class="imageform__images js-imageFormInputContainer" :class="{ inactive: showImageSubmit }">
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
            <div v-if="showImageSubmit" class="imageform__submit js-imageFormSubmit">
              <input type="submit" name="submit" value="Create the composition">
            </div>
          </form>
          <div v-else class="imageform__body__templates">
            <div class="imageform__body__help">
              <div v-if="showImageInput">
                Choose a template for your module
              </div>
              <div v-if="showTextInput">
                I want the typeface to be…
              </div>
            </div>
            <div v-if="showImageInput" class="imageform__body__buttons">
              <div v-for="(template, index) in filteredTemplates" :key="index" class="imageform__body__template" @click="chooseImageTemplate(template)">
                <img :src="getImageSrc(template)">
              </div>
            </div>
            <div v-if="showTextInput" class="imageform__body__buttons">
              <div v-for="(template, index) in textTemplates" :key="index" class="imageform__body__template" @click="chooseTextTemplate(template)">
                <span>{{ template.title }}</span>
              </div>
            </div>
            <div :class="{ load: formLoading }" class="imageform__body__loading">
              Processing your images…
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'ImageForm',
  props: {
    formLoading: {
      type: Boolean,
      default: false
    },
    baseImages: {
      type: Array,
      default: null
    }
  },

  data () {
    return {
      imageNumber: null,
      getSidebar: false,
      showForm: true,
      showImageInput: false,
      showTextInput: false,
      showImageSubmit: false,
      bodyInnerInactive: false,
      textTemplates: [
        {
          name: 'T1',
          title: 'Small',
          width: 2,
          height: 1,
          fontSize: '109px'
        },
        {
          name: 'T2',
          title: 'Medium',
          width: 3,
          height: 1,
          fontSize: '139px'
        },
        {
          name: 'T3',
          title: 'Large',
          width: 4,
          height: 1,
          fontSize: '160px'
        }
      ],
      templates: [
        // H - One Image - Horizontal
        {
          name: 'H3-1-U',
          width: 2,
          height: 3,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 2,
              columns: '1/3',
              rows: '1/3',
              padding: '1 1 1 1',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '3/4'
          },
          texts: {
            columns: '2/3',
            rows: '3/4'
          }
        },
        {
          name: 'H3-1-R',
          width: 4,
          height: 3,
          arrow: 'right',
          images: [
            {
              width: 3,
              height: 3,
              columns: '2/5',
              rows: '1/4',
              padding: '1 1 1 1',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '2/3'
          },
          texts: {
            columns: '1/2',
            rows: '3/4'
          }
        },
        {
          name: 'H4-1-U',
          width: 3,
          height: 4,
          arrow: 'up',
          images: [
            {
              width: 3,
              height: 4,
              columns: '1/4',
              rows: '1/4',
              padding: '1 1 1 1',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '4/5'
          },
          texts: {
            columns: '2/3',
            rows: '4/5'
          }
        },
        {
          name: 'H4-1-R',
          width: 5,
          height: 4,
          arrow: 'right',
          images: [
            {
              width: 1,
              height: 2,
              columns: '2/6',
              rows: '1/5',
              padding: '1 1 1 1',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '3/4'
          },
          texts: {
            columns: '1/2',
            rows: '4/5'
          }
        },
        {
          name: 'H5-1-U',
          width: 4,
          height: 5,
          arrow: 'up',
          images: [
            {
              width: 4,
              height: 4,
              columns: '1/5',
              rows: '1/5',
              padding: '1 1 1 1',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '2/3',
            rows: '5/6'
          }
        },
        {
          name: 'H5-1-R',
          width: 6,
          height: 5,
          arrow: 'right',
          images: [
            {
              width: 5,
              height: 5,
              columns: '2/7',
              rows: '1/6',
              padding: '1 1 1 1',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '4/5'
          },
          texts: {
            columns: '1/2',
            rows: '5/6'
          }
        },
        {
          name: 'H6-1-U',
          width: 5,
          height: 6,
          arrow: 'up',
          images: [
            {
              width: 5,
              height: 5,
              columns: '1/6',
              rows: '1/6',
              padding: '1 1 1 1',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '6/7'
          },
          texts: {
            columns: '2/3',
            rows: '6/7'
          }
        },
        {
          name: 'H6-1-R',
          width: 7,
          height: 6,
          arrow: 'right',
          images: [
            {
              width: 6,
              height: 6,
              columns: '2/8',
              rows: '1/7',
              padding: '1 1 1 1',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '1/2',
            rows: '6/7'
          }
        },

        // V - One Image - Vertical

        {
          name: 'V2-1-R',
          width: 2,
          height: 2,
          arrow: 'right',
          images: [
            {
              width: 2,
              height: 2,
              columns: '2/3',
              rows: '1/3',
              padding: '1 1 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '1/2'
          },
          texts: {
            columns: '1/2',
            rows: '2/3'
          }
        },
        {
          name: 'V3-1-R',
          width: 2,
          height: 3,
          arrow: 'right',
          images: [
            {
              width: 2,
              height: 3,
              columns: '2/4',
              rows: '1/4',
              padding: '1 1 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '2/3'
          },
          texts: {
            columns: '1/2',
            rows: '3/4'
          }
        },
        {
          name: 'V4-1-U',
          width: 2,
          height: 4,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 3,
              columns: '1/3',
              rows: '1/4',
              padding: '1 1 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '4/5'
          },
          texts: {
            columns: '2/3',
            rows: '4/5'
          }
        },
        {
          name: 'V4-1-R',
          width: 3,
          height: 4,
          arrow: 'right',
          images: [
            {
              width: 2,
              height: 4,
              columns: '2/4',
              rows: '1/5',
              padding: '1 1 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '3/4'
          },
          texts: {
            columns: '1/2',
            rows: '4/5'
          }
        },
        {
          name: 'V5-1-U',
          width: 2,
          height: 5,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 4,
              columns: '1/3',
              rows: '1/5',
              padding: '1 1 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '2/3',
            rows: '5/6'
          }
        },
        {
          name: 'V5-1-R',
          width: 4,
          height: 5,
          arrow: 'right',
          images: [
            {
              width: 3,
              height: 5,
              columns: '2/5',
              rows: '1/6',
              padding: '1 1 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '4/5'
          },
          texts: {
            columns: '1/2',
            rows: '5/6'
          }
        },
        {
          name: 'V6-1-U',
          width: 3,
          height: 6,
          arrow: 'up',
          images: [
            {
              width: 5,
              height: 5,
              columns: '1/4',
              rows: '1/6',
              padding: '1 1 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '6/7'
          },
          texts: {
            columns: '2/3',
            rows: '6/7'
          }
        },
        {
          name: 'V6-1-R',
          width: 4,
          height: 6,
          arrow: 'right',
          images: [
            {
              width: 3,
              height: 6,
              columns: '2/5',
              rows: '1/7',
              padding: '1 1 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '1/2',
            rows: '6/7'
          }
        },
        // HV - Two Images - Horizontal, Vertical

        {
          name: 'HV2-1-R',
          width: 4,
          height: 2,
          arrow: 'right',
          images: [
            {
              width: 2,
              height: 2,
              columns: '2/4',
              rows: '1/3',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 1,
              height: 2,
              columns: '4/5',
              rows: '1/3',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '1/2'
          },
          texts: {
            columns: '1/2',
            rows: '2/3'
          }
        },

        {
          name: 'HV2-2-R',
          width: 3,
          height: 2,
          arrow: 'right',
          images: [
            {
              width: 1,
              height: 1,
              columns: '2/3',
              rows: '1/2',
              padding: '1 0 0 1',
              orientation: 'landscape'
            },
            {
              width: 1,
              height: 2,
              columns: '3/4',
              rows: '1/3',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '1/2'
          },
          texts: {
            columns: '1/2',
            rows: '2/3'
          }
        },
        {
          name: 'HV3-1-U',
          width: 3,
          height: 3,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 2,
              columns: '1/3',
              rows: '1/3',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 1,
              height: 2,
              columns: '3/4',
              rows: '1/3',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '3/4'
          },
          texts: {
            columns: '2/3',
            rows: '3/4'
          }
        },
        {
          name: 'HV3-2-U',
          width: 2,
          height: 3,
          arrow: 'up',
          images: [
            {
              width: 1,
              height: 1,
              columns: '1/2',
              rows: '1/2',
              padding: '1 0 0 1',
              orientation: 'landscape'
            },
            {
              width: 1,
              height: 2,
              columns: '2/3',
              rows: '1/3',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '3/4'
          },
          texts: {
            columns: '2/3',
            rows: '3/4'
          }
        },
        {
          name: 'HV3-3-R',
          width: 2,
          height: 3,
          arrow: 'right',
          images: [
            {
              width: 1,
              height: 1,
              columns: '2/3',
              rows: '1/2',
              padding: '1 1 0 1',
              orientation: 'landscape'
            },
            {
              width: 1,
              height: 2,
              columns: '2/3',
              rows: '2/4',
              padding: '0 1 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '2/3'
          },
          texts: {
            columns: '1/2',
            rows: '3/4'
          }
        },
        {
          name: 'HV4-1-U',
          width: 5,
          height: 4,
          arrow: 'up',
          images: [
            {
              width: 3,
              height: 3,
              columns: '1/4',
              rows: '1/4',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 2,
              height: 3,
              columns: '4/6',
              rows: '1/4',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '4/5'
          },
          texts: {
            columns: '2/3',
            rows: '4/5'
          }
        },
        {
          name: 'HV4-2-U',
          width: 4,
          height: 4,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 2,
              columns: '1/3',
              rows: '1/3',
              padding: '1 0 0 1',
              orientation: 'landscape'
            },
            {
              width: 2,
              height: 3,
              columns: '3/5',
              rows: '1/4',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '4/5'
          },
          texts: {
            columns: '2/3',
            rows: '4/5'
          }
        },

        {
          name: 'HV4-3-R',
          width: 3,
          height: 4,
          arrow: 'right',
          images: [
            {
              width: 2,
              height: 2,
              columns: '2/4',
              rows: '1/3',
              padding: '1 1 0 1',
              orientation: 'landscape'
            },
            {
              width: 1,
              height: 2,
              columns: '2/3',
              rows: '3/5',
              padding: '0 0 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '3/4'
          },
          texts: {
            columns: '1/2',
            rows: '4/5'
          }
        },
        {
          name: 'HV5-1-U',
          width: 6,
          height: 5,
          arrow: 'up',
          images: [
            {
              width: 4,
              height: 4,
              columns: '1/5',
              rows: '1/5',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 2,
              height: 4,
              columns: '5/7',
              rows: '1/5',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '2/3',
            rows: '5/6'
          }
        },

        {
          name: 'HV5-2-U',
          width: 5,
          height: 5,
          arrow: 'up',
          images: [
            {
              width: 3,
              height: 3,
              columns: '1/4',
              rows: '1/4',
              padding: '1 0 0 1',
              orientation: 'landscape'
            },
            {
              width: 2,
              height: 4,
              columns: '4/6',
              rows: '1/5',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '2/3',
            rows: '5/6'
          }
        },
        {
          name: 'HV5-3-U',
          width: 2,
          height: 5,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 2,
              columns: '1/3',
              rows: '1/3',
              padding: '1 1 0 1',
              orientation: 'landscape'
            },
            {
              width: 1,
              height: 2,
              columns: '1/2',
              rows: '3/5',
              padding: '0 0 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '2/3',
            rows: '5/6'
          }
        },

        {
          name: 'HV6-1-U',
          width: 8,
          height: 6,
          arrow: 'up ',
          images: [
            {
              width: 5,
              height: 5,
              columns: '1/6',
              rows: '1/6',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 3,
              height: 5,
              columns: '6/9',
              rows: '1/6',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '6/7'
          },
          texts: {
            columns: '2/3',
            rows: '6/7'
          }
        },
        {
          name: 'HV6-2-U',
          width: 7,
          height: 6,
          arrow: 'up',
          images: [
            {
              width: 4,
              height: 4,
              columns: '1/5',
              rows: '1/5',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 3,
              height: 5,
              columns: '5/8',
              rows: '1/6',
              padding: '1 1 0 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '6/7'
          },
          texts: {
            columns: '2/3',
            rows: '6/7'
          }
        },

        {
          name: 'HV6-2-R',
          width: 4,
          height: 6,
          arrow: 'right',
          images: [
            {
              width: 3,
              height: 3,
              columns: '2/5',
              rows: '1/4',
              padding: '1 1 0 1',
              orientation: 'landscape'
            },
            {
              width: 2,
              height: 3,
              columns: '2/4',
              rows: '4/7',
              padding: '0 0 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '1/2',
            rows: '6/7'
          }
        },

        // VV - Two Images - Vertical, Vertical

        {
          name: 'VV2-1-R',
          width: 3,
          height: 2,
          arrow: 'right',
          images: [
            {
              width: 1,
              height: 2,
              columns: '2/3',
              rows: '1/3',
              padding: '1 0 1 1',
              orientation: 'portrait'
            },
            {
              width: 1,
              height: 2,
              columns: '3/4',
              rows: '1/3',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '1/2'
          },
          texts: {
            columns: '1/2',
            rows: '2/3'
          }
        },
        {
          name: 'VV3-1-U',
          width: 2,
          height: 3,
          arrow: 'up',
          images: [
            {
              width: 1,
              height: 2,
              columns: '1/2',
              rows: '1/3',
              padding: '1 0 1 1',
              orientation: 'portrait'
            },
            {
              width: 1,
              height: 2,
              columns: '2/3',
              rows: '1/3',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '3/4'
          },
          texts: {
            columns: '2/3',
            rows: '3/4'
          }
        },
        {
          name: 'VV4-1-U',
          width: 4,
          height: 4,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 3,
              columns: '1/3',
              rows: '1/4',
              padding: '1 0 1 1',
              orientation: 'portrait'
            },
            {
              width: 2,
              height: 3,
              columns: '3/5',
              rows: '1/4',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '4/5'
          },
          texts: {
            columns: '2/3',
            rows: '4/5'
          }
        },
        {
          name: 'VV4-2-U',
          width: 3,
          height: 4,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 3,
              columns: '1/3',
              rows: '1/4',
              padding: '1 0 1 1',
              orientation: 'portrait'
            },
            {
              width: 1,
              height: 2,
              columns: '3/4',
              rows: '1/3',
              padding: '1 1 0 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '4/5'
          },
          texts: {
            columns: '2/3',
            rows: '4/5'
          }
        },
        {
          name: 'VV4-3-R',
          width: 2,
          height: 4,
          arrow: 'right',
          images: [
            {
              width: 1,
              height: 2,
              columns: '2/3',
              rows: '1/3',
              padding: '1 1 0 1',
              orientation: 'portrait'
            },
            {
              width: 1,
              height: 2,
              columns: '2/3',
              rows: '3/5',
              padding: '0 1 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '3/4'
          },
          texts: {
            columns: '1/2',
            rows: '4/5'
          }
        },

        {
          name: 'VV5-1-U',
          width: 4,
          height: 5,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 4,
              columns: '1/3',
              rows: '1/5',
              padding: '1 0 1 1',
              orientation: 'portrait'
            },
            {
              width: 2,
              height: 4,
              columns: '3/5',
              rows: '1/4',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '2/3',
            rows: '5/6'
          }
        },
        {
          name: 'VV5-2-U',
          width: 4,
          height: 5,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 4,
              columns: '1/3',
              rows: '1/5',
              padding: '1 0 1 1',
              orientation: 'portrait'
            },
            {
              width: 2,
              height: 3,
              columns: '3/5',
              rows: '1/4',
              padding: '1 1 0 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '2/3',
            rows: '5/6'
          }
        },
        {
          name: 'VV6-1-R',
          width: 7,
          height: 6,
          arrow: 'R',
          images: [
            {
              width: 3,
              height: 6,
              columns: '2/5',
              rows: '1/7',
              padding: '1 0 1 1',
              orientation: 'portrait'
            },
            {
              width: 3,
              height: 6,
              columns: '5/8',
              rows: '1/7',
              padding: '1 1 1 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '1/2',
            rows: '6/7'
          }
        },
        {
          name: 'VV6-2-R',
          width: 7,
          height: 6,
          arrow: 'right',
          images: [
            {
              width: 3,
              height: 6,
              columns: '2/5',
              rows: '1/7',
              padding: '1 0 1 1',
              orientation: 'portrait'
            },
            {
              width: 3,
              height: 5,
              columns: '5/8',
              rows: '1/6',
              padding: '1 1 0 0',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '1/2',
            rows: '6/7'
          }
        },

        {
          name: 'VV6-3-R',
          width: 3,
          height: 6,
          arrow: 'right',
          images: [
            {
              width: 2,
              height: 3,
              columns: '2/4',
              rows: '1/4',
              padding: '1 1 0 1',
              orientation: 'portrait'
            },
            {
              width: 2,
              height: 3,
              columns: '2/4',
              rows: '4/7',
              padding: '0 1 1 1',
              orientation: 'portrait'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '1/2',
            rows: '6/7'
          }
        },

        // HH - Two Images - Horizontal, Horizontal

        {
          name: 'HH1-1-R',
          width: 4,
          height: 1,
          arrow: 'right',
          images: [
            {
              width: 1,
              height: 1,
              columns: '3/4',
              rows: '1/2',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 1,
              height: 1,
              columns: '4/5',
              rows: '1/2',
              padding: '1 1 1 0',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '1/2'
          },
          texts: {
            columns: '2/3',
            rows: '1/2'
          }
        },

        {
          name: 'HH2-1-U',
          width: 2,
          height: 2,
          arrow: 'up',
          images: [
            {
              width: 1,
              height: 1,
              columns: '1/2',
              rows: '1/2',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 1,
              height: 1,
              columns: '2/3',
              rows: '1/2',
              padding: '1 1 1 0',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '2/3'
          },
          texts: {
            columns: '2/3',
            rows: '2/3'
          }
        },

        {
          name: 'HH2-2-R',
          width: 4,
          height: 2,
          arrow: 'right',
          images: [
            {
              width: 2,
              height: 2,
              columns: '2/4',
              rows: '1/3',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 1,
              height: 1,
              columns: '4/5',
              rows: '1/2',
              padding: '1 1 0 0',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '1/2'
          },
          texts: {
            columns: '1/2',
            rows: '2/3'
          }
        },

        {
          name: 'HH2-3-R',
          width: 2,
          height: 2,
          arrow: 'right',
          images: [
            {
              width: 1,
              height: 1,
              columns: '2/3',
              rows: '1/2',
              padding: '1 1 0 1',
              orientation: 'landscape'
            },
            {
              width: 1,
              height: 1,
              columns: '2/3',
              rows: '2/3',
              padding: '0 1 1 1',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '1/2'
          },
          texts: {
            columns: '1/2',
            rows: '2/3'
          }
        },

        {
          name: 'HH3-1-U',
          width: 4,
          height: 3,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 2,
              columns: '1/3',
              rows: '1/3',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 2,
              height: 2,
              columns: '3/5',
              rows: '1/3',
              padding: '1 1 1 0',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '3/4'
          },
          texts: {
            columns: '2/3',
            rows: '3/4'
          }
        },

        {
          name: 'HH3-2-U',
          width: 3,
          height: 3,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 2,
              columns: '1/3',
              rows: '1/3',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 1,
              height: 1,
              columns: '3/4',
              rows: '1/2',
              padding: '1 1 0 0',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '3/4'
          },
          texts: {
            columns: '2/3',
            rows: '3/4'
          }
        },

        {
          name: 'HH4-1-U',
          width: 6,
          height: 4,
          arrow: 'up',
          images: [
            {
              width: 3,
              height: 3,
              columns: '1/4',
              rows: '1/4',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 3,
              height: 3,
              columns: '4/7',
              rows: '1/4',
              padding: '1 1 1 0',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '4/5'
          },
          texts: {
            columns: '2/3',
            rows: '4/5'
          }
        },

        {
          name: 'HH4-2-U',
          width: 5,
          height: 4,
          arrow: 'up',
          images: [
            {
              width: 3,
              height: 3,
              columns: '1/4',
              rows: '1/4',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 2,
              height: 2,
              columns: '4/6',
              rows: '1/3',
              padding: '1 1 0 0',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '4/5'
          },
          texts: {
            columns: '2/3',
            rows: '4/5'
          }
        },

        {
          name: 'HH4-3-R',
          width: 3,
          height: 4,
          arrow: 'right',
          images: [
            {
              width: 2,
              height: 2,
              columns: '2/4',
              rows: '1/3',
              padding: '1 1 0 1',
              orientation: 'landscape'
            },
            {
              width: 2,
              height: 2,
              columns: '2/4',
              rows: '3/5',
              padding: '0 1 1 1',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '3/4'
          },
          texts: {
            columns: '1/2',
            rows: '4/5'
          }
        },

        {
          name: 'HH5-1-U',
          width: 8,
          height: 5,
          arrow: 'up',
          images: [
            {
              width: 4,
              height: 4,
              columns: '1/5',
              rows: '1/5',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 4,
              height: 4,
              columns: '5/9',
              rows: '1/5',
              padding: '1 1 1 0',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '2/3',
            rows: '5/6'
          }
        },

        {
          name: 'HH5-2-U',
          width: 7,
          height: 5,
          arrow: 'up',
          images: [
            {
              width: 4,
              height: 4,
              columns: '1/5',
              rows: '1/5',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 3,
              height: 3,
              columns: '5/8',
              rows: '1/4',
              padding: '1 1 1 0',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '2/3',
            rows: '5/6'
          }
        },

        {
          name: 'HH5-3-U',
          width: 2,
          height: 5,
          arrow: 'up',
          images: [
            {
              width: 2,
              height: 2,
              columns: '1/3',
              rows: '1/3',
              padding: '1 1 0 1',
              orientation: 'landscape'
            },
            {
              width: 2,
              height: 2,
              columns: '1/3',
              rows: '3/5',
              padding: '0 1 1 1',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '2/3',
            rows: '5/6'
          }
        },

        {
          name: 'HH6-2-U',
          width: 9,
          height: 6,
          arrow: 'up',
          images: [
            {
              width: 5,
              height: 5,
              columns: '1/6',
              rows: '1/6',
              padding: '1 0 1 1',
              orientation: 'landscape'
            },
            {
              width: 4,
              height: 4,
              columns: '6/10',
              rows: '1/5',
              padding: '1 1 1 0',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '6/7'
          },
          texts: {
            columns: '2/3',
            rows: '6/7'
          }
        },

        {
          name: 'HH6-3-R',
          width: 4,
          height: 6,
          arrow: 'right',
          images: [
            {
              width: 3,
              height: 3,
              columns: '2/5',
              rows: '1/4',
              padding: '1 1 0 1',
              orientation: 'landscape'
            },
            {
              width: 3,
              height: 3,
              columns: '2/5',
              rows: '4/7',
              padding: '0 1 1 1',
              orientation: 'landscape'
            }
          ],
          titles: {
            columns: '1/2',
            rows: '5/6'
          },
          texts: {
            columns: '1/2',
            rows: '6/7'
          }
        }
      ]
    }
  },

  computed: {
    filteredTemplates () {
      const images = this.baseImages
      const ratios = []
      images.forEach((img) => {
        if (img.ratio < 1) { ratios.push('portrait') }
        if (img.ratio >= 1) { ratios.push('landscape') }
      })
      return this.templates.filter((t) => {
        const imagesTemplate = t.images
        const ratiosTemplate = []
        imagesTemplate.forEach((img) => {
          ratiosTemplate.push(img.orientation)
        })
        const ratiosTemplateSorted = ratiosTemplate.slice().sort()
        return ratios.length === ratiosTemplateSorted.length && ratios.slice().sort().every(function (value, index) {
          return value === ratiosTemplateSorted[index]
        })
      })
    }
  },

  methods: {
    getImageSrc (image) {
      return require('@/assets/images/' + image.name + '.svg')
    },

    getImageForm () {
      this.showImageInput = true
    },

    getTextForm () {
      this.showForm = false
      this.showTextInput = true
    },

    displayImageName (event) {
      let fileName = ''
      if (event.target.files && event.target.files.length > 4) {
        document.querySelector('.js-imageFormBodyForm').reset()
        fileName = 'Please select 4 images or less'
      } else if (event.target.files && event.target.files.length > 1) {
        fileName = event.target.files.length + ' files selected'
      } else if (event.target.value) {
        fileName = event.target.value.split('\\').pop()
      }

      const labelVal = fileName || 'Upload between 1 and 4 image(s)'
      document.querySelector('.js-imageFormInputLabel').innerHTML = labelVal

      if ((event.target.files && event.target.files.length > 1) || event.target.value) {
        this.showImageSubmit = true
      }
    },

    processForm () {
      const files = document.querySelector('.js-imageFormInputFile').files
      if (!files.length) { return }
      this.imageNumber = files.length
      this.$emit('submitImagesToParent', files)
      this.bodyInnerInactive = true
      setTimeout(() => {
        this.showForm = false
        this.bodyInnerInactive = false
      }, 300)
    },

    chooseImageTemplate (template) {
      this.$emit('submitImageTemplateToParent', template)
    },

    chooseTextTemplate (template) {
      this.$emit('submitTextTemplateToParent', template)
    }
  }
}
</script>

<style lang="scss">
.imageform {
  @extend .transition;
  display: flex;
  min-height: 100vh;
  width: 100vw;
  align-items: center;
  justify-content: center;
  background-color: white;

  &.inactive {
    opacity: 0;
    pointer-events: none;
  }
}

.imageform__inner {
  width: 450px;
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

  &.inactive {
    opacity: 0;
    pointer-events: none;
  }
}

.imageform__body__form {
  display: flex;
  flex-direction: column;
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
    display: none
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
  display: flex;
  transition-property: opacity;

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
  word-break: break-word;

  & * {
    pointer-events: none;
  }
}

.imageform__submit {
  display: flex;

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
    opacity: 1
  }
}

.imageform__body__help {
  @include margin(0 0 1 0);
  @include padding(1 4);
  background-color: var(--color-grey);
  color: var(--color-darkgrey);
  border: 1px solid var(--color-grey);
  border-radius: 5px;
  text-align: center
}

.imageform__body__buttons {
  @include margin(-0.5);
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.imageform__body__templates {
  position: relative
}

.imageform__body__template {
  @include margin(0.5);
  cursor: pointer;
  border: 1px solid var(--color-grey);
  border-radius: 5px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    height: 100%;
    width: auto;
  }

  span {
    @include padding(0 4);
  }

  &:hover {
    border-color: var(--color-blue);
  }
}

.imageform__body__loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-blue);
  opacity: 0;
  pointer-events: none;
  background-color: white;

  &.load {
    opacity: 1;
    pointer-events: initial;
  }
}
</style>
