import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, convertToParamMap } from '@angular/router';

import { of } from 'rxjs';

import { IJobHistory } from '../job-history.model';
import { JobHistoryService } from '../service/job-history.service';

import jobHistoryResolve from './job-history-routing-resolve.service';

describe('JobHistory routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: JobHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    });
    mockRouter = TestBed.inject(Router);
    jest.spyOn(mockRouter, 'navigate');
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(JobHistoryService);
  });

  describe('resolve', () => {
    it('should return IJobHistory returned by find', async () => {
      // GIVEN
      service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          jobHistoryResolve(mockActivatedRouteSnapshot).subscribe({
            next(result) {
              // THEN
              expect(service.find).toHaveBeenCalledWith('9fec3727-3421-4967-b213-ba36557ca194');
              expect(result).toEqual({ id: '9fec3727-3421-4967-b213-ba36557ca194' });
              resolve();
            },
          });
        });
      });
    });

    it('should return null if id is not provided', async () => {
      // GIVEN
      service.find = jest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          jobHistoryResolve(mockActivatedRouteSnapshot).subscribe({
            next(result) {
              // THEN
              expect(service.find).not.toHaveBeenCalled();
              expect(result).toEqual(null);
              resolve();
            },
          });
        });
      });
    });

    it('should route to 404 page if data not found in server', async () => {
      // GIVEN
      jest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<IJobHistory>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          jobHistoryResolve(mockActivatedRouteSnapshot).subscribe({
            complete() {
              // THEN
              expect(service.find).toHaveBeenCalledWith('9fec3727-3421-4967-b213-ba36557ca194');
              expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
              resolve();
            },
          });
        });
      });
    });
  });
});
