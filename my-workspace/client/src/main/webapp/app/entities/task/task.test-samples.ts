import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: '6cd369ff-3e50-44dc-bff2-85e0c26ef9ed',
};

export const sampleWithPartialData: ITask = {
  id: 'c51c0fba-8dba-4c51-b5b3-279bc9af4bf8',
  title: 'Licensed Account',
  description: 'Sleek',
};

export const sampleWithFullData: ITask = {
  id: '34411810-297e-4e02-bb64-e2d6d401a6b3',
  title: 'SDD',
  description: 'Strategist Springs white',
};

export const sampleWithNewData: NewTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
