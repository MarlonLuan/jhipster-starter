import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { DepartmentComponent } from './list/department.component';
import { DepartmentDetailComponent } from './detail/department-detail.component';
import { DepartmentUpdateComponent } from './update/department-update.component';
import DepartmentResolve from './route/department-routing-resolve.service';

const departmentRoute: Routes = [
  {
    path: '',
    component: DepartmentComponent,
    data: {},
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: DepartmentDetailComponent,
    resolve: {
      department: DepartmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: DepartmentUpdateComponent,
    resolve: {
      department: DepartmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: DepartmentUpdateComponent,
    resolve: {
      department: DepartmentResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default departmentRoute;
