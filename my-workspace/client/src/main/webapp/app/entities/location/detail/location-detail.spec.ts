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
import { LocationDeleteDialog } from '../delete/location-delete-dialog';

import { LocationDetail } from './location-detail';

describe('Location Management Detail Component', () => {
  let comp: LocationDetail;
  let fixture: ComponentFixture<LocationDetail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NgbModal, useValue: { open: vi.fn() } },

        provideTranslateService(),
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./location-detail').then(m => m.LocationDetail),
              resolve: { location: () => of({ id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' }) },
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
    fixture = TestBed.createComponent(LocationDetail);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load location on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', LocationDetail);

      // THEN
      expect(instance.location()).toEqual(expect.objectContaining({ id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' }));
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

      comp.delete({ id: '469e42cb-716b-406a-b8e0-a82cf8e41cdc' });

      expect(openSpy).toHaveBeenCalledWith(LocationDeleteDialog, { size: 'lg', backdrop: 'static' });
      expect(navigateSpy).toHaveBeenCalledWith(['/location']);
    });
  });
});
