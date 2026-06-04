import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { TaskDetail } from './task-detail';

describe('Task Management Detail Component', () => {
  let comp: TaskDetail;
  let fixture: ComponentFixture<TaskDetail>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
      providers: [
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
      vitest.spyOn(window.history, 'back');
      comp.previousState();
      expect(globalThis.history.back).toHaveBeenCalled();
    });
  });
});
