import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: '5e08dff6-b63c-4d8c-884b-8b1638afea56',
};

export const sampleWithPartialData: IJob = {
  id: '6a0b0b5b-bb33-466f-9d65-e2432e1f2c06',
  jobTitle: 'Corporate Configuration Representative',
};

export const sampleWithFullData: IJob = {
  id: 'c5fd0091-9882-405b-a7d5-ffef9c1eba82',
  jobTitle: 'National Operations Designer',
  minSalary: 15335,
  maxSalary: 20882,
};

export const sampleWithNewData: NewJob = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
