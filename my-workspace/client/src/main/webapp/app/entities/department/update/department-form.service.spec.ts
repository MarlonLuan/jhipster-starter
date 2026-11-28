import { beforeEach, describe, expect, it } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../department.test-samples';

import { DepartmentFormService } from './department-form.service';

describe('Department Form Service', () => {
  let service: DepartmentFormService;

  beforeEach(() => {
    service = TestBed.inject(DepartmentFormService);
  });

  describe('Service methods', () => {
    describe('createDepartmentFormModel', () => {
      it('should create the model of a new entity', () => {
        const model = service.createDepartmentFormModel();

        expect(Object.keys(model)).toEqual(expect.arrayContaining(['id', 'departmentName', 'location']));
      });
    });

    describe('createDepartmentForm', () => {
      it('should create the form of the model', () => {
        const model = signal(service.createDepartmentFormModel(sampleWithRequiredData));

        const form = TestBed.runInInjectionContext(() => service.createDepartmentForm(model));

        expect(form().value()).toEqual(model());
      });

      it('should accept the values of an entity with its required data', () => {
        const entity = sampleWithRequiredData;
        const form = TestBed.runInInjectionContext(() => service.createDepartmentForm(signal(service.createDepartmentFormModel(entity))));

        expect(
          form()
            .errorSummary()
            .map(error => error.kind),
        ).toEqual([]);
        expect(form().valid()).toBe(true);
      });

      it('should keep the id readonly', () => {
        const form = TestBed.runInInjectionContext(() => service.createDepartmentForm(signal(service.createDepartmentFormModel())));

        expect(form.id().readonly()).toBe(true);
      });
    });

    describe('getDepartment', () => {
      it('should return NewDepartment for default Department initial value', () => {
        const department = service.getDepartment(service.createDepartmentFormModel(sampleWithNewData));

        expect(department).toMatchObject(sampleWithNewData);
      });

      it('should return NewDepartment for empty Department initial value', () => {
        const department = service.getDepartment(service.createDepartmentFormModel());

        expect(department).toMatchObject({});
      });

      it('should return IDepartment', () => {
        const department = service.getDepartment(service.createDepartmentFormModel(sampleWithRequiredData));

        expect(department).toMatchObject(sampleWithRequiredData);
      });
    });
  });
});
