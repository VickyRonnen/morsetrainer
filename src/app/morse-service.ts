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
        duration -= 3*this.Ts;
        duration += 7*this.Ts;
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
          duration += 3*this.Ts;
          break;
      }
    }
    return duration;
  }

  async send(character: string) {
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = this.tone;
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    gain.gain.setValueAtTime(0, this.ctx.currentTime);

    let wallClock = this.ctx.currentTime;
    for (const t of Alphabet.alphabet[character].morse + '$') {
      if (t === ' ') {
        wallClock -= 3*this.Ts;
        wallClock += 7*this.Ts;
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
          wallClock += 3*this.Ts;
          gain.gain.setTargetAtTime(0, wallClock, this.Tramp);
          break;
      }
    }

    return new Promise<string>((resolve, reject) => {
      const onEnded = async () => {
        try {
          osc.disconnect();
          gain.disconnect();
          resolve(character);
        } catch (e) {
          reject(e);
        }
      };

      osc.addEventListener('ended', onEnded, {once: true});

      try {
        osc.start();
        osc.stop(wallClock);
      } catch (e) {
        osc.removeEventListener('ended', onEnded);
        osc.disconnect();
        gain.disconnect();
        reject(e);
      }
    });
  }
}
