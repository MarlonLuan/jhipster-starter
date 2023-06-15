import dayjs from 'dayjs/esm';

import { Language } from 'app/entities/enumerations/language.model';

import { IJobHistory, NewJobHistory } from './job-history.model';

export const sampleWithRequiredData: IJobHistory = {
  id: '5140dff9-ab49-4882-82ba-3a3b175e037a',
};

export const sampleWithPartialData: IJobHistory = {
  id: '5c4fa0e6-76b5-42d6-bccd-f6511a9cba44',
  startDate: dayjs('2023-06-15T16:25'),
  endDate: dayjs('2023-06-15T06:05'),
  language: 'FRENCH',
};

export const sampleWithFullData: IJobHistory = {
  id: '595da028-da3f-4049-9a69-4e3f35e8b7f1',
  startDate: dayjs('2023-06-15T11:03'),
  endDate: dayjs('2023-06-15T03:31'),
  language: 'SPANISH',
};

export const sampleWithNewData: NewJobHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
