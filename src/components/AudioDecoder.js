export default class AudioDecoder {
  constructor(audioContext) {
    this.audioContext = audioContext;
  }

  async loadFile(filepath) {
    const response = await fetch(filepath);
    const arrayBuffer = await response.arrayBuffer();
    // Safari doesn't support promise for audioContext.decodeAudioData
    const audioBuffer = await this.decodeAudioDataAsync(
      this.audioContext,
      arrayBuffer
    );
    return audioBuffer;
  }

  async decodeAudioDataAsync(audioContext, arrayBuffer) {
    return new Promise((resolve, reject) => {
      audioContext.decodeAudioData(
        arrayBuffer,
        buffer => {
          resolve(buffer);
        },
        e => {
          reject(e);
        }
      );
    });
  }
}
