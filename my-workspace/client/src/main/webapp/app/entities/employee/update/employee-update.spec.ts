import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { submit } from '@angular/forms/signals';
import { ActivatedRoute } from '@angular/router';

import { provideTranslateService } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { IEmployee } from '../employee.model';
import { sampleWithRequiredData } from '../employee.test-samples';
import { EmployeeService } from '../service/employee.service';

import { EmployeeFormService } from './employee-form.service';
import { EmployeeUpdate } from './employee-update';

describe('Employee Management Update Component', () => {
  let comp: EmployeeUpdate;
  let fixture: ComponentFixture<EmployeeUpdate>;
  let activatedRoute: ActivatedRoute;
  let employeeFormService: EmployeeFormService;
  let employeeService: EmployeeService;
  let departmentService: DepartmentService;

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

    fixture = TestBed.createComponent(EmployeeUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    employeeFormService = TestBed.inject(EmployeeFormService);
    employeeService = TestBed.inject(EmployeeService);
    departmentService = TestBed.inject(DepartmentService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Employee query and add missing value', () => {
      const employee: IEmployee = { id: '17d5e87d-f0c0-4fac-b985-ff279089a9cd' };
      const manager: IEmployee = { id: '004a716c-7d58-420f-b029-f644967e1d69' };
      employee.manager = manager;

      const employeeCollection: IEmployee[] = [{ id: '004a716c-7d58-420f-b029-f644967e1d69' }];
      vi.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [manager];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      vi.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployees.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.employeesSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Department query and add missing value', () => {
      const employee: IEmployee = { id: '17d5e87d-f0c0-4fac-b985-ff279089a9cd' };
      const department: IDepartment = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
      employee.department = department;

      const departmentCollection: IDepartment[] = [{ id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' }];
      vi.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const additionalDepartments = [department];
      const expectedCollection: IDepartment[] = [...additionalDepartments, ...departmentCollection];
      vi.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(
        departmentCollection,
        ...additionalDepartments.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.departmentsSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const employee: IEmployee = { id: '17d5e87d-f0c0-4fac-b985-ff279089a9cd' };
      const manager: IEmployee = { id: '004a716c-7d58-420f-b029-f644967e1d69' };
      employee.manager = manager;
      const department: IDepartment = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
      employee.department = department;

      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      expect(comp.employeesSharedCollection()).toContainEqual(manager);
      expect(comp.departmentsSharedCollection()).toContainEqual(department);
      expect(comp.employee).toEqual(employee);
    });
  });

  describe('save', () => {
    it('should save a valid submitted form', async () => {
      // GIVEN
      vi.spyOn(comp, 'save').mockResolvedValue(undefined);
      activatedRoute.data = of({ employee: sampleWithRequiredData });
      comp.ngOnInit();

      // WHEN
      await submit(comp.editForm);

      // THEN
      expect(comp.save).toHaveBeenCalled();
    });

    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IEmployee>();
      const employee = { id: '004a716c-7d58-420f-b029-f644967e1d69' };
      vi.spyOn(employeeFormService, 'getEmployee').mockReturnValue(employee);
      vi.spyOn(employeeService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(employee);
      saveSubject.complete();

      // THEN
      expect(employeeFormService.getEmployee).toHaveBeenCalledWith(comp.employeeModel(), employee);
      expect(comp.previousState).toHaveBeenCalled();
      expect(employeeService.update).toHaveBeenCalledWith(expect.objectContaining(employee));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IEmployee>();
      const employee = { id: '004a716c-7d58-420f-b029-f644967e1d69' };
      vi.spyOn(employeeFormService, 'getEmployee').mockReturnValue({ id: null });
      vi.spyOn(employeeService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(employee);
      saveSubject.complete();

      // THEN
      expect(employeeFormService.getEmployee).toHaveBeenCalled();
      expect(employeeService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should resolve the submission when the service completes without a value', async () => {
      // GIVEN
      const saveSubject = new Subject<IEmployee>();
      vi.spyOn(employeeFormService, 'getEmployee').mockReturnValue({ id: null });
      vi.spyOn(employeeService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ employee: null });
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
      const saveSubject = new Subject<IEmployee>();
      const employee = { id: '004a716c-7d58-420f-b029-f644967e1d69' };
      vi.spyOn(employeeService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ employee });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(employeeService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });

    it('should mark the fields the server refused', async () => {
      // GIVEN
      const saveSubject = new Subject<IEmployee>();
      vi.spyOn(employeeFormService, 'getEmployee').mockReturnValue({ id: null });
      vi.spyOn(employeeService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ employee: null });
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
              { objectName: 'employee', field: 'firstName', message: 'is refused', code: 'Refused' },
              { objectName: 'employee', field: 'id', message: 'is refused', code: 'Refused' },
              { objectName: 'employee', field: 'notAField', message: 'is refused', code: 'Refused' },
            ],
          },
        }),
      );

      // THEN
      expect(await result).toEqual([
        expect.objectContaining({ kind: 'server', message: 'is refused', fieldTree: comp.editForm.firstName }),
      ]);
    });

    it('should mark no field for an error without field errors', async () => {
      // GIVEN
      const saveSubject = new Subject<IEmployee>();
      vi.spyOn(employeeFormService, 'getEmployee').mockReturnValue({ id: null });
      vi.spyOn(employeeService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ employee: null });
      comp.ngOnInit();

      // WHEN
      const result = comp.save();
      saveSubject.error(new HttpErrorResponse({ status: 500, error: null }));

      // THEN
      expect(await result).toBeUndefined();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEmployee', () => {
      it('should forward to employeeService', () => {
        const entity = { id: '004a716c-7d58-420f-b029-f644967e1d69' };
        const entity2 = { id: '17d5e87d-f0c0-4fac-b985-ff279089a9cd' };
        vi.spyOn(employeeService, 'compareEmployee');
        comp.compareEmployee(entity, entity2);
        expect(employeeService.compareEmployee).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDepartment', () => {
      it('should forward to departmentService', () => {
        const entity = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
        const entity2 = { id: 'c54b4791-0036-4b84-8040-f2c2b23e0727' };
        vi.spyOn(departmentService, 'compareDepartment');
        comp.compareDepartment(entity, entity2);
        expect(departmentService.compareDepartment).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
