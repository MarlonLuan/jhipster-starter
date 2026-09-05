import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'region',
    title: 'jhipsterApp.region.home.title',
    loadChildren: () => import('./region/region.routes'),
  },
  {
    path: 'country',
    title: 'jhipsterApp.country.home.title',
    loadChildren: () => import('./country/country.routes'),
  },
  {
    path: 'location',
    title: 'jhipsterApp.location.home.title',
    loadChildren: () => import('./location/location.routes'),
  },
  {
    path: 'department',
    title: 'jhipsterApp.department.home.title',
    loadChildren: () => import('./department/department.routes'),
  },
  {
    path: 'task',
    title: 'jhipsterApp.task.home.title',
    loadChildren: () => import('./task/task.routes'),
  },
  {
    path: 'employee',
    title: 'jhipsterApp.employee.home.title',
    loadChildren: () => import('./employee/employee.routes'),
  },
  {
    path: 'job',
    title: 'jhipsterApp.job.home.title',
    loadChildren: () => import('./job/job.routes'),
  },
  {
    path: 'job-history',
    title: 'jhipsterApp.jobHistory.home.title',
    loadChildren: () => import('./job-history/job-history.routes'),
  },
  // jhipster-needle-add-entity-route - JHipster will add entity modules routes here
];

export default routes;
