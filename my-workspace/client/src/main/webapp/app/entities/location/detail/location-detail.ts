import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { ILocation } from '../location.model';

@Component({
  selector: 'jhi-location-detail',
  templateUrl: './location-detail.html',
  imports: [SharedModule, RouterLink],
})
export class LocationDetail {
  location = input<ILocation | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
