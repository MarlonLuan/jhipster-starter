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
import { CountryDeleteDialog } from '../delete/country-delete-dialog';

import { CountryDetail } from './country-detail';

describe('Country Management Detail Component', () => {
  let comp: CountryDetail;
  let fixture: ComponentFixture<CountryDetail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NgbModal, useValue: { open: vi.fn() } },

        provideTranslateService(),
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./country-detail').then(m => m.CountryDetail),
              resolve: { country: () => of({ id: 'a1ca43c7-d3dc-4ed5-b59f-305e45dea973' }) },
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
    fixture = TestBed.createComponent(CountryDetail);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load country on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', CountryDetail);

      // THEN
      expect(instance.country()).toEqual(expect.objectContaining({ id: 'a1ca43c7-d3dc-4ed5-b59f-305e45dea973' }));
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

      comp.delete({ id: 'a1ca43c7-d3dc-4ed5-b59f-305e45dea973' });

      expect(openSpy).toHaveBeenCalledWith(CountryDeleteDialog, { size: 'lg', backdrop: 'static' });
      expect(navigateSpy).toHaveBeenCalledWith(['/country']);
    });
  });
});
