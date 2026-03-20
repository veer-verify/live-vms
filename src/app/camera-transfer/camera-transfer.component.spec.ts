import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CameraTransferComponent } from './camera-transfer.component';

describe('CameraTransferComponent', () => {
  let component: CameraTransferComponent;
  let fixture: ComponentFixture<CameraTransferComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CameraTransferComponent]
    });
    fixture = TestBed.createComponent(CameraTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
