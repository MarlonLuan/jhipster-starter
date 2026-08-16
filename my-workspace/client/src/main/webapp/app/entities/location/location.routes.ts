import { Routes } from '@angular/router';

import { userRouteAccessService } from 'app/core/auth/user-route-access.service';

import LocationResolve from './route/location-routing-resolve.service';

const locationRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/location').then(m => m.Location),
    data: {},
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/location-detail').then(m => m.LocationDetail),
    resolve: {
      location: LocationResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/location-update').then(m => m.LocationUpdate),
    resolve: {
      location: LocationResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/location-update').then(m => m.LocationUpdate),
    resolve: {
      location: LocationResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default locationRoute;
