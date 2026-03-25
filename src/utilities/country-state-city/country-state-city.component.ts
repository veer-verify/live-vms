import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Country, State, City } from 'country-state-city';

@Component({
  selector: 'app-country-state-city',
  templateUrl: './country-state-city.component.html',
  styleUrls: ['./country-state-city.component.css'],
})
export class CountryStateCityComponent {

  @Input() data: any;
  @Output() sendData: any = new EventEmitter();

  fb = inject(FormBuilder);
  form!: FormGroup;
  ngOnInit() {
    if(this.data) {
      this.form = this.fb.group(this.data);
    } else {
      this.form = this.fb.group({
        country: this.fb.control('US', Validators.required),
        state: this.fb.control('NV', Validators.required),
        city: this.fb.control('Las Vegas', Validators.required),
      });
    }
    
    this.onCountryChange();
    this.onStateChange();
  }

  ngAfterViewInit() {
    this.emitData();
  }

  /** state country and city */
  countries: any = Country.getAllCountries();
  states: any = null;
  cities: any = null;

  onCountryChange(): void {
    this.states = State.getStatesOfCountry(
      this.form.get('country')!.value
    );
  }

  onStateChange(): void {
    this.cities = City.getCitiesOfState(
      this.form.get('country')!.value,
      this.form.get('state')!.value
    );
  }

  emitData() {
    this.sendData.emit(this.form.value);
  }
}
