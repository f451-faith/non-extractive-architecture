<template>
  <main class="container">
    <section class="content">
      <div class="sheets">
        Architecture as Extraction: Historical Notes
      </div>
    </section>
  </main>
</template>

<script>
export default {
}
</script>

<style lang="scss">
  .content {
    display: flex;
    min-height: calc(100vh - var(--header-height))
  }

  .sheets {
    padding: 8mm;
    height: calc(297mm - 1px);
    width: calc(420mm - 1px);
    background-color: red;
  }
</style>
