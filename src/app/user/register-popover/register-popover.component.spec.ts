import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterPopoverComponent } from './register-popover.component';

describe('RegisterPopoverComponent', () => {
  let component: RegisterPopoverComponent;
  let fixture: ComponentFixture<RegisterPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegisterPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
