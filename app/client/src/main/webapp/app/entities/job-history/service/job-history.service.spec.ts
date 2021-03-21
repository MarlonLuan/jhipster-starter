import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import * as dayjs from 'dayjs';

import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { Language } from 'app/entities/enumerations/language.model';
import { IJobHistory, JobHistory } from '../job-history.model';

import { JobHistoryService } from './job-history.service';

describe('Service Tests', () => {
  describe('JobHistory Service', () => {
    let service: JobHistoryService;
    let httpMock: HttpTestingController;
    let elemDefault: IJobHistory;
    let expectedResult: IJobHistory | IJobHistory[] | boolean | null;
    let currentDate: dayjs.Dayjs;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
      expectedResult = null;
      service = TestBed.inject(JobHistoryService);
      httpMock = TestBed.inject(HttpTestingController);
      currentDate = dayjs();

      elemDefault = {
        id: 'AAAAAAA',
        startDate: currentDate,
        endDate: currentDate,
        language: Language.FRENCH,
      };
    });

    describe('Service methods', () => {
      it('should find an element', () => {
        const returnedFromService = Object.assign(
          {
            startDate: currentDate.format(DATE_TIME_FORMAT),
            endDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        service.find('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(elemDefault);
      });

      it('should create a JobHistory', () => {
        const returnedFromService = Object.assign(
          {
            id: 'ID',
            startDate: currentDate.format(DATE_TIME_FORMAT),
            endDate: currentDate.format(DATE_TIME_FORMAT),
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.create(new JobHistory()).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'POST' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should update a JobHistory', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            startDate: currentDate.format(DATE_TIME_FORMAT),
            endDate: currentDate.format(DATE_TIME_FORMAT),
            language: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.update(expected).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PUT' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should partial update a JobHistory', () => {
        const patchObject = Object.assign(
          {
            language: 'BBBBBB',
          },
          new JobHistory()
        );

        const returnedFromService = Object.assign(patchObject, elemDefault);

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'PATCH' });
        req.flush(returnedFromService);
        expect(expectedResult).toMatchObject(expected);
      });

      it('should return a list of JobHistory', () => {
        const returnedFromService = Object.assign(
          {
            id: 'BBBBBB',
            startDate: currentDate.format(DATE_TIME_FORMAT),
            endDate: currentDate.format(DATE_TIME_FORMAT),
            language: 'BBBBBB',
          },
          elemDefault
        );

        const expected = Object.assign(
          {
            startDate: currentDate,
            endDate: currentDate,
          },
          returnedFromService
        );

        service.query().subscribe(resp => (expectedResult = resp.body));

        const req = httpMock.expectOne({ method: 'GET' });
        req.flush([returnedFromService]);
        httpMock.verify();
        expect(expectedResult).toContainEqual(expected);
      });

      it('should delete a JobHistory', () => {
        service.delete('9fec3727-3421-4967-b213-ba36557ca194').subscribe(resp => (expectedResult = resp.ok));

        const req = httpMock.expectOne({ method: 'DELETE' });
        req.flush({ status: 200 });
        expect(expectedResult);
      });

      describe('addJobHistoryToCollectionIfMissing', () => {
        it('should add a JobHistory to an empty array', () => {
          const jobHistory: IJobHistory = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addJobHistoryToCollectionIfMissing([], jobHistory);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(jobHistory);
        });

        it('should not add a JobHistory to an array that contains it', () => {
          const jobHistory: IJobHistory = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const jobHistoryCollection: IJobHistory[] = [
            {
              ...jobHistory,
            },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
          ];
          expectedResult = service.addJobHistoryToCollectionIfMissing(jobHistoryCollection, jobHistory);
          expect(expectedResult).toHaveLength(2);
        });

        it("should add a JobHistory to an array that doesn't contain it", () => {
          const jobHistory: IJobHistory = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const jobHistoryCollection: IJobHistory[] = [{ id: '1361f429-3817-4123-8ee3-fdf8943310b2' }];
          expectedResult = service.addJobHistoryToCollectionIfMissing(jobHistoryCollection, jobHistory);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(jobHistory);
        });

        it('should add only unique JobHistory to an array', () => {
          const jobHistoryArray: IJobHistory[] = [
            { id: '9fec3727-3421-4967-b213-ba36557ca194' },
            { id: '1361f429-3817-4123-8ee3-fdf8943310b2' },
            { id: 'b545de2e-30b6-4a0d-8d4b-d3a24d234137' },
          ];
          const jobHistoryCollection: IJobHistory[] = [{ id: '9fec3727-3421-4967-b213-ba36557ca194' }];
          expectedResult = service.addJobHistoryToCollectionIfMissing(jobHistoryCollection, ...jobHistoryArray);
          expect(expectedResult).toHaveLength(3);
        });

        it('should accept varargs', () => {
          const jobHistory: IJobHistory = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          const jobHistory2: IJobHistory = { id: '1361f429-3817-4123-8ee3-fdf8943310b2' };
          expectedResult = service.addJobHistoryToCollectionIfMissing([], jobHistory, jobHistory2);
          expect(expectedResult).toHaveLength(2);
          expect(expectedResult).toContain(jobHistory);
          expect(expectedResult).toContain(jobHistory2);
        });

        it('should accept null and undefined values', () => {
          const jobHistory: IJobHistory = { id: '9fec3727-3421-4967-b213-ba36557ca194' };
          expectedResult = service.addJobHistoryToCollectionIfMissing([], null, jobHistory, undefined);
          expect(expectedResult).toHaveLength(1);
          expect(expectedResult).toContain(jobHistory);
        });
      });
    });

    afterEach(() => {
      httpMock.verify();
    });
  });
});
