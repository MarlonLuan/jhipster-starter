import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import SharedModule from 'app/shared/shared.module';
import { ICountry } from '../country.model';
import { CountryService } from '../service/country.service';

@Component({
  templateUrl: './country-delete-dialog.html',
  imports: [SharedModule, FormsModule],
})
export class CountryDeleteDialog {
  country?: ICountry;

  protected countryService = inject(CountryService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.countryService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
