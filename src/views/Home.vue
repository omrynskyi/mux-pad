<template>
  <div class="container">
    <header>
      <div>
        <button @click="start">{{(this.playing) ? "stop" : "play"}}</button>
        <input type="range" min="60" max="240" v-model="audioSettings.bpm">
        {{audioSettings.bpm}}
      </div>
      <Loops :loops="loops" :current="currentBeat"></Loops>
    </header>
    <main class="main">
      <Pad :keyboard="keyboard" :rows="rows" :audio-context="audioCtx"></Pad>
    </main>
    <footer>
      Press keys to play sounds
      Click on squares on top
      to loop the sounds and create a drum beat
    </footer>
  </div>
</template>

<script>
// @ is an alias to /src
import Loops from "@/components/Loops.vue";
import Pad from "@/components/Pad.vue";
import LoopTimer from "@/components/LoopTimer.js";
export default {
  name: "home",
  components: {
    Loops,
    Pad,
    LoopTimer
  },
  data: function() {
    const maxBeats = 16;
    const bpm = 90;

    const keyboard = {
      103: {
        name: "Kick808",
        code: 103,
        color: "#5a2266",
        sound: "kick-808",
        selected: false
      },
      104: {
        name: "snare vinyl",
        code: 104,
        color: "#17a59c",
        sound: "snare-vinyl01",
        selected: false
      },
      105: {
        name: "clap",
        code: 105,
        color: "green",
        sound: "clap-tape",
        selected: false
      },
      100: {
        name: "hi-hat",
        code: 100,
        color: "#ffd951",
        sound: "hihat-acoustic01",
        selected: false
      },
      101: {
        name: "hi-hat808",
        code: 101,
        color: "#dddd2c",
        sound: "hihat-808",
        selected: false
      },
      102: {
        name: "cowbell",
        code: 102,
        color: "#e2a036",
        sound: "cowbell-808",
        selected: false
      },
      97: {
        name: "Kick1",
        code: 97,
        color: "#8c56a5",
        sound: "kick-classic",
        selected: false
      },
      98: {
        name: "snare808",
        code: 98,
        color: "#33c4bd",
        sound: "snare-808",
        selected: false
      },
      99: {
        name: "Kick2",
        code: 99,
        color: "#873baa",
        sound: "kick-tape",
        selected: false
      }
    };

    //TODO: rework to build rows automatically based on ther grid settings
    const rows = [
      [keyboard[103], keyboard[104], keyboard[105]],
      [keyboard[100], keyboard[101], keyboard[102]],
      [keyboard[97], keyboard[98], keyboard[99]]
    ];

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

    return {
      keyboard: keyboard,
      rows: rows,
      loops: loops,
      playing: false,
      audioSettings: { bpm: bpm, mB: maxBeats },
      currentBeat: 0
    };
  },
  async created() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const audioCtx = new AudioContext();
    this.audioCtx = audioCtx;

    await loadSounds(audioCtx, this.keyboard);

    this.timer = new LoopTimer(audioCtx, this.audioSettings, this.play);

    async function loadSounds(audioCtx, keyboard) {
      for (const key in keyboard) {
        const item = keyboard[key];
        item.audio = await loadFile(audioCtx, item.sound);
      }
    }

    async function loadFile(audioContext, filepath) {
      console.log(filepath);
      const response = await fetch(`/sounds/${filepath}.wav`);
      const arrayBuffer = await response.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      return audioBuffer;
    }
  },
  methods: {
    play: function(num, time) {
      console.log(num, time);

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
</style>