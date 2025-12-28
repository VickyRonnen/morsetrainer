import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunctuationLesson } from './punctuation-lesson';

describe('PunctuationLesson', () => {
  let component: PunctuationLesson;
  let fixture: ComponentFixture<PunctuationLesson>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PunctuationLesson]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PunctuationLesson);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
