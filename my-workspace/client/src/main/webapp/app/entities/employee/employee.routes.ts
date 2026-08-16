import { Routes } from '@angular/router';

import { userRouteAccessService } from 'app/core/auth/user-route-access.service';

import EmployeeResolve from './route/employee-routing-resolve.service';

const employeeRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/employee').then(m => m.Employee),
    data: {},
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/employee-detail').then(m => m.EmployeeDetail),
    resolve: {
      employee: EmployeeResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/employee-update').then(m => m.EmployeeUpdate),
    resolve: {
      employee: EmployeeResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/employee-update').then(m => m.EmployeeUpdate),
    resolve: {
      employee: EmployeeResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default employeeRoute;
