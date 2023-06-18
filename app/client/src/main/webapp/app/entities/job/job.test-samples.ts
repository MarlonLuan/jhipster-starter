import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: 34632,
};

export const sampleWithPartialData: IJob = {
  id: 4837,
  jobTitle: 'Human Operations Administrator',
  minSalary: 83494,
  maxSalary: 95181,
};

export const sampleWithFullData: IJob = {
  id: 98398,
  jobTitle: 'Lead Usability Representative',
  minSalary: 43363,
  maxSalary: 45587,
};

export const sampleWithNewData: NewJob = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
