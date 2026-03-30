import { HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router } from '@angular/router';

import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { TaskService } from '../service/task.service';
import { ITask } from '../task.model';

const taskResolve = (route: ActivatedRouteSnapshot): Observable<null | ITask> => {
  const id = route.params.id;
  if (id) {
    return inject(TaskService)
      .find(id)
      .pipe(
        mergeMap((task: HttpResponse<ITask>) => {
          if (task.body) {
            return of(task.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default taskResolve;
