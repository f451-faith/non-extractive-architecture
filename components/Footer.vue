<template>
  <footer class="footer">
    <div class="footer__button" :class="{ open: footerOpen }" @click="footerOpen = !footerOpen" />
    <div class="footer__inner" :class="{ open: footerOpen }">
      <div class="footer__text">
        <p>This tool was commissioned by <a href="http://www.v-a-c.ru/" target="_blank">V-A-C Foundation</a> and designed for the Non-Extractive Architecture exhibition by <a href="http://f451.faith" target="_blank">F451 (Domitille Debret & Quentin Creuzet)</a>, under the direction of <a href="http://www.spacecaviar.net/" target="_blank">Space Caviar</a>.</p>
      </div>
      <div class="footer__text">
        <p><a href="http://www.v-a-c.ru/exhibition/non-extractive-architecture/" target="_blank">Non-Extractive Architecture: On Designing without Depletion</a></p>
        <p>15 Mar 2021 – 31 Jan 2022</p>
        <p>V-A-C Zattere, Dorsoduro 1401, 30123 Venice</p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data () {
    return {
      footerOpen: false
    }
  }
}
</script>

<style lang="scss">
.footer__inner {
  @extend .transition;
  position: fixed;
  bottom: 10px;
  right: calc(20px + 2em);
  z-index: 99999;
  background-color: white;
  width: 500px;
  box-shadow: 0px 0px 10px 0px rgba(0,0,255,0.25);
  border-radius: 5px;
  transform: translateY(120%);
  transition-property: transform;

  &.open {
    transform: translateX(0);
  }
}

.footer__button {
  @extend .transition;
  position: fixed;
  bottom: 10px;
  right: 10px;
  z-index: 99999;
  height: 2em;
  width: 2em;
  background-color: white;
  border: 1px solid var(--color-blue);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:after {
    content: '?';
  }

  &.open:after {
    content: '';
  }

  &:hover {
    background-color: var(--color-blue);
    color: white;
  }
}

.footer__inner {
  @include padding(1);
}

.footer__text {
  max-width: 500px;

  a {
    color: var(--color-blue)
  }

  &:not(:last-child) {
    margin-bottom: var(--space-d);
  }
}
</style>
