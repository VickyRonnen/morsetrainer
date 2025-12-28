import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LetterLesson} from './letter-lesson';

describe('Lesson', () => {
  let component: LetterLesson;
  let fixture: ComponentFixture<LetterLesson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetterLesson]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LetterLesson);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
