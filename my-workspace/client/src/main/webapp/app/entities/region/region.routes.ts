import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import RegionResolve from './route/region-routing-resolve.service';

const regionRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/region').then(m => m.Region),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/region-detail').then(m => m.RegionDetail),
    resolve: {
      region: RegionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/region-update').then(m => m.RegionUpdate),
    resolve: {
      region: RegionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/region-update').then(m => m.RegionUpdate),
    resolve: {
      region: RegionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default regionRoute;
