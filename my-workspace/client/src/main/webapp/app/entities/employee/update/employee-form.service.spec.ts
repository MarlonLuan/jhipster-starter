import { beforeEach, describe, expect, it } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../employee.test-samples';

import { EmployeeFormService } from './employee-form.service';

describe('Employee Form Service', () => {
  let service: EmployeeFormService;

  beforeEach(() => {
    service = TestBed.inject(EmployeeFormService);
  });

  describe('Service methods', () => {
    describe('createEmployeeFormModel', () => {
      it('should create the model of a new entity', () => {
        const model = service.createEmployeeFormModel();

        expect(Object.keys(model)).toEqual(
          expect.arrayContaining([
            'id',
            'firstName',
            'lastName',
            'email',
            'phoneNumber',
            'hireDate',
            'salary',
            'commissionPct',
            'manager',
            'department',
          ]),
        );
      });

      it('passing IEmployee without dates should create a model with empty values', () => {
        const model = service.createEmployeeFormModel({
          ...sampleWithRequiredData,
          hireDate: null,
        });

        expect(model.hireDate).toBe('');
      });
    });

    describe('createEmployeeForm', () => {
      it('should create the form of the model', () => {
        const model = signal(service.createEmployeeFormModel(sampleWithRequiredData));

        const form = TestBed.runInInjectionContext(() => service.createEmployeeForm(model));

        expect(form().value()).toEqual(model());
      });

      it('should accept the values of an entity with its required data', () => {
        const entity = sampleWithRequiredData;
        const form = TestBed.runInInjectionContext(() => service.createEmployeeForm(signal(service.createEmployeeFormModel(entity))));

        expect(
          form()
            .errorSummary()
            .map(error => error.kind),
        ).toEqual([]);
        expect(form().valid()).toBe(true);
      });

      it('should keep the id readonly', () => {
        const form = TestBed.runInInjectionContext(() => service.createEmployeeForm(signal(service.createEmployeeFormModel())));

        expect(form.id().readonly()).toBe(true);
      });
    });

    describe('getEmployee', () => {
      it('should return NewEmployee for default Employee initial value', () => {
        const employee = service.getEmployee(service.createEmployeeFormModel(sampleWithNewData));

        expect(employee).toMatchObject(sampleWithNewData);
      });

      it('should return NewEmployee for empty Employee initial value', () => {
        const employee = service.getEmployee(service.createEmployeeFormModel());

        expect(employee).toMatchObject({});
      });

      it('should return IEmployee', () => {
        const employee = service.getEmployee(service.createEmployeeFormModel(sampleWithRequiredData));

        expect(employee).toMatchObject(sampleWithRequiredData);
      });
    });
  });
});
