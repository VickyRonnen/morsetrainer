import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink
  ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit{
  private readonly cdr = inject(ChangeDetectorRef);
  protected startupError: string | undefined;
  protected nvoices: number = 0;

  ngOnInit(): void {
    this.checkSpeechSynthesisSupport().then(supported => {
      if (!supported) {
        this.startupError = 'Speech synthesis is not working in your browser. Try to reload the page or use another browser.';
      }
      this.cdr.detectChanges();
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
      this.nvoices = voices.length;
      return Promise.resolve(true);
    }

    // Some browsers load voices asynchronously
    return new Promise<boolean>((resolve) => {
      const timeout = setTimeout(() => {
        console.warn('No voices found, waiting for speechSynthesis.onvoiceschanged');
        this.nvoices = voices.length;
        resolve(false);
      }, 2000);

      globalThis.speechSynthesis.onvoiceschanged = () => {
        console.log('onvoiceschanged fired')
        const voices = globalThis.speechSynthesis.getVoices();
        if (voices.length > 0) {
          this.nvoices = voices.length;
          console.log('voices found, resolving');
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
