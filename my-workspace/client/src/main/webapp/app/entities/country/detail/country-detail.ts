import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { ICountry } from '../country.model';

@Component({
  selector: 'jhi-country-detail',
  templateUrl: './country-detail.html',
  imports: [FontAwesomeModule, NgbModule, Alert, AlertError, TranslateDirective, TranslateModule, RouterLink],
})
export class CountryDetail {
  country = input<ICountry | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
