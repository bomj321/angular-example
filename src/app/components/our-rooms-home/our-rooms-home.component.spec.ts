import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurRoomsHomeComponent } from './our-rooms-home.component';

describe('OurRoomsHomeComponent', () => {
  let component: OurRoomsHomeComponent;
  let fixture: ComponentFixture<OurRoomsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurRoomsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurRoomsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
