import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { Subject, from, of } from 'rxjs';

import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';
import { IJob } from 'app/entities/job/job.model';
import { JobService } from 'app/entities/job/service/job.service';
import { IJobHistory } from '../job-history.model';
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
      imports: [TranslateModule.forRoot()],
      providers: [
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
    it('should call job query and add missing value', () => {
      const jobHistory: IJobHistory = { id: '77b493ed-9aef-4d01-8fd4-f257729b9d4d' };
      const job: IJob = { id: 'fe5fddd6-1eb2-44f0-b155-6defcd44ea6c' };
      jobHistory.job = job;

      const jobCollection: IJob[] = [{ id: 'fe5fddd6-1eb2-44f0-b155-6defcd44ea6c' }];
      vitest.spyOn(jobService, 'query').mockReturnValue(of(new HttpResponse({ body: jobCollection })));
      const expectedCollection: IJob[] = [job, ...jobCollection];
      vitest.spyOn(jobService, 'addJobToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(jobService.query).toHaveBeenCalled();
      expect(jobService.addJobToCollectionIfMissing).toHaveBeenCalledWith(jobCollection, job);
      expect(comp.jobsCollection()).toEqual(expectedCollection);
    });

    it('should call department query and add missing value', () => {
      const jobHistory: IJobHistory = { id: '77b493ed-9aef-4d01-8fd4-f257729b9d4d' };
      const department: IDepartment = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
      jobHistory.department = department;

      const departmentCollection: IDepartment[] = [{ id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' }];
      vitest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const expectedCollection: IDepartment[] = [department, ...departmentCollection];
      vitest.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(departmentCollection, department);
      expect(comp.departmentsCollection()).toEqual(expectedCollection);
    });

    it('should call employee query and add missing value', () => {
      const jobHistory: IJobHistory = { id: '77b493ed-9aef-4d01-8fd4-f257729b9d4d' };
      const employee: IEmployee = { id: '004a716c-7d58-420f-b029-f644967e1d69' };
      jobHistory.employee = employee;

      const employeeCollection: IEmployee[] = [{ id: '004a716c-7d58-420f-b029-f644967e1d69' }];
      vitest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const expectedCollection: IEmployee[] = [employee, ...employeeCollection];
      vitest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, employee);
      expect(comp.employeesCollection()).toEqual(expectedCollection);
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

      expect(comp.jobsCollection()).toContainEqual(job);
      expect(comp.departmentsCollection()).toContainEqual(department);
      expect(comp.employeesCollection()).toContainEqual(employee);
      expect(comp.jobHistory).toEqual(jobHistory);
    });
  });

  describe('save', () => {
    it('should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobHistory>>();
      const jobHistory = { id: '9da078bb-af84-4931-a283-fb9e5a42b6fd' };
      vitest.spyOn(jobHistoryFormService, 'getJobHistory').mockReturnValue(jobHistory);
      vitest.spyOn(jobHistoryService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobHistory }));
      saveSubject.complete();

      // THEN
      expect(jobHistoryFormService.getJobHistory).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(jobHistoryService.update).toHaveBeenCalledWith(expect.objectContaining(jobHistory));
      expect(comp.isSaving()).toEqual(false);
    });

    it('should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobHistory>>();
      const jobHistory = { id: '9da078bb-af84-4931-a283-fb9e5a42b6fd' };
      vitest.spyOn(jobHistoryFormService, 'getJobHistory').mockReturnValue({ id: null });
      vitest.spyOn(jobHistoryService, 'create').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ jobHistory: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving()).toEqual(true);
      saveSubject.next(new HttpResponse({ body: jobHistory }));
      saveSubject.complete();

      // THEN
      expect(jobHistoryFormService.getJobHistory).toHaveBeenCalled();
      expect(jobHistoryService.create).toHaveBeenCalled();
      expect(comp.isSaving()).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IJobHistory>>();
      const jobHistory = { id: '9da078bb-af84-4931-a283-fb9e5a42b6fd' };
      vitest.spyOn(jobHistoryService, 'update').mockReturnValue(saveSubject);
      vitest.spyOn(comp, 'previousState');
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
  });

  describe('Compare relationships', () => {
    describe('compareJob', () => {
      it('should forward to jobService', () => {
        const entity = { id: 'fe5fddd6-1eb2-44f0-b155-6defcd44ea6c' };
        const entity2 = { id: 'ee3221b5-0074-405f-9c0c-4e29fb63663c' };
        vitest.spyOn(jobService, 'compareJob');
        comp.compareJob(entity, entity2);
        expect(jobService.compareJob).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareDepartment', () => {
      it('should forward to departmentService', () => {
        const entity = { id: 'e72f1487-bf87-4c47-8e97-2cce52db762d' };
        const entity2 = { id: 'c54b4791-0036-4b84-8040-f2c2b23e0727' };
        vitest.spyOn(departmentService, 'compareDepartment');
        comp.compareDepartment(entity, entity2);
        expect(departmentService.compareDepartment).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareEmployee', () => {
      it('should forward to employeeService', () => {
        const entity = { id: '004a716c-7d58-420f-b029-f644967e1d69' };
        const entity2 = { id: '17d5e87d-f0c0-4fac-b985-ff279089a9cd' };
        vitest.spyOn(employeeService, 'compareEmployee');
        comp.compareEmployee(entity, entity2);
        expect(employeeService.compareEmployee).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
