import { beforeEach, describe, expect, it } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../task.test-samples';

import { TaskFormService } from './task-form.service';

describe('Task Form Service', () => {
  let service: TaskFormService;

  beforeEach(() => {
    service = TestBed.inject(TaskFormService);
  });

  describe('Service methods', () => {
    describe('createTaskFormModel', () => {
      it('should create the model of a new entity', () => {
        const model = service.createTaskFormModel();

        expect(Object.keys(model)).toEqual(expect.arrayContaining(['id', 'title', 'description']));
      });
    });

    describe('createTaskForm', () => {
      it('should create the form of the model', () => {
        const model = signal(service.createTaskFormModel(sampleWithRequiredData));

        const form = TestBed.runInInjectionContext(() => service.createTaskForm(model));

        expect(form().value()).toEqual(model());
      });

      it('should accept the values of an entity with its required data', () => {
        const entity = sampleWithRequiredData;
        const form = TestBed.runInInjectionContext(() => service.createTaskForm(signal(service.createTaskFormModel(entity))));

        expect(
          form()
            .errorSummary()
            .map(error => error.kind),
        ).toEqual([]);
        expect(form().valid()).toBe(true);
      });

      it('should keep the id readonly', () => {
        const form = TestBed.runInInjectionContext(() => service.createTaskForm(signal(service.createTaskFormModel())));

        expect(form.id().readonly()).toBe(true);
      });
    });

    describe('getTask', () => {
      it('should return NewTask for default Task initial value', () => {
        const task = service.getTask(service.createTaskFormModel(sampleWithNewData));

        expect(task).toMatchObject(sampleWithNewData);
      });

      it('should return NewTask for empty Task initial value', () => {
        const task = service.getTask(service.createTaskFormModel());

        expect(task).toMatchObject({});
      });

      it('should return ITask', () => {
        const task = service.getTask(service.createTaskFormModel(sampleWithRequiredData));

        expect(task).toMatchObject(sampleWithRequiredData);
      });
    });
  });
});
