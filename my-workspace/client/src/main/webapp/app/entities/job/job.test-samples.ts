import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: '6970a9f1-2401-404d-95ed-b9946035a427',
};

export const sampleWithPartialData: IJob = {
  id: '1199dad7-77be-4985-ba38-4a3b02960552',
  jobTitle: 'Investor Security Strategist',
  minSalary: 57238,
  maxSalary: 62645,
};

export const sampleWithFullData: IJob = {
  id: '54e037f9-59f1-435a-bd09-560de2a0e910',
  jobTitle: 'Investor Brand Designer',
  minSalary: 50710,
  maxSalary: 10260,
};

export const sampleWithNewData: NewJob = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
