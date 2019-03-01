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
