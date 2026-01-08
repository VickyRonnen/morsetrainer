import {Injectable} from '@angular/core';
import {Alphabet} from './alphabet';

@Injectable({
  providedIn: 'root',
})
export class MorseService {
  private readonly ctx: AudioContext = new AudioContext();

  private wordSpeed!: number;
  private Tramp!: number;
  private tone!: number;
  private toneVolume!: number;
  private Tl: number = 0;
  private Ts: number = 0;

  // Track currently playing nodes so we can stop them immediately
  private readonly activeOscillators = new Set<OscillatorNode>();
  private readonly activeGains = new Set<GainNode>();

  constructor() {
    this.readSettings();
  }

  readSettings() {
    this.wordSpeed = Number.parseInt(localStorage.getItem('wordSpeed') || '5');
    this.Tl = 1.2 / Math.max(18, this.wordSpeed);
    this.Tramp = this.Tl / 20;
    this.Ts = this.Tl;
    if (this.wordSpeed < 18) { //Use Farnsworth timing
      this.Ts = 60 / (19 * this.wordSpeed) - (31 / 19) * this.Tl;
    }
    this.tone = Number.parseFloat(localStorage.getItem('tone') || '440');
    this.toneVolume = Number.parseFloat(localStorage.getItem('toneVolume') || '0.5');
  }

  computeDuration(c: string) {
    let duration = 0;
    for (const t of Alphabet.alphabet[c].morse + '$') {
      if (t === ' ') {
        duration -= 3 * this.Ts;
        duration += 7 * this.Ts;
        break;
      }
      switch (t) {
        case '.':
          duration += this.Tl;
          duration += this.Tl;
          break;
        case '-':
          duration += 3 * this.Tl;
          duration += this.Tl;
          break;
        case '$':
          duration -= this.Tl;
          duration += 3 * this.Ts;
          break;
      }
    }
    return duration;
  }

  /** Immediately stops any in-flight tone(s). Safe to call even if nothing is playing. */
  stopAll() {
    const now = this.ctx.currentTime;

    for (const gain of this.activeGains) {
      try {
        gain.gain.cancelScheduledValues(now);
        gain.gain.setValueAtTime(0, now);
      } catch {
        // ignore
      }
    }

    for (const osc of this.activeOscillators) {
      try {
        osc.stop(now);
      } catch {
        // ignore (already stopped)
      }
    }
  }

  async send(character: string, signal?: AbortSignal) {
    if (signal?.aborted) {
      throw new DOMException('Aborted', 'AbortError');
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    this.activeOscillators.add(osc);
    this.activeGains.add(gain);

    const cleanup = () => {
      this.activeOscillators.delete(osc);
      this.activeGains.delete(gain);
      try { osc.disconnect(); } catch { /* ignore */ }
      try { gain.disconnect(); } catch { /* ignore */ }
    };

    osc.type = 'sine';
    osc.frequency.value = this.tone;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    gain.gain.setValueAtTime(0, this.ctx.currentTime);

    let wallClock = this.ctx.currentTime;
    for (const t of Alphabet.alphabet[character].morse + '$') {
      if (t === ' ') {
        wallClock -= 3 * this.Ts;
        wallClock += 7 * this.Ts;
        gain.gain.setTargetAtTime(0, wallClock, this.Tramp);
        break;
      }
      switch (t) {
        case '.':
          gain.gain.setTargetAtTime(this.toneVolume, wallClock, this.Tramp);
          wallClock += this.Tl - 2 * this.Tramp;
          gain.gain.setTargetAtTime(0, wallClock, this.Tramp);
          wallClock += this.Tl;
          break;
        case '-':
          gain.gain.setTargetAtTime(this.toneVolume, wallClock, this.Tramp);
          wallClock += 3 * this.Tl - 2 * this.Tramp;
          gain.gain.setTargetAtTime(0, wallClock, this.Tramp);
          wallClock += this.Tl;
          break;
        case '$':
          wallClock -= this.Tl;
          wallClock += 3 * this.Ts;
          gain.gain.setTargetAtTime(0, wallClock, this.Tramp);
          break;
      }
    }

    return new Promise<string>((resolve, reject) => {
      const onAbort = () => {
        try {
          // hard stop immediately
          const now = this.ctx.currentTime;
          try {
            gain.gain.cancelScheduledValues(now);
            gain.gain.setValueAtTime(0, now);
          } catch {
            // ignore
          }
          try { osc.stop(now); } catch { /* ignore */ }
        } finally {
          cleanup();
          reject(new DOMException('Aborted', 'AbortError'));
        }
      };

      const onEnded = () => {
        try {
          cleanup();
          resolve(character);
        } catch (e) {
          cleanup();
          reject(e);
        } finally {
          signal?.removeEventListener('abort', onAbort);
        }
      };

      if (signal) {
        signal.addEventListener('abort', onAbort, {once: true});
      }

      osc.addEventListener('ended', onEnded, {once: true});

      try {
        osc.start();
        osc.stop(wallClock);
      } catch (e) {
        signal?.removeEventListener('abort', onAbort);
        cleanup();
        reject(e);
      }
    });
  }
}
