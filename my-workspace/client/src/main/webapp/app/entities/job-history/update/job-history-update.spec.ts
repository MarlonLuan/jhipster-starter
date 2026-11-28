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
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IJob } from 'app/entities/job/job.model';
import { JobService } from 'app/entities/job/service/job.service';
import { IJobHistory } from '../job-history.model';
import { sampleWithRequiredData } from '../job-history.test-samples';
import { JobHistoryService } from '../service/job-history.service';

import { JobHistoryFormService } from './job-history-form.service';
import { JobHistoryUpdate } from './job-history-update';

describe('JobHistory Management Update Component', () => {
  let comp: JobHistoryUpdate;
  let fixture: ComponentFixture<JobHistoryUpdate>;
  let activatedRoute: ActivatedRoute;
  let jobHistoryFormService: JobHistoryFormService;
  let jobHistoryService: JobHistoryService;
  let jobService: JobService;
  let departmentService: DepartmentService;
  let employeeService: EmployeeService;

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

    fixture = TestBed.createComponent(JobHistoryUpdate);
    activatedRoute = TestBed.inject(ActivatedRoute);
    jobHistoryFormService = TestBed.inject(JobHistoryFormService);
    jobHistoryService = TestBed.inject(JobHistoryService);
    jobService = TestBed.inject(JobService);
    departmentService = TestBed.inject(DepartmentService);
    employeeService = TestBed.inject(EmployeeService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('should call Job query and add missing value', () => {
      const jobHistory: IJobHistory = { id: '77b493ed-9aef-4d01-8fd4-f257729b9d4d' };
      const job: IJob = { id: 'fe5fddd6-1eb2-44f0-b155-6defcd44ea6c' };
      jobHistory.job = job;

      const jobCollection: IJob[] = [{ id: 'fe5fddd6-1eb2-44f0-b155-6defcd44ea6c' }];
      vi.spyOn(jobService, 'query').mockReturnValue(of(new HttpResponse({ body: jobCollection })));
      const additionalJobs = [job];
      const expectedCollection: IJob[] = [...additionalJobs, ...jobCollection];
      vi.spyOn(jobService, 'addJobToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(jobService.query).toHaveBeenCalled();
      expect(jobService.addJobToCollectionIfMissing).toHaveBeenCalledWith(
        jobCollection,
        ...additionalJobs.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.jobsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Department query and add missing value', () => {
      const jobHistory: IJobHistory = { id: '77b493ed-9aef-4d01-8fd4-f257729b9d4d' };
      const department: IDepartment = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
      jobHistory.department = department;

      const departmentCollection: IDepartment[] = [{ id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' }];
      vi.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const additionalDepartments = [department];
      const expectedCollection: IDepartment[] = [...additionalDepartments, ...departmentCollection];
      vi.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(
        departmentCollection,
        ...additionalDepartments.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.departmentsSharedCollection()).toEqual(expectedCollection);
    });

    it('should call Employee query and add missing value', () => {
      const jobHistory: IJobHistory = { id: '77b493ed-9aef-4d01-8fd4-f257729b9d4d' };
      const employee: IEmployee = { id: '004a716c-7d58-420f-b029-f644967e1d69' };
      jobHistory.employee = employee;

      const employeeCollection: IEmployee[] = [{ id: '004a716c-7d58-420f-b029-f644967e1d69' }];
      vi.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const additionalEmployees = [employee];
      const expectedCollection: IEmployee[] = [...additionalEmployees, ...employeeCollection];
      vi.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(
        employeeCollection,
        ...additionalEmployees.map(i => expect.objectContaining(i) as typeof i),
      );
      expect(comp.employeesSharedCollection()).toEqual(expectedCollection);
    });

    it('should update editForm', () => {
      const jobHistory: IJobHistory = { id: '77b493ed-9aef-4d01-8fd4-f257729b9d4d' };
      const job: IJob = { id: 'fe5fddd6-1eb2-44f0-b155-6defcd44ea6c' };
      jobHistory.job = job;
      const department: IDepartment = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
      jobHistory.department = department;
      const employee: IEmployee = { id: '004a716c-7d58-420f-b029-f644967e1d69' };
      jobHistory.employee = employee;

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(comp.jobsSharedCollection()).toContainEqual(job);
      expect(comp.departmentsSharedCollection()).toContainEqual(department);
      expect(comp.employeesSharedCollection()).toContainEqual(employee);
      expect(comp.jobHistory).toEqual(jobHistory);
    });
  });

  describe('save', () => {
    it('should save a valid submitted form', async () => {
      // GIVEN
      vi.spyOn(comp, 'save').mockResolvedValue(undefined);
      activatedRoute.data = of({ jobHistory: sampleWithRequiredData });
      comp.ngOnInit();

      // WHEN
      await submit(comp.editForm);

      // THEN
      expect(comp.save).toHaveBeenCalled();
    });

    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<IJobHistory>();
      const jobHistory = { id: '9da078bb-af84-4931-a283-fb9e5a42b6fd' };
      vi.spyOn(jobHistoryFormService, 'getJobHistory').mockReturnValue(jobHistory);
      vi.spyOn(jobHistoryService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(jobHistory);
      saveSubject.complete();

      // THEN
      expect(jobHistoryFormService.getJobHistory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobHistoryService.update).toHaveBeenCalledWith(expect.objectContaining(jobHistory));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<IJobHistory>();
      const jobHistory = { id: '9da078bb-af84-4931-a283-fb9e5a42b6fd' };
      vi.spyOn(jobHistoryFormService, 'getJobHistory').mockReturnValue({ id: null });
      vi.spyOn(jobHistoryService, 'create').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobHistory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(jobHistory);
      saveSubject.complete();

      // THEN
      expect(jobHistoryFormService.getJobHistory).toHaveBeenCalled();
      expect(jobHistoryService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should resolve the submission when the service completes without a value', async () => {
      // GIVEN
      const saveSubject = new Subject<IJobHistory>();
      vi.spyOn(jobHistoryFormService, 'getJobHistory').mockReturnValue({ id: null });
      vi.spyOn(jobHistoryService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ jobHistory: null });
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
      const saveSubject = new Subject<IJobHistory>();
      const jobHistory = { id: '9da078bb-af84-4931-a283-fb9e5a42b6fd' };
      vi.spyOn(jobHistoryService, 'update').mockReturnValue(saveSubject);
      vi.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(jobHistoryService.update).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });

    it('should mark the fields the server refused', async () => {
      // GIVEN
      const saveSubject = new Subject<IJobHistory>();
      vi.spyOn(jobHistoryFormService, 'getJobHistory').mockReturnValue({ id: null });
      vi.spyOn(jobHistoryService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ jobHistory: null });
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
              { objectName: 'jobHistory', field: 'startDate', message: 'is refused', code: 'Refused' },
              { objectName: 'jobHistory', field: 'id', message: 'is refused', code: 'Refused' },
              { objectName: 'jobHistory', field: 'notAField', message: 'is refused', code: 'Refused' },
            ],
          },
        }),
      );

      // THEN
      expect(await result).toEqual([
        expect.objectContaining({ kind: 'server', message: 'is refused', fieldTree: comp.editForm.startDate }),
      ]);
    });

    it('should mark no field for an error without field errors', async () => {
      // GIVEN
      const saveSubject = new Subject<IJobHistory>();
      vi.spyOn(jobHistoryFormService, 'getJobHistory').mockReturnValue({ id: null });
      vi.spyOn(jobHistoryService, 'create').mockReturnValue(saveSubject);
      activatedRoute.data = of({ jobHistory: null });
      comp.ngOnInit();

      // WHEN
      const result = comp.save();
      saveSubject.error(new HttpErrorResponse({ status: 500, error: null }));

      // THEN
      expect(await result).toBeUndefined();
    });
  });

  describe('Compare relationships', () => {
    describe('compareJob', () => {
      it('should forward to jobService', () => {
        const entity = { id: 'fe5fddd6-1eb2-44f0-b155-6defcd44ea6c' };
        const entity2 = { id: 'ee3221b5-0074-405f-9c0c-4e29fb63663c' };
        vi.spyOn(jobService, 'compareJob');
        comp.compareJob(entity, entity2);
        expect(jobService.compareJob).toHaveBeenCalledWith(entity, entity2);
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

    describe('compareEmployee', () => {
      it('should forward to employeeService', () => {
        const entity = { id: '004a716c-7d58-420f-b029-f644967e1d69' };
        const entity2 = { id: '17d5e87d-f0c0-4fac-b985-ff279089a9cd' };
        vi.spyOn(employeeService, 'compareEmployee');
        comp.compareEmployee(entity, entity2);
        expect(employeeService.compareEmployee).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
