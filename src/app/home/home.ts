import {Component, OnInit} from '@angular/core';

import {v4 as uuidv4} from 'uuid';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  protected localStorageWorking: boolean = false;
  protected audioContextWorking: boolean = AudioContext !== undefined;
  protected speechSynthesisWorking: boolean = false;

  ngOnInit(): void {
    this.testLocalStorage();
    this.testSpeechSynthesis();
    this.testAudioContext();
  }

  protected testAudioContext() {
    const ctx = new AudioContext();
    this.audioContextWorking = ctx !== undefined;
    return this.audioContextWorking;
  }

  protected testSpeechSynthesis() {
    const tts = new SpeechSynthesisUtterance();
    this.speechSynthesisWorking = tts != undefined;
    return this.speechSynthesisWorking;
  }

  private testLocalStorage() {
    const uuid = uuidv4();
    localStorage.setItem(uuid, uuid);
    const result = localStorage.getItem(uuid);
    localStorage.removeItem(uuid);
    this.localStorageWorking = uuid === result;
  }
}
