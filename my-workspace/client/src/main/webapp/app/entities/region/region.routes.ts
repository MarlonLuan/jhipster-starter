import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import RegionResolve from './route/region-routing-resolve.service';

const regionRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/region.component').then(m => m.RegionComponent),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/region-detail.component').then(m => m.RegionDetailComponent),
    resolve: {
      region: RegionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/region-update.component').then(m => m.RegionUpdateComponent),
    resolve: {
      region: RegionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/region-update.component').then(m => m.RegionUpdateComponent),
    resolve: {
      region: RegionResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default regionRoute;
