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
        const job: IJob = { id: 'c7d55088-7353-46dd-8065-b733ae783115' };
        jobHistory.job = job;

        const jobCollection: IJob[] = [{ id: '17ac7b43-789d-45cb-a226-48eb8fb8ae81' }];
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
        const department: IDepartment = { id: '98992832-5841-4f9a-9c54-a9f0a0bbdb7d' };
        jobHistory.department = department;

        const departmentCollection: IDepartment[] = [{ id: '1ec762da-62fb-4341-a5d3-52bfa88640a1' }];
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
        const employee: IEmployee = { id: '71e2bebe-da35-4ed0-9e50-6aebba0c0001' };
        jobHistory.employee = employee;

        const employeeCollection: IEmployee[] = [{ id: 'e028426b-d156-4ac5-b402-ec8bef630d31' }];
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
        const job: IJob = { id: 'b951147f-8cf3-414e-b032-21e8fbe64434' };
        jobHistory.job = job;
        const department: IDepartment = { id: 'd0398461-c5b3-44a9-b20b-2a10b4862a86' };
        jobHistory.department = department;
        const employee: IEmployee = { id: '301695a4-40fe-4ffb-82ce-8d091d21c412' };
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
