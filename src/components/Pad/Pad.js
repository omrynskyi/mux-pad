import AudioDecoder from "@/components/AudioDecoder.js";
export default {
  name: "Pad",
  props: ["keyboard", "rows", "audio-context", "edit"],
  mounted() {
    this.allowPressKey = {};
    // Register an event listener when the Vue component is ready
    window.addEventListener("keydown", this.keyDown);
    window.addEventListener("keyup", this.keyUp);
    window.addEventListener("touchstart", this.keyDown);
    window.addEventListener("touchend", this.keyUp);
  },
  data() {
    return {
      sounds: [{
        name: "Kick-808",
        sound: "kick-808",
      },
      {
        name: "snare vinyl",
        sound: "snare-vinyl01",
      },
      {
        name: "clap",
        sound: "clap-tape",
      },
      {
        name: "hi-hat",
        sound: "hihat-acoustic01",
      },
      {
        name: "hi-hat808",
        sound: "hihat-808",
      },
      {
        name: "cowbell",
        sound: "cowbell-808",
      },
      {
        name: "Kick1",
        sound: "kick-classic",
      },
      {
        name: "snare808",
        sound: "snare-808",
      },
      {
        name: "Kick2",
        sound: "kick-tape",
      }],
      editKey: false,
      currentKey:{}
    }
  },
  methods: {
    play: function(key) {
      console.log(key);
      this.selectedKey = key;
      this.audioContext.resume();

      const playbackRate = 1;
      const sampleSource = this.audioContext.createBufferSource();
      sampleSource.buffer = key.audio;
      sampleSource.playbackRate.setValueAtTime(
        playbackRate,
        this.audioContext.currentTime
      );
      sampleSource.connect(this.audioContext.destination);
      sampleSource.start();
    },

    keyDown: function(e) {
      if (typeof this.allowPressKey[e.keyCode] === "undefined") {
        this.allowPressKey[e.keyCode] = true;
      }

      if (!this.allowPressKey[e.keyCode]) {
        return;
      }

      this.allowPressKey[e.keyCode] = false;
      const key = this.keyboard[e.keyCode];
      if (key) {
        key.selected = true;

        setTimeout(() => this.play(key));
      }
    },
    keyUp: function(e) {
      this.allowPressKey[e.keyCode] = true;

      const key = this.keyboard[e.keyCode];
      if (key) {
        key.selected = false;
      }
    },

    select: function(key) {
      if (this.edit) {
        this.editKey = true;
        this.selectedKey = key;
        this.currentKey.sound = this.selectedKey.sound;
        this.currentKey.color = this.selectedKey.color;
      } else { 
        this.play(key);
      }
    },

    confirmEdit: async function() {
      this.editKey = false;
      this.selectedKey.name= this.currentKey.name;
      this.selectedKey.sound= this.currentKey.sound;
      this.selectedKey.color = this.currentKey.color;

      const decoder = new AudioDecoder(this.audioContext);
      this.selectedKey.audio = await decoder.loadFile(`/sounds/${this.selectedKey.sound}.wav`);
      
    }
  }
};
