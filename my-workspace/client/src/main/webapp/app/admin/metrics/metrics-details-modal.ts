import { Component, computed, inject, signal } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';

import { MetricDetails } from 'app/shared/jhipster/metrics.model';
import { LabelPipe } from 'app/shared/language';

@Component({
  selector: 'jhi-metrics-details-modal',
  templateUrl: './metrics-details-modal.html',
  imports: [FontAwesomeModule, LabelPipe],
})
export class MetricsDetailsModal {
  readonly selectedValue = signal<string | undefined>(undefined);
  readonly term = signal('');
  readonly shownItems = signal(new Set<string>());
  readonly detailsValue = signal<MetricDetails | undefined>(undefined);
  readonly items = computed(() => {
    const selectedValue = this.selectedValue();
    const term = this.term().toLowerCase();
    return (this.detailsValue()?.items ?? []).filter(
      ({ title, value }) => (!selectedValue || value === selectedValue) && title.toLowerCase().includes(term),
    );
  });

  private readonly activeModal = inject(NgbActiveModal);

  get details(): MetricDetails | undefined {
    return this.detailsValue();
  }

  set details(details: MetricDetails | undefined) {
    this.detailsValue.set(details);
  }

  toggle(title: string): void {
    this.shownItems.update(shownItems => {
      const items = new Set(shownItems);
      if (!items.delete(title)) {
        items.add(title);
      }
      return items;
    });
  }

  dismiss(): void {
    this.activeModal.dismiss();
  }
}
