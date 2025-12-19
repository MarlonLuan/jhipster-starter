import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import SharedModule from 'app/shared/shared.module';
import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';

@Component({
  templateUrl: './location-delete-dialog.html',
  imports: [SharedModule, FormsModule],
})
export class LocationDeleteDialog {
  location?: ILocation;

  protected locationService = inject(LocationService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.locationService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
