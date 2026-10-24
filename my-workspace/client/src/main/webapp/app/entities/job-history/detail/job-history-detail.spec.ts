import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faPencilAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ITEM_DELETED_EVENT } from 'app/config';
import { JobHistoryDeleteDialog } from '../delete/job-history-delete-dialog';

import { JobHistoryDetail } from './job-history-detail';

describe('JobHistory Management Detail Component', () => {
  let comp: JobHistoryDetail;
  let fixture: ComponentFixture<JobHistoryDetail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NgbModal, useValue: { open: vi.fn() } },

        provideTranslateService(),
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./job-history-detail').then(m => m.JobHistoryDetail),
              resolve: { jobHistory: () => of({ id: '9da078bb-af84-4931-a283-fb9e5a42b6fd' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    });
    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faArrowLeft);
    library.addIcons(faPencilAlt);

    library.addIcons(faTimes);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JobHistoryDetail);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load jobHistory on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', JobHistoryDetail);

      // THEN
      expect(instance.jobHistory()).toEqual(expect.objectContaining({ id: '9da078bb-af84-4931-a283-fb9e5a42b6fd' }));
    });
  });

  describe('PreviousState', () => {
    it('should navigate to previous state', () => {
      vi.spyOn(globalThis.history, 'back');
      comp.previousState();
      expect(globalThis.history.back).toHaveBeenCalled();
    });
  });

  describe('Delete', () => {
    it('should open the delete dialog and navigate to the list when the entity is deleted', () => {
      const modalRef = { componentInstance: {}, closed: of(ITEM_DELETED_EVENT) };
      const modalService = TestBed.inject(NgbModal);
      const openSpy = vi.spyOn(modalService, 'open').mockReturnValue(modalRef as unknown as ReturnType<NgbModal['open']>);
      const navigateSpy = vi.spyOn(TestBed.inject(Router), 'navigate');

      comp.delete({ id: '9da078bb-af84-4931-a283-fb9e5a42b6fd' });

      expect(openSpy).toHaveBeenCalledWith(JobHistoryDeleteDialog, { size: 'lg', backdrop: 'static' });
      expect(navigateSpy).toHaveBeenCalledWith(['/job-history']);
    });
  });
});
