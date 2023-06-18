import dayjs from 'dayjs/esm';

import { Language } from 'app/entities/enumerations/language.model';

import { IJobHistory, NewJobHistory } from './job-history.model';

export const sampleWithRequiredData: IJobHistory = {
  id: 37054,
};

export const sampleWithPartialData: IJobHistory = {
  id: 82296,
};

export const sampleWithFullData: IJobHistory = {
  id: 99839,
  startDate: dayjs('2023-06-17T18:40'),
  endDate: dayjs('2023-06-18T02:52'),
  language: 'ENGLISH',
};

export const sampleWithNewData: NewJobHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
