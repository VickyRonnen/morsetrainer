import {ComponentFixture, TestBed} from '@angular/core/testing';

import {WordsLesson} from './word-lesson';

describe('Words', () => {
  let component: WordsLesson;
  let fixture: ComponentFixture<WordsLesson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WordsLesson]
    })
      .compileComponents();

    fixture = TestBed.createComponent(WordsLesson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
