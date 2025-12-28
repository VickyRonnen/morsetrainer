import {Component, OnDestroy, OnInit, signal} from '@angular/core';
import {LessonMode} from '../../lesson-mode';
import {ActivatedRoute, Router} from '@angular/router';
import {LessonService} from '../lesson-service';


@Component({
  selector: 'app-letter-lesson',
  templateUrl: './letter-lesson.html',
  styleUrl: './letter-lesson.css',
})
export class LetterLesson implements OnInit, OnDestroy {
  private readonly letters: string = 'KMRSUAPTLOWI.NJEF0Y,VG5/Q9ZH38B?427C1D6X';
  protected readonly LessonMode = LessonMode;
  protected readonly isBusy = signal<boolean>(false);
  protected newLetters: string[] = [];
  private oldLetters: string[] = [];
  protected lesson: number = 1;

  constructor(private readonly router: Router, private readonly activatedRoute: ActivatedRoute, protected readonly lessonService: LessonService) {
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
      this.lesson = Number.parseInt(params.get('id') ?? '1');
      if (this.lesson < 1 || this.lesson > this.letters.length / 2)
        this.lesson = 1;
      let n = this.lesson - 1;
      this.newLetters = [...this.letters.substring(2 * n, 2 * n + 2)];
      this.oldLetters = [...this.letters.substring(0, 2 * n)];
    });
    this.lessonService.text1.set('');
    this.lessonService.text2.set('');
    this.lessonService.text3.set('');
    this.lessonService.sendText = '';
  }

  ngOnDestroy(): void {
    this.lessonService.stop();
  }

  protected async start(lessonMode: LessonMode) {
    this.isBusy.set(true);
    try {
      localStorage.setItem('letter-lesson', this.lesson.toString());
      await this.lessonService.start(lessonMode, this.newLetters, this.oldLetters);
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


  protected canPrev() {
    return this.lesson > 1;
  }

  protected gotoLesson(lesson: number) {
    if (this.lesson < 1 || this.lesson > this.letters.length / 2)
      lesson = 1;
    this.router.  navigate(['/letters', lesson]);
  }

  protected canNext() {
    return this.lesson < this.letters.length / 2;
  }
}


