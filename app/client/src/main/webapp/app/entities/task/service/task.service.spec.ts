import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ITask, Task } from '../task.model';

import { TaskService } from './task.service';

describe('Service Tests', () => {
  describe('Task Service', () => {
    let service: TaskService;
    let httpMock: HttpTestingController;
    let elemDefault: ITask;
    let expectedResult: ITask | ITask[] | boolean | null;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(TaskService);
      httpMock = TestBed.inject(HttpTestingController);

      elemDefault = {
        id: 'AAAAAAA',
        title: 'AAAAAAA',
        description: 'AAAAAAA',
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

      it('should create a Task', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.create(new Task()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a Task', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            title: 'BBBBBB',
            description: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign({}, returnedFromService);

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a Task', () => {
        const patchObject = Object.assign(
          {
            title: 'BBBBBB',
            description: 'BBBBBB',
          },
          new Task()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign({}, returnedFromService);

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of Task', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            title: 'BBBBBB',
            description: 'BBBBBB',
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

      it('should delete a Task', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addTaskToCollectionIfMissing', () => {
        it('should add a Task to an empty array', () => {
          const task: ITask = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addTaskToCollectionIfMissing([], task);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(task);
        });

        it('should not add a Task to an array that contains it', () => {
          const task: ITask = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const taskCollection: ITask[] = [
            {
              ...task,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addTaskToCollectionIfMissing(taskCollection, task);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a Task to an array that doesn't contain it", () => {
          const task: ITask = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const taskCollection: ITask[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addTaskToCollectionIfMissing(taskCollection, task);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(task);
        });

        it('should add only unique Task to an array', () => {
          const taskArray: ITask[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: '5a8135f7-faa2-449e-a920-6f0a0a5429c4' },
          ];
          const taskCollection: ITask[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addTaskToCollectionIfMissing(taskCollection, ...taskArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const task: ITask = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const task2: ITask = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addTaskToCollectionIfMissing([], task, task2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(task);
          expect(expectedResult).toContain(task2);
        });

        it('should accept null and undefined values', () => {
          const task: ITask = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addTaskToCollectionIfMissing([], null, task, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(task);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
