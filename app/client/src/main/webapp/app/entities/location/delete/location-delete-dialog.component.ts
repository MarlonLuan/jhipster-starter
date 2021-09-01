import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILocation } from '../location.model';
import { LocationService } from '../service/location.service';

@Component({
  templateUrl: './location-delete-dialog.component.html',
})
export class LocationDeleteDialogComponent {
  location?: ILocation;

  constructor(protected locationService: LocationService, public activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: string): void {
    this.locationService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}
