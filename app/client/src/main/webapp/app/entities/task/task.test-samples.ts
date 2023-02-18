import { ITask, NewTask } from './task.model';

export const sampleWithRequiredData: ITask = {
  id: '099b6577-e459-4ae6-8770-fc9de254d222',
};

export const sampleWithPartialData: ITask = {
  id: '21bb33a1-76d1-49b8-a647-8c1444c1282c',
  title: 'Cotton RSS',
  description: 'Communications scalable frictionless',
};

export const sampleWithFullData: ITask = {
  id: 'ec82389b-a23b-440a-bd9e-a4610e6a16c3',
  title: 'Northeast',
  description: 'Diesel group',
};

export const sampleWithNewData: NewTask = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
