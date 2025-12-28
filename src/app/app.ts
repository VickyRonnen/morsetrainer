import {Component, OnInit} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {Nav} from './nav/nav';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Nav],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'morsetrainer';
  protected startupError: any;

  ngOnInit(): void {
    globalThis.document.body.dataset['bsTheme'] = (localStorage.getItem('darkMode')||'true') === 'true' ? 'dark' : 'light';
    if (!this.isSpeechSynthesisSupported()) {
      this.startupError = 'Speech synthesis is not supported by your browser, use another browser';
      return;
    }

    if (!this.isLocalStorageSupported()) {
      this.startupError = 'Local storage is not supported by your browser, use another browser';
      return;
    }

    if (!this.isLocalStorageEnabled()) {
      this.startupError = 'Local storage is not enabled in your browser, enable it.';
    }
  }

  private isSpeechSynthesisSupported(): boolean {
    return 'speechSynthesis' in globalThis;
  }

  private isLocalStorageSupported(): boolean {
    return 'localStorage' in globalThis;
  }

  private isLocalStorageEnabled(): boolean {
    const uuid = uuidv4();
    localStorage.setItem(uuid, uuid);
    const result = localStorage.getItem(uuid);
    localStorage.removeItem(uuid);
    return uuid === result;
  }
}

