jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { JobHistoryService } from '../service/job-history.service';
import { IJobHistory, JobHistory } from '../job-history.model';
import { IJob } from 'app/entities/job/job.model';
import { JobService } from 'app/entities/job/service/job.service';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

import { JobHistoryUpdateComponent } from './job-history-update.component';

describe('Component Tests', () => {
  describe('JobHistory Management Update Component', () => {
    let comp: JobHistoryUpdateComponent;
    let fixture: ComponentFixture<JobHistoryUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let jobHistoryService: JobHistoryService;
    let jobService: JobService;
    let departmentService: DepartmentService;
    let employeeService: EmployeeService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [JobHistoryUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(JobHistoryUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(JobHistoryUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      jobHistoryService = TestBed.inject(JobHistoryService);
      jobService = TestBed.inject(JobService);
      departmentService = TestBed.inject(DepartmentService);
      employeeService = TestBed.inject(EmployeeService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call job query and add missing value', () => {
        const jobHistory: IJobHistory = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const job: IJob = { id: '10805925-7b19-4c57-961d-b1c8b30ff3ce' };
        jobHistory.job = job;

        const jobCollection: IJob[] = [{ id: 'b3e9c2eb-b12d-4250-a3fe-6b5037238f9e' }];
        spyOn(jobService, 'query').and.returnValue(of(new HttpResponse({ body: jobCollection })));
        const expectedCollection: IJob[] = [job, ...jobCollection];
        spyOn(jobService, 'addJobToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        expect(jobService.query).toHaveBeenCalled();
        expect(jobService.addJobToCollectionIfMissing).toHaveBeenCalledWith(jobCollection, job);
        expect(comp.jobsCollection).toEqual(expectedCollection);
      });

      it('Should call department query and add missing value', () => {
        const jobHistory: IJobHistory = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const department: IDepartment = { id: '8caf7be7-70eb-4a8f-b629-8116d359efc6' };
        jobHistory.department = department;

        const departmentCollection: IDepartment[] = [{ id: '7813f0c9-0527-4392-927c-8f4c146c993f' }];
        spyOn(departmentService, 'query').and.returnValue(of(new HttpResponse({ body: departmentCollection })));
        const expectedCollection: IDepartment[] = [department, ...departmentCollection];
        spyOn(departmentService, 'addDepartmentToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        expect(departmentService.query).toHaveBeenCalled();
        expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(departmentCollection, department);
        expect(comp.departmentsCollection).toEqual(expectedCollection);
      });

      it('Should call employee query and add missing value', () => {
        const jobHistory: IJobHistory = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const employee: IEmployee = { id: '9cb6a4f2-0faf-4437-99fe-aacd97bd7ef7' };
        jobHistory.employee = employee;

        const employeeCollection: IEmployee[] = [{ id: 'e4b9f3e1-e9ff-48cc-9f91-84072db39aa0' }];
        spyOn(employeeService, 'query').and.returnValue(of(new HttpResponse({ body: employeeCollection })));
        const expectedCollection: IEmployee[] = [employee, ...employeeCollection];
        spyOn(employeeService, 'addEmployeeToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        expect(employeeService.query).toHaveBeenCalled();
        expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, employee);
        expect(comp.employeesCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const jobHistory: IJobHistory = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
        const job: IJob = { id: '37f12a2f-461f-4b74-abaf-f48ec77c4d1d' };
        jobHistory.job = job;
        const department: IDepartment = { id: '92c8d4fc-84dd-4b16-ad59-b21ebfeeda76' };
        jobHistory.department = department;
        const employee: IEmployee = { id: 'b6666d0f-3b3c-46a0-ac4f-3afa4fe59c9b' };
        jobHistory.employee = employee;

        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(jobHistory));
        expect(comp.jobsCollection).toContain(job);
        expect(comp.departmentsCollection).toContain(department);
        expect(comp.employeesCollection).toContain(employee);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobHistory = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(jobHistoryService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jobHistory }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(jobHistoryService.update).toHaveBeenCalledWith(jobHistory);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobHistory = new JobHistory();
        spyOn(jobHistoryService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: jobHistory }));
        saveSubject.complete();

        // THEN
        expect(jobHistoryService.create).toHaveBeenCalledWith(jobHistory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const jobHistory = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        spyOn(jobHistoryService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ jobHistory });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(jobHistoryService.update).toHaveBeenCalledWith(jobHistory);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackJobById', () => {
        it('Should return tracked Job primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackJobById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackDepartmentById', () => {
        it('Should return tracked Department primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackDepartmentById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackEmployeeById', () => {
        it('Should return tracked Employee primary key', () => {
          const entity = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const trackResult = comp.trackEmployeeById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
