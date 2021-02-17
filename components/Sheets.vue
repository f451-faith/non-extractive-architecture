<template>
  <section class="sheets" :data-template="template">
    <div class="sheets__inner">
      <div v-if="images" class="sheets__grid">
        <div v-for="image in images" :key="image" class="sheets__image">
          <img :src="image">
        </div>
        <div class="sheets__titles">
          <div class="sheets__header">
            <div class="sheets__header__left">
              <div class="sheets__title">
                Utopian gene
              </div>
              <div class="sheets__subtitle">
                On Designing without Depletion
              </div>
            </div>
            <div class="sheets__header__right">
              <div class="sheets__arrow" />
            </div>
          </div>
          <div class="sheets__captions">
            <div class="sheets__caption">
              Caption Image One, Auteur. Precise reference and copyrights, 2021
            </div>
          </div>
        </div>
        <div class="sheets__texts">
          <div class="sheets__text" lang="en">
            To design, to build, to shape the environment around us is an irrepressible human instinct. It is also an act of intrinsic optimism. The immense effort and cost that the production of architecture involves can only be justified by the idea that it will, in one way or another, make the world a better place. Every architect, as Rem Koolhaas once wrote, carries the Utopian gene.
          </div>
          <div class="sheets__text" lang="it">
            Progettare, costruire, modellare l’ambiente che ci circonda è un istinto umano irrefrenabile. È anche un atto di intrinseco ottimismo. L’immenso sforzo e il costo che la produzione di architettura comporta possono essere giustificati solo dall’idea che essa, in un modo o nell’altro, renderà il mondo un posto migliore. Ogni architetto, come scrisse una volta Rem Koolhaas, porta con sé il gene dell’utopia.
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'Sheets',
  props: {
    images: {
      type: Array,
      default: null
    },
    template: {
      type: String,
      default: ''
    }
  }
}
</script>

<style lang="scss">
:root {
  --inside: 0.5vw;
  --outside: 1vw;
  --external: 2vw; // --outside * 2
  --aspect-ratio: 1.414;
}

.sheets {
  position: fixed;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding: var(--outside);
}

.sheets__inner {
  border: 1px solid var(--color-blue);
  height: 100%;
}

.sheets__grid {
  --totalInside: calc(var(--inside) * (var(--rows) - 1));
  --cellWidth: calc((100vh - var(--external) - var(--totalInside)) / var(--rows) * var(--aspect-ratio));
  --rowsPercentage: calc(100% / var(--rows));
  --colsPercentage: calc(100% / var(--columns));
  display: grid;
  height: 100%;
  grid-column-gap: var(--inside);
  grid-row-gap: var(--inside);
  grid-template-columns: repeat(var(--columns), var(--cellWidth));
  grid-template-rows: repeat(var(--rows), minmax(0, 1fr));
  mask-composite: source-in, xor;
  mask-image: linear-gradient(90deg, transparent 0%, transparent calc(var(--inside) / 2), black calc(var(--inside) / 2), black calc(100% - var(--inside) / 2), transparent calc(100% - var(--inside) / 2), transparent calc(100% + var(--inside) / 2)),
              linear-gradient(transparent 0%, transparent calc(var(--inside) / 2), black calc(var(--inside) / 2), black calc(100% - var(--inside) / 2), transparent calc(100% - var(--inside) / 2), transparent calc(100% + var(--inside) / 2));
  mask-repeat: repeat;
  mask-size: var(--colsPercentage) var(--rowsPercentage);
  mask-position: top left;

  img {
    filter: grayscale(1);
  }

  & > div {
    overflow: hidden;
  }

  [data-template="template-1-2-1"] & {
    --columns: 1;
    --rows: 2;
  }

  [data-template="template-2-3-1"] & {
    --columns: 2;
    --rows: 3;

    & > div {
      &:first-child {
        grid-column: 1 / 3;
        grid-row: 1 / 3;
        padding: var(--outside);

        img {
          @extend .cover;
        }
      }
    }
  }

  [data-template="template-3-4-1"] & {
    --columns: 3;
    --rows: 4;

    & > div {
      &:first-child {
        grid-column: 1 / 4;
        grid-row: 2 / 5;
        padding: var(--outside);

        img {
          @extend .cover;
        }
      }
    }
  }
}
</style>
