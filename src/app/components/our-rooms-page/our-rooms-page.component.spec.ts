import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OurRoomsPageComponent } from './our-rooms-page.component';

describe('OurRoomsPageComponent', () => {
  let component: OurRoomsPageComponent;
  let fixture: ComponentFixture<OurRoomsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OurRoomsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OurRoomsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
