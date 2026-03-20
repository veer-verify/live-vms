import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewInstallationComponent } from './add-new-installation.component';

describe('AddNewInstallationComponent', () => {
  let component: AddNewInstallationComponent;
  let fixture: ComponentFixture<AddNewInstallationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewInstallationComponent]
    });
    fixture = TestBed.createComponent(AddNewInstallationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
