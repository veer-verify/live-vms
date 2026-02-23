import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualprocessComponent } from './manualprocess.component';

describe('ManualprocessComponent', () => {
  let component: ManualprocessComponent;
  let fixture: ComponentFixture<ManualprocessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManualprocessComponent]
    });
    fixture = TestBed.createComponent(ManualprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
