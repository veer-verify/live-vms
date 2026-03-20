import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewCameraComponent } from './add-new-camera.component';

describe('AddNewCameraComponent', () => {
  let component: AddNewCameraComponent;
  let fixture: ComponentFixture<AddNewCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddNewCameraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddNewCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
