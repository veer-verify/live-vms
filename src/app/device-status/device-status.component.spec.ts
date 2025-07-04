import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeviceStatusComponent } from './device-status.component';

describe('DeviceStatusComponent', () => {
  let component: DeviceStatusComponent;
  let fixture: ComponentFixture<DeviceStatusComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DeviceStatusComponent]
    });
    fixture = TestBed.createComponent(DeviceStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
