import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, catchError, of } from 'rxjs';

import { IEmployee } from '../employee.model';
import { EmployeeService } from '../service/employee.service';

const employeeResolve = (route: ActivatedRouteSnapshot): Observable<null | IEmployee> => {
  const { id } = route.params;
  if (id) {
    const router = inject(Router);
    const service = inject(EmployeeService);
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

export default employeeResolve;
