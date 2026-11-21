import { beforeEach, describe, expect, it } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../job-history.test-samples';

import { JobHistoryFormService } from './job-history-form.service';

describe('JobHistory Form Service', () => {
  let service: JobHistoryFormService;

  beforeEach(() => {
    service = TestBed.inject(JobHistoryFormService);
  });

  describe('Service methods', () => {
    describe('createJobHistoryFormModel', () => {
      it('should create the model of a new entity', () => {
        const model = service.createJobHistoryFormModel();

        expect(Object.keys(model)).toEqual(
          expect.arrayContaining(['id', 'startDate', 'endDate', 'language', 'job', 'department', 'employee']),
        );
      });

      it('passing IJobHistory without dates should create a model with empty values', () => {
        const model = service.createJobHistoryFormModel({
          ...sampleWithRequiredData,
          startDate: null,
          endDate: null,
        });

        expect(model.startDate).toBe('');
        expect(model.endDate).toBe('');
      });
    });

    describe('createJobHistoryForm', () => {
      it('should create the form of the model', () => {
        const model = signal(service.createJobHistoryFormModel(sampleWithRequiredData));

        const form = TestBed.runInInjectionContext(() => service.createJobHistoryForm(model));

        expect(form().value()).toEqual(model());
      });

      it('should accept the values of an entity with its required data', () => {
        const entity = sampleWithRequiredData;
        const form = TestBed.runInInjectionContext(() => service.createJobHistoryForm(signal(service.createJobHistoryFormModel(entity))));

        expect(
          form()
            .errorSummary()
            .map(error => error.kind),
        ).toEqual([]);
        expect(form().valid()).toBe(true);
      });

      it('should keep the id readonly', () => {
        const form = TestBed.runInInjectionContext(() => service.createJobHistoryForm(signal(service.createJobHistoryFormModel())));

        expect(form.id().readonly()).toBe(true);
      });
    });

    describe('getJobHistory', () => {
      it('should return NewJobHistory for default JobHistory initial value', () => {
        const jobHistory = service.getJobHistory(service.createJobHistoryFormModel(sampleWithNewData));

        expect(jobHistory).toMatchObject(sampleWithNewData);
      });

      it('should return NewJobHistory for empty JobHistory initial value', () => {
        const jobHistory = service.getJobHistory(service.createJobHistoryFormModel());

        expect(jobHistory).toMatchObject({});
      });

      it('should return IJobHistory', () => {
        const jobHistory = service.getJobHistory(service.createJobHistoryFormModel(sampleWithRequiredData));

        expect(jobHistory).toMatchObject(sampleWithRequiredData);
      });
    });
  });
});
