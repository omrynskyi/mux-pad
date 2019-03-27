<template>
  <div class="container">
    <header>
      <div class="toolbox">
        <div class="toolbox--item">
          <el-button circle @click="start">
            <i v-if="!this.playing" class="fas fa-play"></i>
            <i v-else class="fas fa-stop"></i>
          </el-button>
        </div>

        <div class="toolbox--item">
          <div class="toolbox--lable">bpm: {{audioSettings.bpm}}</div>
          <div>
            <el-slider :min="60" :max="240" v-model="audioSettings.bpm" style="width: 30vw;"></el-slider>
          </div>
        </div>
        <div class="toolbox--item">
          <div class="toolbox--lable">numpad</div>
          <el-switch v-model="numPad" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </div>
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
import Loops from "@/components/Loops/Loops.vue";
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
    let numPad = false;
    const maxBeats = 16;
    const bpm = 90;

    //TODO: rework to build rows automatically based on ther grid settings

    return {
      playing: false,
      audioSettings: { bpm: bpm, mB: maxBeats },
      currentBeat: 0,
      numPad: numPad,
      maxBeats: maxBeats,
      keyboard: {},
      loops: [],
      rows: []
    };
  },
  watch: {
    numPad: function() {
      this.initKeyboard();
    }
  },
  async created() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    this.audioCtx = audioCtx;

    await this.initKeyboard();

    this.timer = new LoopTimer(audioCtx, this.audioSettings, this.play);
  },
  methods: {
    initKeyboard: async function() {
      const layout = this.numPad ? Keyboards.numpad : Keyboards.asdfghjkl;
      this.loops = [];
      this.rows = [];
      this.keyboard = {};
      for (let i = 0; i < layout.length; i++) {
        this.keyboard[layout[i].code] = layout[i];
      }

      let row;
      const col = 3;
      for (let i = 0; i < layout.length; i++) {
        if (i % col == 0) {
          row = [];
          this.rows.push(row);
        }
        row.push(layout[i]);
      }

      for (let key in this.keyboard) {
        const loop = {
          beats: [],
          key: this.keyboard[key]
        };
        this.loops.push(loop);

        for (let i = 0; i < this.maxBeats; i++) {
          loop.beats.push({
            selected: false
          });
        }
      }

      await this.loadSounds();
    },

    loadSounds: async function() {
      const decoder = new AudioDecoder(this.audioCtx);
      for (const key in this.keyboard) {
        const item = this.keyboard[key];
        item.audio = await decoder.loadFile(`/sounds/${item.sound}.wav`);
      }
    },

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
  margin: 0;
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
  display: flex;
  align-items: center;
  text-align: left;
  justify-content: space-between;
  margin: 5px;
}

.toolbox--item {
  display: flex;
  align-items: center;
}

.toolbox--lable {
  margin-right: 5px;
}
/* * {
  box-shadow: inset 0px 0px 0px 1px #f00;
} */
</style>