import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { ICountry } from '../country.model';

@Component({
  selector: 'jhi-country-detail',
  templateUrl: './country-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink],
})
export class CountryDetail {
  readonly country = input<ICountry | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
