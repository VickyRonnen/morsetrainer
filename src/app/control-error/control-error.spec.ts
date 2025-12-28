import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ControlError} from './control-error';

describe('ControlError', () => {
  let component: ControlError;
  let fixture: ComponentFixture<ControlError>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControlError]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ControlError);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
