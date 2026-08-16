import { Routes } from '@angular/router';

import { userRouteAccessService } from 'app/core/auth/user-route-access.service';

import TaskResolve from './route/task-routing-resolve.service';

const taskRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/task').then(m => m.Task),
    data: {},
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/task-detail').then(m => m.TaskDetail),
    resolve: {
      task: TaskResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/task-update').then(m => m.TaskUpdate),
    resolve: {
      task: TaskResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/task-update').then(m => m.TaskUpdate),
    resolve: {
      task: TaskResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default taskRoute;
