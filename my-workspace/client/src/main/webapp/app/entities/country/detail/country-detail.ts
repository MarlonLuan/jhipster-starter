import { Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { filter, tap } from 'rxjs';

import { ITEM_DELETED_EVENT } from 'app/config';
import { Alert, AlertError } from 'app/shared/alert';
import { TranslateDirective } from 'app/shared/language';
import { ICountry } from '../country.model';
import { CountryDeleteDialog } from '../delete/country-delete-dialog';

@Component({
  selector: 'jhi-country-detail',
  templateUrl: './country-detail.html',
  imports: [FontAwesomeModule, Alert, AlertError, TranslateDirective, RouterLink],
})
export class CountryDetail {
  readonly country = input<ICountry | null>(null);
  private readonly modalService = inject(NgbModal);
  private readonly router = inject(Router);

  previousState(): void {
    globalThis.history.back();
  }

  delete(country: ICountry): void {
    const modalRef = this.modalService.open(CountryDeleteDialog, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.country = country;
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        tap(() => void this.router.navigate(['/country'])),
      )
      .subscribe();
  }
}
