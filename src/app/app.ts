import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
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
  private readonly cdr = inject(ChangeDetectorRef);


  ngOnInit(): void {
    globalThis.document.body.dataset['bsTheme'] = (localStorage.getItem('darkMode') || 'true') === 'true' ? 'dark' : 'light';
    this.checkSpeechSynthesisSupport().then(supported => {
      if (!supported) {
        this.startupError = 'Speech synthesis is not supported by your browser, use another browser';
        this.cdr.detectChanges();
      }
    });

    if (!this.isLocalStorageSupported()) {
      this.startupError = 'Local storage is not supported by your browser, use another browser';
      return;
    }

    if (!this.isLocalStorageEnabled()) {
      this.startupError = 'Local storage is not enabled in your browser, enable it.';
    }
  }

  private isLocalStorageSupported(): boolean {
    return 'localStorage' in globalThis;
  }

  private checkSpeechSynthesisSupport(): Promise<boolean> {
    if (!('speechSynthesis' in globalThis)) {
      return Promise.resolve(false);
    }

    const voices = globalThis.speechSynthesis.getVoices();
    if (voices.length > 0) {
      return Promise.resolve(true);
    }

    // Some browsers load voices asynchronously
    return new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => resolve(false), 1000);

      globalThis.speechSynthesis.onvoiceschanged = () => {
        const voices = globalThis.speechSynthesis.getVoices();
        if (voices.length > 0) {
          clearTimeout(timeout);
          resolve(true);
        }
        // Don't resolve false here - wait for timeout or more voices
      };
    });
  }

  private isLocalStorageEnabled(): boolean {
    const uuid = uuidv4();
    localStorage.setItem(uuid, uuid);
    const result = localStorage.getItem(uuid);
    localStorage.removeItem(uuid);
    return uuid === result;
  }

}

