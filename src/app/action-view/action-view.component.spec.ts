import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionViewComponent } from './action-view.component';

describe('ActionViewComponent', () => {
  let component: ActionViewComponent;
  let fixture: ComponentFixture<ActionViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActionViewComponent]
    });
    fixture = TestBed.createComponent(ActionViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
