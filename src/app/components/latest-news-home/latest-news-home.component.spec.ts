import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LatestNewsHomeComponent } from './latest-news-home.component';

describe('LatestNewsHomeComponent', () => {
  let component: LatestNewsHomeComponent;
  let fixture: ComponentFixture<LatestNewsHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LatestNewsHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LatestNewsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
