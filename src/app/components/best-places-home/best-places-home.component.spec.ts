import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BestPlacesHomeComponent } from './best-places-home.component';

describe('BestPlacesHomeComponent', () => {
  let component: BestPlacesHomeComponent;
  let fixture: ComponentFixture<BestPlacesHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BestPlacesHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BestPlacesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
