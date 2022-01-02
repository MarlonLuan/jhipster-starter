import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { JobHistoryService } from '../service/job-history.service';
import { IJobHistory, JobHistory } from '../job-history.model';
import { IJob } from 'app/entities/job/job.model';
import { JobService } from 'app/entities/job/service/job.service';
import { IDepartment } from 'app/entities/department/department.model';
import { DepartmentService } from 'app/entities/department/service/department.service';
import { IEmployee } from 'app/entities/employee/employee.model';
import { EmployeeService } from 'app/entities/employee/service/employee.service';

import { JobHistoryUpdateComponent } from './job-history-update.component';

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
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [JobHistoryUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
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
      const job: IJob = { id: '6cfbfe91-3f81-414a-aff8-e953d43c06dc' };
      jobHistory.job = job;

      const jobCollection: IJob[] = [{ id: '85dfa6f0-10bb-4738-aebb-e4fe837d158a' }];
      jest.spyOn(jobService, 'query').mockReturnValue(of(new HttpResponse({ body: jobCollection })));
      const expectedCollection: IJob[] = [job, ...jobCollection];
      jest.spyOn(jobService, 'addJobToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(jobService.query).toHaveBeenCalled();
      expect(jobService.addJobToCollectionIfMissing).toHaveBeenCalledWith(jobCollection, job);
      expect(comp.jobsCollection).toEqual(expectedCollection);
    });

    it('Should call department query and add missing value', () => {
      const jobHistory: IJobHistory = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const department: IDepartment = { id: '126ff2e2-c8a8-4df6-b63c-0948695a7b20' };
      jobHistory.department = department;

      const departmentCollection: IDepartment[] = [{ id: '65e6a084-2348-43b5-b4df-4629043f55ae' }];
      jest.spyOn(departmentService, 'query').mockReturnValue(of(new HttpResponse({ body: departmentCollection })));
      const expectedCollection: IDepartment[] = [department, ...departmentCollection];
      jest.spyOn(departmentService, 'addDepartmentToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(departmentService.query).toHaveBeenCalled();
      expect(departmentService.addDepartmentToCollectionIfMissing).toHaveBeenCalledWith(departmentCollection, department);
      expect(comp.departmentsCollection).toEqual(expectedCollection);
    });

    it('Should call employee query and add missing value', () => {
      const jobHistory: IJobHistory = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const employee: IEmployee = { id: 'fee2d000-df73-4566-85b7-94b2159aa534' };
      jobHistory.employee = employee;

      const employeeCollection: IEmployee[] = [{ id: 'dffaa473-32f6-4a0e-91b6-96cc8cea597a' }];
      jest.spyOn(employeeService, 'query').mockReturnValue(of(new HttpResponse({ body: employeeCollection })));
      const expectedCollection: IEmployee[] = [employee, ...employeeCollection];
      jest.spyOn(employeeService, 'addEmployeeToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ jobHistory });
      comp.ngOnInit();

      expect(employeeService.query).toHaveBeenCalled();
      expect(employeeService.addEmployeeToCollectionIfMissing).toHaveBeenCalledWith(employeeCollection, employee);
      expect(comp.employeesCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const jobHistory: IJobHistory = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
      const job: IJob = { id: 'ac0c32f9-abbf-402f-b3e4-a608907d90b3' };
      jobHistory.job = job;
      const department: IDepartment = { id: '5523a808-d95c-4dce-b48f-5599f31602cb' };
      jobHistory.department = department;
      const employee: IEmployee = { id: 'a91f3692-9ba1-41f9-bf2b-26fb24694e5e' };
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
      const saveSubject = new Subject<HttpResponse<JobHistory>>();
      const jobHistory = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(jobHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
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
      const saveSubject = new Subject<HttpResponse<JobHistory>>();
      const jobHistory = new JobHistory();
      jest.spyOn(jobHistoryService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
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
      const saveSubject = new Subject<HttpResponse<JobHistory>>();
      const jobHistory = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
      jest.spyOn(jobHistoryService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
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
