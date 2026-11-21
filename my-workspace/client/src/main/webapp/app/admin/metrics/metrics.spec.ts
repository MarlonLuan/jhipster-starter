import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { fontAwesomeIcons } from 'app/config/font-awesome-icons';
import { MetricDetails, MetricsSection } from 'app/shared/jhipster/metrics.model';

import Metrics from './metrics';
import { MetricsDetailsModal } from './metrics-details-modal';
import { MetricsService } from './metrics.service';

describe('Metrics', () => {
  const sections: MetricsSection[] = [
    {
      id: 'memory',
      label: { text: 'Memory' },
      blocks: [{ label: { text: 'Heap' }, items: [{ label: { text: 'Used' }, value: '10 MB' }] }],
      tables: [{ columns: [{ label: { text: 'Pool' } }], rows: [[{ text: 'Eden' }]] }],
    },
  ];
  let comp: Metrics;
  let fixture: ComponentFixture<Metrics>;
  let service: MetricsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });
  });

  beforeEach(() => {
    TestBed.inject(FaIconLibrary).addIcons(...fontAwesomeIcons);
    fixture = TestBed.createComponent(Metrics);
    comp = fixture.componentInstance;
    service = TestBed.inject(MetricsService);
    vi.spyOn(service, 'getMetrics').mockReturnValue(of(sections));
  });

  describe('ngOnInit', () => {
    it('should load the sections on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.getMetrics).toHaveBeenCalled();
      expect(comp.sections()).toEqual(sections);
      expect(comp.updatingMetrics()).toBe(false);
    });
  });

  describe('openDetails', () => {
    it('should open the details in a modal', () => {
      // GIVEN
      const details = { label: { text: 'Details' } } as MetricDetails;
      const modalRef = { componentInstance: {} };
      const open = vi.spyOn(TestBed.inject(NgbModal), 'open').mockReturnValue(modalRef as never);

      // WHEN
      comp.openDetails(details);

      // THEN
      expect(open).toHaveBeenCalledWith(MetricsDetailsModal, { size: 'lg' });
      expect(modalRef.componentInstance).toEqual({ details });
    });
  });

  describe('view', () => {
    const gauge = { percent: 50, text: '50%', status: 'success' as const };
    const fullSections: MetricsSection[] = [
      {
        id: 'jvm',
        label: { text: 'JVM' },
        blocks: [
          {
            label: { text: 'Memory' },
            items: [
              { label: { text: 'Heap' }, value: '1 MB', note: 'of 2 MB', gauge },
              { label: { text: 'Classes' }, value: '10' },
            ],
            details: { label: { text: 'Threads' } } as MetricDetails,
          },
          { items: [{ label: { text: 'Uptime' }, value: '1 h' }] },
        ],
        tables: [
          {
            columns: [{ label: { text: 'Name' } }, { label: { text: 'Count' }, numeric: true }, { label: { text: 'Usage' } }],
            rows: [[{ text: 'gc' }, { text: '2' }, { text: '', gauge }]],
          },
        ],
      },
      { id: 'cache', label: { text: 'Cache' }, blocks: [], tables: [] },
    ];

    beforeEach(async () => {
      vi.mocked(service.getMetrics).mockReturnValue(of(fullSections));
      await fixture.whenStable();
    });

    it('should render the sections', () => {
      const element = fixture.nativeElement as HTMLElement;
      expect(element.textContent).toContain('of 2 MB');
      expect(element.textContent).toContain('Cache');
      expect(element.querySelectorAll('ngb-progressbar')).toHaveLength(2);
      expect(element.querySelectorAll('td.text-end')).toHaveLength(1);
      expect(element.querySelector('.alert-info')).toBeNull();
    });

    it('should refresh and open the details from their buttons', () => {
      const open = vi.spyOn(TestBed.inject(NgbModal), 'open').mockReturnValue({ componentInstance: {} } as never);
      const element = fixture.nativeElement as HTMLElement;

      element.querySelector<HTMLButtonElement>('h2 button')!.click();
      element.querySelector<HTMLButtonElement>('.col-md-4 button')!.click();

      expect(service.getMetrics).toHaveBeenCalledTimes(2);
      expect(open).toHaveBeenCalled();
    });

    it('should tell that the metrics are updating', async () => {
      comp.updatingMetrics.set(true);
      await fixture.whenStable();

      expect((fixture.nativeElement as HTMLElement).querySelector('.alert-info')).not.toBeNull();
    });
  });
});
