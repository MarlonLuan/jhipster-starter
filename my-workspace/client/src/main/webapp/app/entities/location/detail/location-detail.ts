import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslatePipe } from '@ngx-translate/core';

import { Alert } from 'app/shared/alert/alert';
import { AlertError } from 'app/shared/alert/alert-error';
import { TranslateDirective } from 'app/shared/language';
import { ILocation } from '../location.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'jhi-location-detail',
  templateUrl: './location-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, TranslatePipe, RouterLink],
})
export class LocationDetail {
  readonly location = input<ILocation | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
