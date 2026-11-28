import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { submit } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { TaskService } from '../service/task.service';
import { ITask } from '../task.model';
import { sampleWithRequiredData } from '../task.test-samples';

import { TaskFormService } from './task-form.service';
import { TaskUpdate } from './task-update';

describe('Task Management Update Component', () => {
  let comp: TaskUpdate;
  let fixture: ComponentFixture<TaskUpdate>;
  let activatedRoute: ActivatedRoute;
  let taskFormService: TaskFormService;
  let taskService: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(TaskUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    taskFormService = TestBed.inject(TaskFormService);
    taskService = TestBed.inject(TaskService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should update editForm', () => {
      const task: ITask = { id: '59358286-4c96-4301-945b-e60ba7cd5403' };

      activatedRoute.data = of({ task });
      comp.ngOnInit();

      expect(comp.task).toEqual(task);
    });
  });

  describe('save', () => {
    it('should save a valid submitted form', async () => {
      // GIVEN
      vi.spyOn(comp, 'save').mockResolvedValue(undefined);
      activatedRoute.data = of({ task: sampleWithRequiredData });
      comp.ngOnInit();

      // WHEN
      await submit(comp.editForm);

      // THEN
      expect(comp.save).toHaveBeenCalled();
    });

    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<ITask>();
      const task = { id: 'ca341530-545c-46df-8582-8232c8c59bdb' };
      vi.spyOn(taskFormService, 'getTask').mockReturnValue(task);
      vi.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(task);
      saveSubject.complete();

      // THEN
      expect(taskFormService.getTask).toHaveBeenCalledWith(comp.taskModel(), task);
      expect(comp.previousState).toHaveBeenCalled();
      expect(taskService.update).toHaveBeenCalledWith(expect.objectContaining(task));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<ITask>();
      const task = { id: 'ca341530-545c-46df-8582-8232c8c59bdb' };
      vi.spyOn(taskFormService, 'getTask').mockReturnValue({ id: null });
      vi.spyOn(taskService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(task);
      saveSubject.complete();

      // THEN
      expect(taskFormService.getTask).toHaveBeenCalled();
      expect(taskService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should resolve the submission when the service completes without a value', async () => {
      // GIVEN
      const saveSubject = new Subject<ITask>();
      vi.spyOn(taskFormService, 'getTask').mockReturnValue({ id: null });
      vi.spyOn(taskService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ task: null });
      comp.ngOnInit();

      // WHEN
      const result = comp.save();
      saveSubject.complete();

      // THEN
      expect(await result).toBeUndefined();
      expect(comp.isSaving()).toEqual(false);
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<ITask>();
      const task = { id: 'ca341530-545c-46df-8582-8232c8c59bdb' };
      vi.spyOn(taskService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ task });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(taskService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });

    it('should mark the fields the server refused', async () => {
      // GIVEN
      const saveSubject = new Subject<ITask>();
      vi.spyOn(taskFormService, 'getTask').mockReturnValue({ id: null });
      vi.spyOn(taskService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ task: null });
      comp.ngOnInit();

      // WHEN
      const result = comp.save();
      saveSubject.error(
        new HttpErrorResponse({
          status: 400,
          error: {
            type: 'https://www.jhipster.tech/problem/constraint-violation',
            message: 'error.validation',
            fieldErrors: [
              { objectName: 'task', field: 'title', message: 'is refused', code: 'Refused' },
              { objectName: 'task', field: 'id', message: 'is refused', code: 'Refused' },
              { objectName: 'task', field: 'notAField', message: 'is refused', code: 'Refused' },
            ],
          },
        }),
      );

      // THEN
      expect(await result).toEqual([expect.objectContaining({ kind: 'server', message: 'is refused', fieldTree: comp.editForm.title })]);
    });

    it('should mark no field for an error without field errors', async () => {
      // GIVEN
      const saveSubject = new Subject<ITask>();
      vi.spyOn(taskFormService, 'getTask').mockReturnValue({ id: null });
      vi.spyOn(taskService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ task: null });
      comp.ngOnInit();

      // WHEN
      const result = comp.save();
      saveSubject.error(new HttpErrorResponse({ status: 500, error: null }));

      // THEN
      expect(await result).toBeUndefined();
    });
  });
});
