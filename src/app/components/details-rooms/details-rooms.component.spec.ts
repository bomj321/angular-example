import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsRoomsComponent } from './details-rooms.component';

describe('DetailsRoomsComponent', () => {
  let component: DetailsRoomsComponent;
  let fixture: ComponentFixture<DetailsRoomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsRoomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
