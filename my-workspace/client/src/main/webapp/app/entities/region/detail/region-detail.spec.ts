import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router, provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faPencilAlt, faTrash } from '@fortawesome/free-solid-svg-icons';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ITEM_DELETED_EVENT } from 'app/config';
import { RegionDeleteDialog } from '../delete/region-delete-dialog';

import { RegionDetail } from './region-detail';

describe('Region Management Detail Component', () => {
  let comp: RegionDetail;
  let fixture: ComponentFixture<RegionDetail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NgbModal, useValue: { open: vi.fn() } },

        provideTranslateService(),
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./region-detail').then(m => m.RegionDetail),
              resolve: { region: () => of({ id: '1ecde3bf-dd1f-4d49-8a3d-4407d415f7b6' }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    });
    const library = TestBed.inject(FaIconLibrary);
    library.addIcons(faArrowLeft);
    library.addIcons(faPencilAlt);

    library.addIcons(faTrash);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionDetail);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load region on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', RegionDetail);

      // THEN
      expect(instance.region()).toEqual(expect.objectContaining({ id: '1ecde3bf-dd1f-4d49-8a3d-4407d415f7b6' }));
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

      comp.delete({ id: '1ecde3bf-dd1f-4d49-8a3d-4407d415f7b6' });

      expect(openSpy).toHaveBeenCalledWith(RegionDeleteDialog, { size: 'lg', backdrop: 'static' });
      expect(navigateSpy).toHaveBeenCalledWith(['/region']);
    });
  });
});
