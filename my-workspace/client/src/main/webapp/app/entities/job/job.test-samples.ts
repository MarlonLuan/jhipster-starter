import { IJob, NewJob } from './job.model';

export const sampleWithRequiredData: IJob = {
  id: '3f17577a-c1b4-477d-85da-ba09f8f55a88',
};

export const sampleWithPartialData: IJob = {
  id: '67252276-5028-44c6-8933-292efe5facda',
  jobTitle: 'Internal Configuration Assistant',
  maxSalary: 15580,
};

export const sampleWithFullData: IJob = {
  id: '4dfdd60f-7466-42ea-af41-a893fc57e831',
  jobTitle: 'Legacy Functionality Agent',
  minSalary: 8606,
  maxSalary: 14819,
};

export const sampleWithNewData: NewJob = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
