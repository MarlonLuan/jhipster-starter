import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { provideTranslateService } from '@ngx-translate/core';
import { EMPTY, of } from 'rxjs';

import { fontAwesomeIcons } from 'app/config/font-awesome-icons';
import { HealthCheck } from 'app/shared/jhipster/health.model';

import Health from './health';
import { HealthService } from './health.service';
import HealthModal from './modal/health-modal';

describe('Health', () => {
  let comp: Health;
  let fixture: ComponentFixture<Health>;
  let service: HealthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideTranslateService()],
    });
  });

  beforeEach(() => {
    TestBed.inject(FaIconLibrary).addIcons(...fontAwesomeIcons);
    fixture = TestBed.createComponent(Health);
    comp = fixture.componentInstance;
    service = TestBed.inject(HealthService);
  });

  describe('refresh', () => {
    it('should call refresh on init', () => {
      // GIVEN
      const checks: HealthCheck[] = [{ id: 'mail', label: { text: 'Mail' }, status: { text: 'UP' }, healthy: true }];
      vi.spyOn(service, 'checkHealth').mockReturnValue(of(checks));

      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.checkHealth).toHaveBeenCalled();
      expect(comp.checks()).toEqual(checks);
    });
  });

  describe('view', () => {
    const checks: HealthCheck[] = [
      { id: 'db', label: { text: 'Database' }, sublabel: 'H2', status: { text: 'UP' }, healthy: true, details: [{ key: 'a', value: 'b' }] },
      { id: 'mail', label: { text: 'Email' }, status: { text: 'DOWN' }, healthy: false, error: 'refused' },
      { id: 'ping', label: { text: 'Ping' }, status: { text: 'UP' }, healthy: true },
    ];

    beforeEach(async () => {
      vi.spyOn(service, 'checkHealth').mockReturnValue(of(checks));
      await fixture.whenStable();
    });

    it('should render the checks', () => {
      const element = fixture.nativeElement as HTMLElement;
      expect(element.textContent).toContain(' - H2');
      expect(element.querySelectorAll('.bg-danger')).toHaveLength(1);
      expect(element.querySelectorAll('tbody a.hand')).toHaveLength(2);
    });

    it('should refresh the checks', () => {
      (fixture.nativeElement as HTMLElement).querySelector<HTMLButtonElement>('h2 button')!.click();

      expect(service.checkHealth).toHaveBeenCalledTimes(2);
    });

    it('should render no check before they load', async () => {
      vi.mocked(service.checkHealth).mockReturnValue(EMPTY);
      comp.checks.set(null);
      await fixture.whenStable();

      expect((fixture.nativeElement as HTMLElement).querySelector('tbody')).toBeNull();
    });

    it('should show a check in a modal', () => {
      const modalRef = { componentInstance: {} };
      const open = vi.spyOn(TestBed.inject(NgbModal), 'open').mockReturnValue(modalRef as never);

      (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>('tbody a.hand')!.click();

      expect(open).toHaveBeenCalledWith(HealthModal);
      expect(modalRef.componentInstance).toEqual({ check: checks[0] });
    });
  });
});
