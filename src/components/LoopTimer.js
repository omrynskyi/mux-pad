export default class LoopTimer {
  constructor(audioContext, settings, callback) {
    this._audioContext = audioContext;
    this._callback = callback;
    this._settings = settings;

    this._currentNote = 0;
    this._nextNoteTime = 0;
    this._lookahead = 20.0; // How frequently to call scheduling function (in milliseconds)
    this._scheduleAheadTime = 0.1; // How far ahead to schedule audio (sec)

    this._timer;
  }

  start() {
    this._stop = false;
    this._scheduler();
  }

  stop() {
    this._stop = true;
  }

  _scheduler() {
    if (this._stop) {
      return;
    }

    while (
      this._nextNoteTime <
      this._audioContext.currentTime + this._scheduleAheadTime
    ) {
      this._callback(this._currentNote, this._nextNoteTime);

      const interval = 60 / (this._settings.bpm * 2);
      console.log("bpm: ", this._settings.bpm);
      this._nextNoteTime += interval; // Add beat length to last beat time

      // Advance the beat number, wrap to zero
      this._currentNote++;
      if (this._currentNote === this._settings.mB) {
        this._currentNote = 0;
      }
    }

    this._timer = setTimeout(() => {
      this._scheduler();
    }, this._lookahead);
  }
}
