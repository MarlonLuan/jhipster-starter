import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { ITask } from '../task.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../task.test-samples';

import { TaskService } from './task.service';

const requireRestSample: ITask = {
  ...sampleWithRequiredData,
};

describe('Task Service', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;
  let expectedResult: ITask | ITask[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Task', () => {
      const task = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(task).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Task', () => {
      const task = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(task).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Task', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Task', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Task', () => {
      const expected = true;

      service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addTaskToCollectionIfMissing', () => {
      it('should add a Task to an empty array', () => {
        const task: ITask = sampleWithRequiredData;
        expectedResult = service.addTaskToCollectionIfMissing([], task);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(task);
      });

      it('should not add a Task to an array that contains it', () => {
        const task: ITask = sampleWithRequiredData;
        const taskCollection: ITask[] = [
          {
            ...task,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addTaskToCollectionIfMissing(taskCollection, task);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Task to an array that doesn't contain it", () => {
        const task: ITask = sampleWithRequiredData;
        const taskCollection: ITask[] = [sampleWithPartialData];
        expectedResult = service.addTaskToCollectionIfMissing(taskCollection, task);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(task);
      });

      it('should add only unique Task to an array', () => {
        const taskArray: ITask[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const taskCollection: ITask[] = [sampleWithRequiredData];
        expectedResult = service.addTaskToCollectionIfMissing(taskCollection, ...taskArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const task: ITask = sampleWithRequiredData;
        const task2: ITask = sampleWithPartialData;
        expectedResult = service.addTaskToCollectionIfMissing([], task, task2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(task);
        expect(expectedResult).toContain(task2);
      });

      it('should accept null and undefined values', () => {
        const task: ITask = sampleWithRequiredData;
        expectedResult = service.addTaskToCollectionIfMissing([], null, task, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(task);
      });

      it('should return initial array if no Task is added', () => {
        const taskCollection: ITask[] = [sampleWithRequiredData];
        expectedResult = service.addTaskToCollectionIfMissing(taskCollection, undefined, null);
        expect(expectedResult).toEqual(taskCollection);
      });
    });

    describe('compareTask', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareTask(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = null;

        const compareResult1 = service.compareTask(entity1, entity2);
        const compareResult2 = service.compareTask(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };

        const compareResult1 = service.compareTask(entity1, entity2);
        const compareResult2 = service.compareTask(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
        const entity2 = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

        const compareResult1 = service.compareTask(entity1, entity2);
        const compareResult2 = service.compareTask(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
