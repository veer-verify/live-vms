import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountryStateCityComponent } from './country-state-city.component';

describe('CountryStateCityComponent', () => {
  let component: CountryStateCityComponent;
  let fixture: ComponentFixture<CountryStateCityComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CountryStateCityComponent]
    });
    fixture = TestBed.createComponent(CountryStateCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
