import { Component, OnInit, inject, signal } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { NgbProgressbar } from '@ng-bootstrap/ng-bootstrap/progressbar';
import { finalize } from 'rxjs';

import { MetricDetails, MetricsSection } from 'app/shared/jhipster/metrics.model';
import { LabelPipe, TranslateDirective } from 'app/shared/language';

import { MetricsDetailsModal } from './metrics-details-modal';
import { MetricsService } from './metrics.service';

@Component({
  selector: 'jhi-metrics',
  templateUrl: './metrics.html',
  imports: [FontAwesomeModule, NgbProgressbar, LabelPipe, TranslateDirective],
})
export default class Metrics implements OnInit {
  readonly sections = signal<MetricsSection[]>([]);
  readonly updatingMetrics = signal(true);

  private readonly metricsService = inject(MetricsService);
  private readonly modalService = inject(NgbModal);

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.updatingMetrics.set(true);
    this.metricsService
      .getMetrics()
      .pipe(finalize(() => this.updatingMetrics.set(false)))
      .subscribe(sections => this.sections.set(sections));
  }

  openDetails(details: MetricDetails): void {
    const modalRef = this.modalService.open(MetricsDetailsModal, { size: 'lg' });
    modalRef.componentInstance.details = details;
  }
}
