import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IEmployee, Employee } from '../employee.model';

import { EmployeeService } from './employee.service';

describe('Service Tests', () => {
  describe('Employee Service', () => {
    let service: EmployeeService;
    let httpMock: HttpTestingController;
    let elemDefault: IEmployee;
    let expectedResult: IEmployee | IEmployee[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(EmployeeService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        firstName: 'AAAAAAA',
        lastName: 'AAAAAAA',
        email: 'AAAAAAA',
        phoneNumber: 'AAAAAAA',
        hireDate: currentDate,
        salary: 0,
        commissionPct: 0,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            hireDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Employee', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            hireDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            hireDate: currentDate,
          },
          returnedFromService
        );

        service.create(new Employee()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Employee', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            email: 'BBBBBB',
            phoneNumber: 'BBBBBB',
            hireDate: currentDate.format(DATE_TIME_FORMAT),
            salary: 1,
            commissionPct: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            hireDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Employee', () => {
        const patchObject = Object.assign(
          {
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            email: 'BBBBBB',
            phoneNumber: 'BBBBBB',
            salary: 1,
          },
          new Employee()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            hireDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Employee', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            firstName: 'BBBBBB',
            lastName: 'BBBBBB',
            email: 'BBBBBB',
            phoneNumber: 'BBBBBB',
            hireDate: currentDate.format(DATE_TIME_FORMAT),
            salary: 1,
            commissionPct: 1,
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            hireDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Employee', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addEmployeeToCollectionIfMissing', () => {
        it('should add a Employee to an empty array', () => {
          const employee: IEmployee = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addEmployeeToCollectionIfMissing([], employee);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(employee);
        });

        it('should not add a Employee to an array that contains it', () => {
          const employee: IEmployee = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const employeeCollection: IEmployee[] = [
            {
              ...employee,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addEmployeeToCollectionIfMissing(employeeCollection, employee);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Employee to an array that doesn't contain it", () => {
          const employee: IEmployee = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const employeeCollection: IEmployee[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addEmployeeToCollectionIfMissing(employeeCollection, employee);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(employee);
        });

        it('should add only unique Employee to an array', () => {
          const employeeArray: IEmployee[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: 'c96b4a52-4b72-4a18-9512-a691c3fd1049' },
          ];
          const employeeCollection: IEmployee[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addEmployeeToCollectionIfMissing(employeeCollection, ...employeeArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const employee: IEmployee = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const employee2: IEmployee = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addEmployeeToCollectionIfMissing([], employee, employee2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(employee);
          expect(expectedResult).toContain(employee2);
        });

        it('should accept null and undefined values', () => {
          const employee: IEmployee = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addEmployeeToCollectionIfMissing([], null, employee, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(employee);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
