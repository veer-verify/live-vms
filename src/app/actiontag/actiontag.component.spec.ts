import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiontagComponent } from './actiontag.component';

describe('ActiontagComponent', () => {
  let component: ActiontagComponent;
  let fixture: ComponentFixture<ActiontagComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActiontagComponent]
    });
    fixture = TestBed.createComponent(ActiontagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
