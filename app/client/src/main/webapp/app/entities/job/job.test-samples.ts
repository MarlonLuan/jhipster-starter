import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: '5def0d87-dff0-4ff6-bb76-632c6da82cb8',
};

export const sampleWithPartialData: IJob = {
  id: 'bd81b412-6c3a-484a-8f9e-5ad5867233b8',
  jobTitle: 'Customer Data Producer',
};

export const sampleWithFullData: IJob = {
  id: '6fa909bf-0dbb-452b-bb4b-d39366b63f3d',
  jobTitle: 'Lead Markets Engineer',
  minSalary: 36212,
  maxSalary: 18626,
};

export const sampleWithNewData: NewJob = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
