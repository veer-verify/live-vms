import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewEventComponent } from './add-new-event.component';

describe('AddNewEventComponent', () => {
  let component: AddNewEventComponent;
  let fixture: ComponentFixture<AddNewEventComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewEventComponent]
    });
    fixture = TestBed.createComponent(AddNewEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
