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
import { TaskDeleteDialog } from '../delete/task-delete-dialog';

import { TaskDetail } from './task-detail';

describe('Task Management Detail Component', () => {
  let comp: TaskDetail;
  let fixture: ComponentFixture<TaskDetail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: NgbModal, useValue: { open: vi.fn() } },

        provideTranslateService(),
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./task-detail').then(m => m.TaskDetail),
              resolve: { task: () => of({ id: 'ca341530-545c-46df-8582-8232c8c59bdb' }) },
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
    fixture = TestBed.createComponent(TaskDetail);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('should load task on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', TaskDetail);

      // THEN
      expect(instance.task()).toEqual(expect.objectContaining({ id: 'ca341530-545c-46df-8582-8232c8c59bdb' }));
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

      comp.delete({ id: 'ca341530-545c-46df-8582-8232c8c59bdb' });

      expect(openSpy).toHaveBeenCalledWith(TaskDeleteDialog, { size: 'lg', backdrop: 'static' });
      expect(navigateSpy).toHaveBeenCalledWith(['/task']);
    });
  });
});
