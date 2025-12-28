import { TestBed } from '@angular/core/testing';

import { Morse } from './morse';

describe('Morse', () => {
  let service: Morse;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Morse);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
