import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: '5def0d87-dff0-4ff6-a7b7-6632c6da82cb',
};

export const sampleWithPartialData: IJob = {
  id: 'bd81b412-6c3a-484a-a8f9-e5ad5867233b',
  minSalary: 19637,
  maxSalary: 25983,
};

export const sampleWithFullData: IJob = {
  id: 'b6fa909b-f0db-4b52-8b3b-4bd39366b63f',
  jobTitle: 'Internal Program Coordinator',
  minSalary: 8466,
  maxSalary: 11866,
};

export const sampleWithNewData: NewJob = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
