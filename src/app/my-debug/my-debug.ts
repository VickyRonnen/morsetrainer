import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';

@Component({
  selector: 'app-my-debug',
  imports: [],
  templateUrl: './my-debug.html',
  styleUrl: './my-debug.css',
})
export class MyDebug implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  protected voices: SpeechSynthesisVoice[] = [];
  private voice: string | undefined;

  ngOnInit(): void {
    const loadVoices = () => {
      let tmp = globalThis.speechSynthesis.getVoices();
      if (tmp.length > 0) {
        this.voices = tmp
          .filter(e => ['en-US', 'en-GB','en_US','en_GB'].some(lang => e.lang.startsWith(lang)))
          .sort((a, b) => a.name.localeCompare(b.name));

        this.voice = this.voices.at(-1)?.name;
        this.cdr.detectChanges();
      }
    };
    loadVoices();
    globalThis.speechSynthesis.onvoiceschanged = () => {
      loadVoices();
    };
  }
}
