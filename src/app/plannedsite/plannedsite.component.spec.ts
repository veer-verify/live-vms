import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannedsiteComponent } from './plannedsite.component';

describe('PlannedsiteComponent', () => {
  let component: PlannedsiteComponent;
  let fixture: ComponentFixture<PlannedsiteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlannedsiteComponent]
    });
    fixture = TestBed.createComponent(PlannedsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
