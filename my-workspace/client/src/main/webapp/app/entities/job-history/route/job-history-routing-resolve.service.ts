import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IJobHistory } from '../job-history.model';
import { JobHistoryService } from '../service/job-history.service';

const jobHistoryResolve = (route: ActivatedRouteSnapshot): Observable<null | IJobHistory> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(JobHistoryService);
    return service.find(id).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          router.navigate(['404']);
        } else {
          router.navigate(['error']);
        }
        return EMPTY;
      }),
    );
  }

  return of(null);
};

export default jobHistoryResolve;
