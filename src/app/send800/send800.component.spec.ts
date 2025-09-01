import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Send800Component } from './send800.component';

describe('Send800Component', () => {
  let component: Send800Component;
  let fixture: ComponentFixture<Send800Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Send800Component]
    });
    fixture = TestBed.createComponent(Send800Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
