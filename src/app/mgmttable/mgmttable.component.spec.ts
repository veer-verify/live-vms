import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MgmttableComponent } from './mgmttable.component';

describe('MgmttableComponent', () => {
  let component: MgmttableComponent;
  let fixture: ComponentFixture<MgmttableComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MgmttableComponent]
    });
    fixture = TestBed.createComponent(MgmttableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
