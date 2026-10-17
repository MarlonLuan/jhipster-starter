import { Routes } from '@angular/router';

import { userRouteAccessService } from 'app/core/auth';

import JobHistoryResolve from './route/job-history-routing-resolve.service';

const jobHistoryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/job-history').then(m => m.JobHistory),
    data: {},
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/job-history-detail').then(m => m.JobHistoryDetail),
    resolve: {
      jobHistory: JobHistoryResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/job-history-update').then(m => m.JobHistoryUpdate),
    resolve: {
      jobHistory: JobHistoryResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/job-history-update').then(m => m.JobHistoryUpdate),
    resolve: {
      jobHistory: JobHistoryResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default jobHistoryRoute;
