import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ICountry } from '../country.model';

@Component({
  selector: 'jhi-country-detail',
  templateUrl: './country-detail.html',
  imports: [SharedModule, RouterLink],
})
export class CountryDetail {
  country = input<ICountry | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
