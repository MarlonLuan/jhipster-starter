import { beforeEach, describe, expect, it, vitest } from 'vitest';
import { HttpResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, ActivatedRouteSnapshot, Router, convertToParamMap } from '@angular/router';

import { of } from 'rxjs';

import { TaskService } from '../service/task.service';
import { ITask } from '../task.model';

import taskResolve from './task-routing-resolve.service';

describe('Task routing resolve service', () => {
  let mockRouter: Router;
  let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
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
    vitest.spyOn(mockRouter, 'navigate');
    mockActivatedRouteSnapshot = TestBed.inject(ActivatedRoute).snapshot;
    service = TestBed.inject(TaskService);
  });

  describe('resolve', () => {
    it('should return ITask returned by find', async () => {
      // GIVEN
      service.find = vitest.fn(id => of(new HttpResponse({ body: { id } })));
      mockActivatedRouteSnapshot.params = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          taskResolve(mockActivatedRouteSnapshot).subscribe({
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
      service.find = vitest.fn();
      mockActivatedRouteSnapshot.params = {};

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          taskResolve(mockActivatedRouteSnapshot).subscribe({
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
      vitest.spyOn(service, 'find').mockReturnValue(of(new HttpResponse<ITask>({ body: null })));
      mockActivatedRouteSnapshot.params = { id: '9fec3727-3421-4967-b213-ba36557ca194' };

      // WHEN
      await new Promise<void>(resolve => {
        TestBed.runInInjectionContext(() => {
          taskResolve(mockActivatedRouteSnapshot).subscribe({
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
