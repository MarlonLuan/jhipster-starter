import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { IRegion } from '../region.model';

@Component({
  selector: 'jhi-region-detail',
  templateUrl: './region-detail.html',
  imports: [SharedModule, RouterLink],
})
export class RegionDetail {
  region = input<IRegion | null>(null);

  previousState(): void {
    globalThis.history.back();
  }
}
