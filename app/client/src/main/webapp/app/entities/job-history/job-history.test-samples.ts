import dayjs from 'dayjs/esm';

import { Language } from 'app/entities/enumerations/language.model';

import { IJobHistory, NewJobHistory } from './job-history.model';

export const sampleWithRequiredData: IJobHistory = {
  id: '5140dff9-ab49-4882-82ba-3a3b175e037a',
};

export const sampleWithPartialData: IJobHistory = {
  id: '5c4fa0e6-76b5-42d6-bccd-f6511a9cba44',
  startDate: dayjs('2023-06-18T10:18'),
  endDate: dayjs('2023-06-17T23:58'),
  language: 'FRENCH',
};

export const sampleWithFullData: IJobHistory = {
  id: '595da028-da3f-4049-9a69-4e3f35e8b7f1',
  startDate: dayjs('2023-06-18T04:56'),
  endDate: dayjs('2023-06-17T21:24'),
  language: 'SPANISH',
};

export const sampleWithNewData: NewJobHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
