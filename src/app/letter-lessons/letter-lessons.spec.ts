import {ComponentFixture, TestBed} from '@angular/core/testing';

import LetterLessons from './letter-lessons';

describe('Lessons', () => {
  let component: LetterLessons;
  let fixture: ComponentFixture<LetterLessons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LetterLessons]
    })
      .compileComponents();

    fixture = TestBed.createComponent(LetterLessons);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
