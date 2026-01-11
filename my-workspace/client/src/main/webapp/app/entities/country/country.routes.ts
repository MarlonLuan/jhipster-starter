import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import CountryResolve from './route/country-routing-resolve.service';

const countryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/country').then(m => m.Country),
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/country-detail').then(m => m.CountryDetail),
    resolve: {
      country: CountryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/country-update').then(m => m.CountryUpdate),
    resolve: {
      country: CountryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/country-update').then(m => m.CountryUpdate),
    resolve: {
      country: CountryResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default countryRoute;
