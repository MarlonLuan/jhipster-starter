import { Component, inject } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';

import { HealthCheck } from 'app/shared/jhipster/health.model';
import { LabelPipe, TranslateDirective } from 'app/shared/language';

@Component({
  selector: 'jhi-health-modal',
  templateUrl: './health-modal.html',
  imports: [LabelPipe, TranslateDirective],
})
export default class HealthModal {
  check?: HealthCheck;

  private readonly activeModal = inject(NgbActiveModal);

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
