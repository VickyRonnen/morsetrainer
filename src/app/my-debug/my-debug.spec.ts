import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDebug } from './my-debug';

describe('MyDebug', () => {
  let component: MyDebug;
  let fixture: ComponentFixture<MyDebug>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyDebug]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyDebug);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
