import {Component, inject, OnInit} from '@angular/core';
import {Alphabet} from '../alphabet';
import {BreakpointObserver} from '@angular/cdk/layout';
import {map, shareReplay} from 'rxjs';
import {AsyncPipe} from '@angular/common';

type LessonItem = {
  lesson: number;
  char: string;
  label: string;
  morse: string;
  morseAriaLabel: string;
};

@Component({
  selector: 'app-overview',
  imports: [
    AsyncPipe
  ],
  templateUrl: './overview.html',
  styleUrl: './overview.css',
})
export class Overview implements OnInit {
  private readonly letters: string = 'KMRSUAPTLOWI.NJEF0Y,VG5/Q9ZH38B?427C1D6X';
  private readonly punctuations: string = '.,!?&@\'"():;=/-+';
  protected letterItems: LessonItem[] = [];
  protected punctuationItems: LessonItem[] = [];
  private readonly breakpointObserver = inject(BreakpointObserver);
  isLargeScreen$ = this.breakpointObserver.observe('(min-width: 768px)')
    .pipe(map(result => result.matches), shareReplay());

  ngOnInit(): void {
    this.letterItems = this.generateLessonItems(this.letters);
    this.punctuationItems = this.generateLessonItems(this.punctuations);
  }

  private generateLessonItems(chars: string): LessonItem[] {
    return [...chars].map((char, index) => {
      const upperChar = char.toUpperCase();
      const data = Alphabet.alphabet[upperChar];
      if (!data) {
        throw new Error(`Invalid character: ${char} not found in alphabet`);
      }

      return {
        lesson: Math.ceil((index + 1) / 2),
        char,
        label: data.spelling,
        morse: data.morse,
        morseAriaLabel: this.textToMorse(data.morse)
      };
    });
  }

  textToMorse(text: string): string {
    return text.toUpperCase()
      .replaceAll('.', 'dit ')
      .replaceAll('-', 'dah ')
      .trim();
  }

  chunkedItems(items: LessonItem[]) {
    const pairs: LessonItem[][] = [];
    for (let i = 0; i < items.length; i += 2) {
      pairs.push([items[i], items[i + 1]]);
    }
    return pairs;
  }
}
