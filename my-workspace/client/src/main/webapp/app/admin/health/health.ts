import { Component, OnInit, inject, signal } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';

import { HealthCheck } from 'app/shared/jhipster/health.model';
import { LabelPipe, TranslateDirective } from 'app/shared/language';

import { HealthService } from './health.service';
import HealthModal from './modal/health-modal';

@Component({
  selector: 'jhi-health',
  templateUrl: './health.html',
  imports: [LabelPipe, TranslateDirective, FontAwesomeModule],
})
export default class Health implements OnInit {
  readonly checks = signal<HealthCheck[] | null>(null);

  private readonly modalService = inject(NgbModal);
  private readonly healthService = inject(HealthService);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.healthService.checkHealth().subscribe(checks => this.checks.set(checks));
  }

  showHealth(check: HealthCheck): void {
    const modalRef = this.modalService.open(HealthModal);
    modalRef.componentInstance.check = check;
  }
}
