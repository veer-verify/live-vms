import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonitoringInfoComponent } from './monitoring-info.component';

describe('MonitoringInfoComponent', () => {
  let component: MonitoringInfoComponent;
  let fixture: ComponentFixture<MonitoringInfoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MonitoringInfoComponent]
    });
    fixture = TestBed.createComponent(MonitoringInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
