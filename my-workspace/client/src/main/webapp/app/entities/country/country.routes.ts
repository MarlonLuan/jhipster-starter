import { Routes } from '@angular/router';

import { userRouteAccessService } from 'app/core/auth';

import CountryResolve from './route/country-routing-resolve.service';

const countryRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/country').then(m => m.Country),
    data: {},
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/country-detail').then(m => m.CountryDetail),
    resolve: {
      country: CountryResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/country-update').then(m => m.CountryUpdate),
    resolve: {
      country: CountryResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/country-update').then(m => m.CountryUpdate),
    resolve: {
      country: CountryResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default countryRoute;
