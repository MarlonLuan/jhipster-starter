import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import JobResolve from './route/job-routing-resolve.service';

const jobRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/job').then(m => m.Job),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/job-detail').then(m => m.JobDetail),
    resolve: {
      job: JobResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/job-update').then(m => m.JobUpdate),
    resolve: {
      job: JobResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/job-update').then(m => m.JobUpdate),
    resolve: {
      job: JobResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default jobRoute;
