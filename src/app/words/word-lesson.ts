import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {Word} from '../word';
import {LessonService} from '../lesson-service';


@Component({
  selector: 'app-word-lesson',
  templateUrl: './word-lesson.html',
  styleUrl: './word-lesson.css',
})
export class WordLesson implements OnInit, OnDestroy {
  private readonly words: string[] = Word.words;
  protected readonly isBusy = signal<boolean>(false);

  constructor(protected readonly lessonService: LessonService) {
  }

  ngOnInit(): void {
    this.lessonService.text1.set('');
    this.lessonService.text2.set('');
    this.lessonService.text3.set('');
    this.lessonService.sendText = '';
  }

  ngOnDestroy(): void {
    this.lessonService.stop();
  }

  protected async start() {
    this.isBusy.set(true);
    try {
      await this.lessonService.startWords(this.words);
    } finally {
      this.isBusy.set(false);
    }
  }

  protected stop() {
    this.isBusy.set(false);
    this.lessonService.stop();
  }

  protected readOut() {
    this.isBusy.set(true);
    this.lessonService.readOut();
  }

}


