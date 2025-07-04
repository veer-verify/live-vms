import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DayRangeSliderComponent } from './day-range-slider.component';

describe('DayRangeSliderComponent', () => {
  let component: DayRangeSliderComponent;
  let fixture: ComponentFixture<DayRangeSliderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DayRangeSliderComponent]
    });
    fixture = TestBed.createComponent(DayRangeSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
