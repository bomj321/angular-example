import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopWrapperHomeComponent } from './top-wrapper-home.component';

describe('TopWrapperHomeComponent', () => {
  let component: TopWrapperHomeComponent;
  let fixture: ComponentFixture<TopWrapperHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopWrapperHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopWrapperHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
