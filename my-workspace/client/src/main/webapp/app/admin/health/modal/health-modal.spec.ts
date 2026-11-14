import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { provideTranslateService } from '@ngx-translate/core';

import HealthModal from './health-modal';

describe('HealthModal', () => {
  let comp: HealthModal;
  let fixture: ComponentFixture<HealthModal>;
  let mockActiveModal: NgbActiveModal;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgbActiveModal, provideTranslateService()],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealthModal);
    comp = fixture.componentInstance;
    mockActiveModal = TestBed.inject(NgbActiveModal);
  });

  describe('view', () => {
    it('should show the details and the error of an indicator', async () => {
      // GIVEN
      comp.check = {
        id: 'db.primary',
        label: { text: 'db' },
        sublabel: 'primary',
        status: { text: 'DOWN' },
        healthy: false,
        error: 'failed',
        details: [{ key: 'database', value: 'H2' }],
      };

      // WHEN
      await fixture.whenStable();

      // THEN
      expect(fixture.nativeElement.textContent).toContain('H2');
      expect(fixture.nativeElement.textContent).toContain('failed');
      expect(fixture.nativeElement.textContent).toContain(' - primary');
    });
  });

  describe('view without a check', () => {
    it('should render a check without sublabel', async () => {
      comp.check = { id: 'ping', label: { text: 'ping' }, status: { text: 'UP' }, healthy: true };
      await fixture.whenStable();

      expect((fixture.nativeElement as HTMLElement).querySelector('h4')?.textContent).not.toContain(' - ');
    });

    it('should render no details', async () => {
      await fixture.whenStable();

      expect((fixture.nativeElement as HTMLElement).querySelector('table')).toBeNull();
      expect((fixture.nativeElement as HTMLElement).querySelector('pre')).toBeNull();
    });

    it('should dismiss from the buttons', async () => {
      const spy = vi.spyOn(mockActiveModal, 'dismiss');
      await fixture.whenStable();

      for (const button of (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>('button')) {
        button.click();
      }

      expect(spy).toHaveBeenCalledTimes(2);
    });
  });

  describe('dismiss', () => {
    it('should call dismiss when dismiss modal is called', () => {
      // GIVEN
      const spy = vi.spyOn(mockActiveModal, 'dismiss');

      // WHEN
      comp.dismiss();

      // THEN
      expect(spy).toHaveBeenCalled();
    });
  });
});
