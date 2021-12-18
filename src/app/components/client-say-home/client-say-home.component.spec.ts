import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientSayHomeComponent } from './client-say-home.component';

describe('ClientSayHomeComponent', () => {
  let component: ClientSayHomeComponent;
  let fixture: ComponentFixture<ClientSayHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientSayHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientSayHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
