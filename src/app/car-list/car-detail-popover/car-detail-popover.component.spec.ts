import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDetailPopoverComponent } from './car-detail-popover.component';

describe('CarDetailPopoverComponent', () => {
  let component: CarDetailPopoverComponent;
  let fixture: ComponentFixture<CarDetailPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CarDetailPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarDetailPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
