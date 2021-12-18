import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinalReservationComponent } from './final-reservation.component';

describe('FinalReservationComponent', () => {
  let component: FinalReservationComponent;
  let fixture: ComponentFixture<FinalReservationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinalReservationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinalReservationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
