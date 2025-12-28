import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PunctuationLessons } from './punctuation-lessons';

describe('PunctuationLessons', () => {
  let component: PunctuationLessons;
  let fixture: ComponentFixture<PunctuationLessons>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PunctuationLessons]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PunctuationLessons);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
