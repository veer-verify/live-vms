import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringHoursComponent } from './monitoring-hours.component';

describe('MonitoringHoursComponent', () => {
  let component: MonitoringHoursComponent;
  let fixture: ComponentFixture<MonitoringHoursComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringHoursComponent]
    });
    fixture = TestBed.createComponent(MonitoringHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
