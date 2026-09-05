import { Routes } from '@angular/router';

import { userRouteAccessService } from 'app/core/auth';

import DepartmentResolve from './route/department-routing-resolve.service';

const departmentRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/department').then(m => m.Department),
    data: {},
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/department-detail').then(m => m.DepartmentDetail),
    resolve: {
      department: DepartmentResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/department-update').then(m => m.DepartmentUpdate),
    resolve: {
      department: DepartmentResolve,
    },
    canActivate: [userRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/department-update').then(m => m.DepartmentUpdate),
    resolve: {
      department: DepartmentResolve,
    },
    canActivate: [userRouteAccessService],
  },
];

export default departmentRoute;
