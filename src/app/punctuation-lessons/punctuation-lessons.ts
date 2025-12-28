import {Component, HostListener, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Punctuation} from '../punctuation';
import {AutoFocusDirective} from '../auto-focus.directive';
import {Lesson} from '../lesson';


@Component({
  selector: 'app-punctuation-lesson',
  imports: [
    AutoFocusDirective
  ],
  templateUrl: './punctuation-lessons.html',
  styleUrl: './punctuation-lessons.css'
})
export class PunctuationLessons implements OnInit {
  private readonly router = inject(Router);

  currentLesson: number = Number.parseInt(localStorage.getItem('punctuation-lesson') || '1');
  protected lessons: Lesson[] = Punctuation.lessons;
  private index: number=-1;


  ngOnInit() {
    this.currentLesson = Number.parseInt(localStorage.getItem('punctuation-lesson') ?? '1');
    localStorage.setItem('punctuation-lesson', this.currentLesson.toString());
  }

  protected gotoLesson(number: number) {
    localStorage.setItem('punctuation-lesson', number.toString());
    this.currentLesson = number;
    this.router.navigate(['/punctuations', number]).then();

  }

  @HostListener('window:keydown', ['$event'])
  protected handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLButtonElement;

    const buttons: HTMLButtonElement[] = Array.from(document.querySelectorAll('.lesson-button'));
    if (this.index===-1)
      this.index = buttons.findIndex(e=>e.classList.contains('active-lesson'))
    const columns = this.getColumns();
    let nextIndex = -1;

    switch (event.key) {
      case 'ArrowRight':
        nextIndex = this.index + 1;
        break;
      case 'ArrowLeft':
        nextIndex = this.index - 1;
        break;
      case 'ArrowDown':
        nextIndex = this.index + columns;
        break;
      case 'ArrowUp':
        nextIndex = this.index - columns;
        break;
      case 'Enter':
      case ' ':
        target.click();
        return;
      default:
        return;
    }

    if (nextIndex >= 0 && nextIndex < buttons.length) {
      event.preventDefault();
      buttons[nextIndex].focus();
      this.index = nextIndex;
    }
  }

  private getColumns(): number {
    const width = window.innerWidth;
    if (width >= 992) return 4; // lg
    if (width >= 768) return 3; // md
    if (width >= 576) return 2; // sm
    return 1; // xs
  }
}
