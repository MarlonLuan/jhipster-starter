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

      it('should leave the dates and times of a new entity empty', () => {
        const model = service.createEmployeeFormModel();

        expect(model.hireDate).toBe('');
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

      it('should keep the empty values of the edited entity', () => {
        const entity = {
          ...sampleWithRequiredData,
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
        };

        const employee = service.getEmployee(service.createEmployeeFormModel(entity), entity);

        expect(employee.firstName).toBe('');
        expect(employee.lastName).toBe('');
        expect(employee.email).toBe('');
        expect(employee.phoneNumber).toBe('');
      });

      it('should return the empty values of an entity without them', () => {
        const entity = {
          ...sampleWithRequiredData,
          firstName: null,
          lastName: null,
          email: null,
          phoneNumber: null,
        };

        const employee = service.getEmployee(service.createEmployeeFormModel(entity), entity);

        expect(employee.firstName).toBeNull();
        expect(employee.lastName).toBeNull();
        expect(employee.email).toBeNull();
        expect(employee.phoneNumber).toBeNull();
      });
    });
  });
});
