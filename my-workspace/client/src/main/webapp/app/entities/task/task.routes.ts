import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import TaskResolve from './route/task-routing-resolve.service';

const taskRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/task.component').then(m => m.TaskComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/task-detail.component').then(m => m.TaskDetailComponent),
    resolve: {
      task: TaskResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/task-update.component').then(m => m.TaskUpdateComponent),
    resolve: {
      task: TaskResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/task-update.component').then(m => m.TaskUpdateComponent),
    resolve: {
      task: TaskResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default taskRoute;
