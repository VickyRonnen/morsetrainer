import {inject, Injectable, signal} from '@angular/core';
import {LessonMode} from '../lesson-mode';
import {MorseService} from './morse-service';
import {Alphabet} from './alphabet';

@Injectable({
  providedIn: 'root',
})
export class LessonService {
  private duration: number = 0;
  private groupSize: number = 0;
  private pause: number = 0;
  private revealBefore: boolean = false;
  private voice: string | undefined | null = '';
  private voiceVolume: number = 0;
  private readonly morseService: MorseService = inject(MorseService);
  state = signal<'stop' | 'sending' | 'readout'>('stop');
  text1 = signal<string>('');
  text2 = signal<string>('');
  text3 = signal<string>('');
  private utterance!: SpeechSynthesisUtterance;
  private index: number = 0;
  private voices: SpeechSynthesisVoice[] = [];
  sendText: string = '';
  private voiceRate: number = 0;

  // Prevent overlapping runs + allow cancellation of in-flight send()
  private runId = 0;
  private runAbort?: AbortController;

  readSettings() {
    this.duration = Number.parseInt(localStorage.getItem('duration') || '30', 10);
    this.groupSize = Number.parseInt(localStorage.getItem('groupSize') || '5', 10);
    this.pause = Number.parseInt(localStorage.getItem('pause') || '3', 10);
    this.revealBefore = (localStorage.getItem('revealBefore') || 'false') === 'true';
    this.voice = localStorage.getItem('voice');
    this.voiceVolume = Number.parseFloat(localStorage.getItem('voiceVolume') || '0.5');
    this.voiceRate = Number.parseFloat(localStorage.getItem('voiceRate') || '1');

    const loadVoices = () => {
      let tmp = globalThis.speechSynthesis.getVoices();
      if (tmp.length > 0) {
        this.voices = tmp
          .filter(e => ['en-US', 'en-GB', 'en_US', 'en_GB'].some(lang => e.lang.startsWith(lang)))
          .sort((a, b) => a.name.localeCompare(b.name));
      }
    };
    loadVoices();
    globalThis.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }

  private randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  async start(lessonMode: LessonMode, newLetters: string[], oldLetters: string[]) {
    this.readSettings();

    // cancel any previous run immediately
    this.stop();

    const myRunId = ++this.runId;
    this.runAbort = new AbortController();

    this.state.set('sending');
    this.text1.set('');
    this.text2.set('');
    this.text3.set('');
    this.sendText = '';

    await new Promise(resolve => setTimeout(resolve, this.pause * 1000));
    if (this.state() === 'stop' || myRunId !== this.runId) {
      return;
    }

    const lessonContent: string[] = this.generate(lessonMode, newLetters, oldLetters);
    for (const group of lessonContent) {
      if (this.state() === 'stop' || myRunId !== this.runId) {
        break;
      }
      await this.sendGroup(group, myRunId);
    }
    if (this.state() === 'sending' && myRunId === this.runId) {
      this.readOut();
    }
  }

  readOut() {
    this.state.set('readout');
    const parts: string[] = this.sendText.trimEnd().split(' ');
    this.utterance = new SpeechSynthesisUtterance();
    this.utterance.volume = this.voiceVolume;
    this.utterance.voice = this.voices.find((value): boolean => value.name === this.voice) || null;
    this.utterance.rate = this.voiceRate;

    let text: string = '';
    this.utterance.onend = () => {
      this.text1.set('');
      this.text2.set('');
      this.text3.set('');
      text = '';
      for (let i = 0; i < this.index; i++) {
        this.text1.set(this.text1() + parts[i] + ' ');
      }
      if (parts[this.index] == undefined) {
        this.text2.set('');
        this.text3.set('');
        this.utterance.onend = null;
        this.index = 0;
        this.state.set('stop');
        return;
      } else {
        this.text2.set(parts[this.index]);
        for (let c of parts[this.index]) {
          text += Alphabet.alphabet[c].spelling;
          this.utterance.text = text;
        }
      }
      for (let i = this.index + 1; i < parts.length; i++) {
        this.text3.set(this.text3() + parts[i] + ' ');
      }
      if (text == '') {
        this.text1.set(this.sendText);
        this.text2.set('');
        this.text3.set('');
        this.utterance.onend = null;
        this.index = 0;
        this.state.set('stop');
      } else {
        this.utterance.text = ' ' + text;
        speechSynthesis.speak(this.utterance);
        this.index++;
      }
    };
    this.utterance.text = ' ' + text;
    speechSynthesis.speak(this.utterance);
  }

  stop() {
    // invalidate any in-flight async work
    this.runId++;

    this.state.set('stop');
    globalThis.speechSynthesis.cancel();

    if (this.utterance) {
      this.utterance.onend = null;
    }

    // abort in-flight morse send() and stop any currently playing oscillator immediately
    try { this.runAbort?.abort(); } catch { /* ignore */ }
    this.runAbort = undefined;
    this.morseService.stopAll();

    this.index = 0;
  }

  generate(lessonMode: LessonMode, newLetters: string[], oldLetters: string[]): string[] {
    const groups: string[] = [];
    let currentDuration = 0;
    let letters = [];

    switch (lessonMode) {
      case LessonMode.NewOnly:
        letters = newLetters;
        break;
      case LessonMode.NewAndOldFiftyFifty:
        do letters.push(...newLetters); while (letters.length < oldLetters.length);
        letters.push(...oldLetters);
        break;
      case LessonMode.NewAndOld:
        letters = newLetters.concat(oldLetters);
        break;
      default:
        throw new Error('Unknown lesssonMode ' + lessonMode);
    }

    let counter = 0;
    let n = 0;
    groups[n] = '';
    while (currentDuration < this.duration && letters.length > 0) {
      if (counter > 0 && counter % this.groupSize === 0) {
        currentDuration += this.morseService.computeDuration(' ');
        n++;
        groups[n] = '';
      }
      let c = letters[this.randomInteger(0, letters.length)];
      currentDuration += this.morseService.computeDuration(c);
      groups[n] += c;
      counter++;
    }
    while (groups[n].length > 0 && groups[n].length != this.groupSize) {
      let c = letters[this.randomInteger(0, letters.length)];
      groups[n] += c;
    }
    return groups.filter(g => g.length > 0);
  }

  canReadOut(): boolean {
    if (this.sendText == undefined)
      return false;
    else {
      return this.state() === 'stop' && this.sendText.length > 0;
    }
  }

  async startWords(words: string[]) {
    this.readSettings();

    // cancel any previous run immediately
    this.stop();

    const myRunId = ++this.runId;
    this.runAbort = new AbortController();

    this.state.set('sending');
    this.text1.set('');
    this.text2.set('');
    this.text3.set('');
    this.sendText = '';

    await new Promise(resolve => setTimeout(resolve, this.pause * 1000));
    if (this.state() === 'stop' || myRunId !== this.runId) {
      return;
    }

    const lessonContent: string[] = this.generateWords(words);
    for (const word of lessonContent) {
      if (this.state() === 'stop' || myRunId !== this.runId) {
        break;
      }
      await this.sendGroup(word, myRunId);
    }
    if (this.state() === 'sending' && myRunId === this.runId) {
      this.readOut();
    }
  }

  async sendGroup(word: string, myRunId: number) {
    for (const letter of word + ' ') {
      if (this.state() === 'stop' || myRunId !== this.runId) {
        break;
      }
      try {
        if (this.revealBefore) {
          this.text1.set(this.text1() + letter);
        }

        const sent = await this.morseService.send(letter, this.runAbort?.signal);

        if (this.state() === 'stop' || myRunId !== this.runId) {
          break;
        }

        this.sendText += sent;
        if (!this.revealBefore) {
          this.text1.set(this.text1() + sent);
        }
      } catch (error) {
        // Abort is expected when stopping; don't spam console
        if (error instanceof DOMException && error.name === 'AbortError') {
          break;
        }
        console.error(`Failed to send letter ${letter}:`, error);
      }
    }
  }

  private generateWords(words: string[]) {
    let currentDuration = 0;
    let groups: string[] = [];
    let n = 0;

    while (currentDuration < this.duration && words.length > 0) {
      let word = words[this.randomInteger(0, words.length)];
      for (let c of word) {
        currentDuration += this.morseService.computeDuration(c);
      }
      currentDuration += this.morseService.computeDuration(' ');
      groups[n++] = word;
    }
    return groups;
  }
}
