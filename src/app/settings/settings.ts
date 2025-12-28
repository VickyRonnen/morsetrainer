import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ControlError} from '../control-error/control-error';
import {debounceTime, distinctUntilChanged} from 'rxjs';
import {AutoFocusDirective} from '../auto-focus.directive';
import {MorseService} from '../morse-service';

@Component({
  selector: 'app-settings',
  imports: [
    ReactiveFormsModule,
    ControlError,
    AutoFocusDirective
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.css'
})
export class Settings implements OnInit {
  darkMode: boolean = (localStorage.getItem('darkMode') || 'true') === 'true';
  duration = Number.parseInt(localStorage.getItem('duration') || '30');
  groupSize = Number.parseInt(localStorage.getItem('groupSize') || '5');
  pause = Number.parseInt(localStorage.getItem('pause') || '1');
  revealBefore = (localStorage.getItem('revealBefore') || 'false') === 'true';
  tone = Number.parseInt(localStorage.getItem('tone') || '800');
  toneVolume = Number.parseFloat(localStorage.getItem('toneVolume') || '0.5');
  voice: any = localStorage.getItem('voice');
  voiceVolume = Number.parseFloat(localStorage.getItem('voiceVolume') || '0.5');
  voiceRate = Number.parseFloat(localStorage.getItem('voiceRate') || '1');
  wordSpeed = Number.parseInt(localStorage.getItem('wordSpeed') || '5');
  protected voices: SpeechSynthesisVoice[] = [];
  protected settingsForm!: FormGroup;
  private readonly morseService = inject(MorseService);
  private readonly cdr = inject(ChangeDetectorRef);


  constructor(private readonly fb: FormBuilder) {
    const tones = [300, 440, 600, 800, 1000];
    if (!tones.includes(this.tone)) {
      this.tone = 800;
    }
    this.settingsForm = this.fb.group({
      'wordSpeed': new FormControl(this.wordSpeed, {
        nonNullable: true,
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(5), Validators.max(30)]
      }),
      'groupSize': new FormControl(this.groupSize, {
        nonNullable: true,
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(1), Validators.max(15)]
      }),
      'pause': new FormControl(this.pause, {
        nonNullable: true,
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(0), Validators.max(10)]
      }),
      'duration': new FormControl(this.duration, {
        nonNullable: true,
        updateOn: 'blur',
        validators: [Validators.required, Validators.min(5), Validators.max(300)]
      }),
      'tone': new FormControl(this.tone, {nonNullable: true, validators: [Validators.required]}),
      'toneVolume': new FormControl(this.toneVolume, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0), Validators.max(1)]
      }),
      'revealBefore': new FormControl(this.revealBefore, {nonNullable: true, validators: [Validators.required]}),
      'voice': new FormControl(this.voice, {nonNullable: true, validators: [Validators.required]}),
      'voiceVolume': new FormControl(this.voiceVolume, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0), Validators.max(1)]
      }),
      'voiceRate': new FormControl(this.voiceRate, {
        nonNullable: true,
        validators: [Validators.required, Validators.min(0.5), Validators.max(1.5)]
      }),
      'darkMode': new FormControl(this.darkMode, {nonNullable: true, validators: [Validators.required]}),
    });
  }

  ngOnInit(): void {
    const loadVoices = () => {
      let tmp = globalThis.speechSynthesis.getVoices();
      if (tmp.length > 0) {
        this.voices = tmp
          .filter(e => ['en-US', 'en-GB', 'en_US', 'en_GB'].some(lang => e.lang.startsWith(lang)))
          .sort((a, b) => a.name.localeCompare(b.name));

        this.voice = this.voices.at(-1)?.name;
        this.cdr.detectChanges();
        this.settingsForm.controls['voice'].setValue(this.voice);
        this.settingsForm.get('voice')?.valueChanges.pipe(
          distinctUntilChanged(),  // Only emit if the value actually changes
          debounceTime(100)        // Wait 100ms after the last change (optional, prevents spam during fast changes)
        ).subscribe((value: string) => {
          this.voice = value;
          this.testVoice(this.voice, this.voiceVolume, this.voiceRate);
        });

      }
    };
    loadVoices();
    globalThis.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
    this.settingsForm.get('tone')?.valueChanges.pipe(
      distinctUntilChanged(),  // Only emit if the value actually changes
      debounceTime(100)        // Wait 100ms after the last change (optional, prevents spam during fast changes)
    ).subscribe((value: string) => {
      this.tone = Number.parseInt(value);
      this.playBeep(this.tone, this.toneVolume);
    });
    this.settingsForm.get('toneVolume')?.valueChanges.pipe(
      distinctUntilChanged(),  // Only emit if the value actually changes
      debounceTime(100)        // Wait 100ms after the last change (optional, prevents spam during fast changes)
    ).subscribe((value: string) => {
      this.toneVolume = Number.parseFloat(value);
      this.playBeep(this.tone, this.toneVolume);
    });
    this.settingsForm.get('voiceVolume')?.valueChanges.pipe(
      distinctUntilChanged(),  // Only emit if the value actually changes
      debounceTime(200)        // Wait 200ms after the last change (optional, prevents spam during fast changes)
    ).subscribe((value: string) => {
      this.voiceVolume = Number.parseFloat(value);
      this.testVolume(this.voice, this.voiceVolume);
    });
    this.settingsForm.get('voiceRate')?.valueChanges.pipe(
      distinctUntilChanged(),  // Only emit if the value actually changes
      debounceTime(200)        // Wait 200ms after the last change (optional, prevents spam during fast changes)
    ).subscribe((value: string) => {
      this.voiceRate = Number.parseFloat(value);
      this.testVoice(this.voice, this.voiceVolume, this.voiceRate);
    });

    this.settingsForm.get('darkMode')?.valueChanges.pipe(
      distinctUntilChanged()
    ).subscribe((value: boolean) => {
      this.darkMode = value;
      globalThis.document.body.dataset['bsTheme'] = this.darkMode ? 'dark' : 'light';
    });
  }

  submit() {
    localStorage.setItem('wordSpeed', this.settingsForm.value['wordSpeed']);
    localStorage.setItem('groupSize', this.settingsForm.value['groupSize']);
    localStorage.setItem('pause', this.settingsForm.value['pause']);
    localStorage.setItem('duration', this.settingsForm.value['duration']);
    localStorage.setItem('tone', this.settingsForm.value['tone']);
    localStorage.setItem('toneVolume', this.settingsForm.value['toneVolume']);
    localStorage.setItem('revealBefore', this.settingsForm.value['revealBefore']);
    localStorage.setItem('voice', this.settingsForm.value['voice']);
    localStorage.setItem('voiceVolume', this.settingsForm.value['voiceVolume']);
    localStorage.setItem('voiceRate', this.settingsForm.value['voiceRate']);
    localStorage.setItem('darkMode', this.settingsForm.value['darkMode']);
    this.morseService.readSettings();
  }

  onReset() {
    this.settingsForm.reset();
    if (!this.voice) {
      this.voice = this.voices.at(0)?.name;
    }
    this.settingsForm.controls['voice'].setValue(this.voice);
  }

  onBack() {
    history.back();
  }

  private playBeep(frequency: number, volume: number) {
    const audioContext = new (globalThis.AudioContext || (globalThis as any).webkitAudioContext)();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.frequency.value = frequency;
    gainNode.gain.value = volume;
    this.toneVolume = volume;
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
      oscillator.disconnect();
      gainNode.disconnect();
      audioContext.close();
    }, 100);
  }

  private testVoice(voice: string, volume: number, rate: number) {
    const tts = new SpeechSynthesisUtterance();
    tts.lang = 'en';
    tts.voice = this.voices.find((value) => {
      tts.text = value.name + ' is selected. Voice rate ' + rate;
      return value.name == voice;
    }) || null;
    this.voiceVolume = volume;
    tts.volume = volume;
    tts.rate = rate;
    speechSynthesis.speak(tts);
  }

  private testVolume(voice: string, volume: number) {
    const tts = new SpeechSynthesisUtterance();
    tts.lang = 'en';
    tts.voice = this.voices.find((value) => {
      tts.text = value.name + ' is selected';
      return value.name == voice;
    }) || null;
    tts.text = 'Voice volume';
    tts.rate = 1.1;
    this.voiceVolume = volume;
    tts.volume = volume;
    speechSynthesis.speak(tts);
  }

}
