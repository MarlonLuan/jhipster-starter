import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IDepartment, Department } from '../department.model';

import { DepartmentService } from './department.service';

describe('Service Tests', () => {
  describe('Department Service', () => {
    let service: DepartmentService;
    let httpMock: HttpTestingController;
    let elemDefault: IDepartment;
    let expectedResult: IDepartment | IDepartment[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(DepartmentService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        departmentName: 'AAAAAAA',
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign({}, elemDefault);

        service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a Department', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Department()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Department', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            departmentName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Department', () => {
        const patchObject = Object.assign({}, new Department());

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Department', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            departmentName: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a Department', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addDepartmentToCollectionIfMissing', () => {
        it('should add a Department to an empty array', () => {
          const department: IDepartment = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addDepartmentToCollectionIfMissing([], department);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(department);
        });

        it('should not add a Department to an array that contains it', () => {
          const department: IDepartment = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const departmentCollection: IDepartment[] = [
            {
              ...department,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addDepartmentToCollectionIfMissing(departmentCollection, department);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Department to an array that doesn't contain it", () => {
          const department: IDepartment = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const departmentCollection: IDepartment[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addDepartmentToCollectionIfMissing(departmentCollection, department);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(department);
        });

        it('should add only unique Department to an array', () => {
          const departmentArray: IDepartment[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: '3f7bcbbb-d406-4985-8056-d34c452ae031' },
          ];
          const departmentCollection: IDepartment[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addDepartmentToCollectionIfMissing(departmentCollection, ...departmentArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const department: IDepartment = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const department2: IDepartment = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addDepartmentToCollectionIfMissing([], department, department2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(department);
          expect(expectedResult).toContain(department2);
        });

        it('should accept null and undefined values', () => {
          const department: IDepartment = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addDepartmentToCollectionIfMissing([], null, department, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(department);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
