<template>
  <div>
    <div class="loops" v-for="(loop, j) in loops" :key="j">
      <div
        v-for="(beat, i) in loop.beats"
        :key="i"
        class="loop"
        @click="check(beat)"
        :class="{'current': (i == current)}"
        :style="{ 'background': (beat.selected) ?  loop.key.color : '', 'border-color': loop.key.color }"
      ></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Loops",
  props: ["loops", "current"],
  methods: {
    check: function(beat) {
      beat.selected = !beat.selected;
    }
  }
};
</script>

<style scoped lang="css">
.loops {
  display: flex;
}
.loop {
  flex-basis: 100%;
  border: 2px solid #aeb6bf;
  box-sizing: border-box;
  margin: 2px;
  height: 3vh;
  border-radius: 2px;
}

.loop.current {
  border-color: red !important;
}
</style>

