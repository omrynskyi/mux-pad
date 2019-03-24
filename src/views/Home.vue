<template>
  <div class="container">
    <header>
      <div class="toolbox">
        <el-button circle @click="start">
          <i v-if="!this.playing" class="fas fa-play"></i>
          <i v-else class="fas fa-stop"></i>
        </el-button>
        <el-switch v-model="numPad" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        <span class="align__right">
          <el-slider
            :min="60"
            :max="240"
            v-model="audioSettings.bpm"
            style="width: 50vw; float:right; margin-left: 2vw;"
          ></el-slider>
          <div style=" float: right; padding-top: 10px">BPM: {{audioSettings.bpm}}</div>
        </span>
      </div>
      <Loops :loops="loops" :current="currentBeat"></Loops>
    </header>
    <main class="main">
      <Pad :keyboard="keyboard" :rows="rows" :audio-context="audioCtx"></Pad>
    </main>
  </div>
</template>

<script>
// @ is an alias to /src
import Loops from "@/components/Loops.vue";
import Pad from "@/components/Pad/Pad.vue";
import LoopTimer from "@/components/LoopTimer.js";
import AudioDecoder from "@/components/AudioDecoder.js";
import Keyboards from "@/components/keyboards/keyboards.js";
export default {
  name: "home",
  components: {
    Loops,
    Pad,
    LoopTimer,
    Keyboards
  },
  data: function() {
    let numPad = true;
    const maxBeats = 16;
    const bpm = 90;

    //TODO: rework to build rows automatically based on ther grid settings

    return {
      playing: false,
      audioSettings: { bpm: bpm, mB: maxBeats },
      currentBeat: 0,
      numPad: numPad
    };
  },
  computed: {
    keyboard: function() {
      const layout = this.NumPad ? Keyboards.NumPad : Keyboards.asdfghjkl;
      const keyboard = {};
      for (let i = 0; i < layout.length; i++) {
        keyboard[layout[i].code] = layout[i];
      }
      return keyboard;
    },
    rows: function() {
      const rows = [];
      let row;
      const col = 2;
      for (let i = 0; i < layout.length; i++) {
        if (i % col == 0) {
          row = [];
          rows.push(row);
        }
        row.push(layout[i]);
      }
      return rows;
    },
    loops: function() {
      const loops = [];
      for (let key in keyboard) {
        const loop = {
          beats: [],
          key: keyboard[key]
        };
        loops.push(loop);

        for (let i = 0; i < maxBeats; i++) {
          loop.beats.push({
            selected: false
          });
        }
      }
    }
  },
  async created() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    this.audioCtx = audioCtx;

    await loadSounds(audioCtx, this.keyboard);

    this.timer = new LoopTimer(audioCtx, this.audioSettings, this.play);

    async function loadSounds(audioCtx, keyboard) {
      const decoder = new AudioDecoder(audioCtx);
      for (const key in keyboard) {
        const item = keyboard[key];
        item.audio = await decoder.loadFile(`/sounds/${item.sound}.wav`);
      }
    }
  },
  methods: {
    play: function(num, time) {
      this.currentBeat = num;
      const audioCtx = this.audioCtx;
      audioCtx.resume();

      for (let i = 0; i < this.loops.length; i++) {
        if (this.loops[i].beats[num].selected) {
          playBeat(this.loops[i].key, time);
        }
      }

      function playBeat(key, time) {
        const playbackRate = 1;
        const sampleSource = audioCtx.createBufferSource();
        sampleSource.buffer = key.audio;
        sampleSource.playbackRate.setValueAtTime(
          playbackRate,
          audioCtx.currentTime
        );
        sampleSource.connect(audioCtx.destination);
        sampleSource.start(time);
      }
    },
    start: function() {
      if (this.playing) {
        this.timer.stop();
        this.playing = false;
      } else {
        this.audioCtx.resume();
        this.timer.start();
        this.playing = true;
      }
    }
  }
};
</script>

<style lang="css">
html,
body,
#app {
  height: 100%;
}
.container {
  min-height: 100%;
  display: flex;
  flex-direction: column;
}

.main {
  display: flex;
  flex: 1 0 auto;
}

header,
footer {
  color: black;
  width: 100%;
}
.toolbox {
  text-align: left;
}
.align__right {
  float: right;
}
/* * {
  box-shadow: inset 0px 0px 0px 1px #f00;
} */
</style>