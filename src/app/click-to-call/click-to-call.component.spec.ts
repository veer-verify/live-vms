import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClickToCallComponent } from './click-to-call.component';

describe('ClickToCallComponent', () => {
  let component: ClickToCallComponent;
  let fixture: ComponentFixture<ClickToCallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClickToCallComponent]
    });
    fixture = TestBed.createComponent(ClickToCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
