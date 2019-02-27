export default class Audio {
  constructor() {
    this.context = new AudioContext() || new webkitAudioContext();
  }

  async load(filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.context.decodeAudioData(arrayBuffer);
    return audioBuffer;
  }

  play(audioBuffer, playbackRate) {
    playbackRate = playbackRate || 1;

    const sampleSource = this.context.createBufferSource();
    sampleSource.buffer = audioBuffer;
    sampleSource.playbackRate.setValueAtTime(
      playbackRate,
      this.context.currentTime
    );
    sampleSource.connect(this.context.destination);
    sampleSource.start();
    return sampleSource;
  }
}
