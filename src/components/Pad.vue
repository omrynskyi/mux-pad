<template>
  <div class="pad">
    <div v-for="(row, i) in rows" :key="i" class="row">
      <div
        v-for="(key, j) in row"
        class="box"
        :class="{ selected: key.selected }"
        :key="j"
        :style="{ background: key.color}"
        @click="select(key)"
      >
        <div class="key--sound">{{key.name}}</div>
        <div class="key--code">{{key.key}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Pad",
  props: ["keyboard", "rows", "audio-context"],
  mounted() {
    // Register an event listener when the Vue component is ready
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
    window.addEventListener("touchstart", this.keyDown);
    window.addEventListener("touchend", this.keyUp);
  },

  methods: {
    play: function(key) {
      const audioCtx = this.audioContext;
      this.selectedKey = key;
      audioCtx.resume();

      const playbackRate = 1;
      const sampleSource = audioCtx.createBufferSource();
      sampleSource.buffer = key.audio;
      sampleSource.playbackRate.setValueAtTime(
        playbackRate,
        audioCtx.currentTime
      );
      sampleSource.connect(audioCtx.destination);
      sampleSource.start();
    },

    keyDown: function(e) {
      if (!this.allowPressKey) {
        return;
      }

      this.allowPressKey = false;
      const key = this.keyboard[e.keyCode];
      if (key) {
        key.selected = true;
        this.play(key);
      }
    },
    keyUp: function(e) {
      this.allowPressKey = true;

      const key = this.keyboard[e.keyCode];
      if (key) {
        key.selected = false;
      }
    },

    select: function(key) {
      this.play(key);
    }
  }
};
</script>

<style scoped lang="css">
.pad {
  flex: 1 0 auto;
  display: flex;
  flex-direction: column;
}

.row {
  display: flex;
  flex: 1;
  flex-direction: row;
}

.box {
  display: flex;
  flex: 1;
  box-sizing: border-box;
  margin: 5px;
  padding: 2.5em;
  text-align: center;
  border-radius: 5px;
  color: white;
  flex-direction: column;
}

.box:active,
.box.selected {
  opacity: 0.5;
  filter: alpha(opacity=50);
  transform: scale(0.8, 0.8);
  transition-duration: 0.05s;
}
.key--code {
  flex: 1;
  font-size: 1.3rem;
  color: #d8d8d8;
}
.key--sound {
  flex: 1;
  text-transform: uppercase;
  font-size: 2em;
}
</style>

