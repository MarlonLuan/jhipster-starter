import { beforeEach, describe, expect, it } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../job.test-samples';

import { JobFormService } from './job-form.service';

describe('Job Form Service', () => {
  let service: JobFormService;

  beforeEach(() => {
    service = TestBed.inject(JobFormService);
  });

  describe('Service methods', () => {
    describe('createJobFormModel', () => {
      it('should create the model of a new entity', () => {
        const model = service.createJobFormModel();

        expect(Object.keys(model)).toEqual(expect.arrayContaining(['id', 'jobTitle', 'minSalary', 'maxSalary', 'tasks', 'employee']));
      });

      it('passing IJob without relationships should create a model with empty values', () => {
        const model = service.createJobFormModel({
          ...sampleWithRequiredData,
          tasks: null,
        });

        expect(model.tasks).toEqual([]);
      });
    });

    describe('createJobForm', () => {
      it('should create the form of the model', () => {
        const model = signal(service.createJobFormModel(sampleWithRequiredData));

        const form = TestBed.runInInjectionContext(() => service.createJobForm(model));

        expect(form().value()).toEqual(model());
      });

      it('should accept the values of an entity with its required data', () => {
        const entity = sampleWithRequiredData;
        const form = TestBed.runInInjectionContext(() => service.createJobForm(signal(service.createJobFormModel(entity))));

        expect(
          form()
            .errorSummary()
            .map(error => error.kind),
        ).toEqual([]);
        expect(form().valid()).toBe(true);
      });

      it('should keep the id readonly', () => {
        const form = TestBed.runInInjectionContext(() => service.createJobForm(signal(service.createJobFormModel())));

        expect(form.id().readonly()).toBe(true);
      });
    });

    describe('getJob', () => {
      it('should return NewJob for default Job initial value', () => {
        const job = service.getJob(service.createJobFormModel(sampleWithNewData));

        expect(job).toMatchObject(sampleWithNewData);
      });

      it('should return NewJob for empty Job initial value', () => {
        const job = service.getJob(service.createJobFormModel());

        expect(job).toMatchObject({});
      });

      it('should return IJob', () => {
        const job = service.getJob(service.createJobFormModel(sampleWithRequiredData));

        expect(job).toMatchObject(sampleWithRequiredData);
      });
    });
  });
});
