<template>
  <div>
    <div class="loops" v-for="(loop, j) in loops" :key="j">
      <div
        v-for="(beat, i) in loop.beats"
        :key="i"
        class="loop"
        @click="check(beat)"
        :class="{'selected': (beat.selected), 'current': (i == current)}"
        :style="{'background': hexToRgb(loop.key.color, (beat.selected) ? 0.8 : 0.25)}"
      ></div>
    </div>
  </div>
</template>

<script src = "./Loops.js">
</script>

<style scoped lang="css" src = "./Loops.css">
</style>

