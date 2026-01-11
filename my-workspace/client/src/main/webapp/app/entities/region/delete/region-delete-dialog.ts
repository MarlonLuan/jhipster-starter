import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';
import SharedModule from 'app/shared/shared.module';
import { IRegion } from '../region.model';
import { RegionService } from '../service/region.service';

@Component({
  templateUrl: './region-delete-dialog.html',
  imports: [SharedModule, FormsModule],
})
export class RegionDeleteDialog {
  region?: IRegion;

  protected regionService = inject(RegionService);
  protected activeModal = inject(NgbActiveModal);

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.regionService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
