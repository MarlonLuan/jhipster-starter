import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: 562,
};

export const sampleWithPartialData: ITask = {
  id: 74105,
  title: 'Monitored solid',
  description: 'animi lest',
};

export const sampleWithFullData: ITask = {
  id: 55535,
  title: 'primary shanty',
  description: 'violet pink',
};

export const sampleWithNewData: NewTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
