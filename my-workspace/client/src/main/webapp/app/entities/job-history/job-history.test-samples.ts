import dayjs from 'dayjs/esm';

import { Language } from 'app/entities/enumerations/language.model';

import { IJobHistory, NewJobHistory } from './job-history.model';

export const sampleWithRequiredData: IJobHistory = {
  id: 'f5e3cfb1-cf3d-4bcf-90ee-f9d5ac3f0fbf',
};

export const sampleWithPartialData: IJobHistory = {
  id: '36427201-76e4-4885-a171-5926c59a55f5',
  startDate: dayjs('1970-01-01T11:46'),
  endDate: dayjs('1969-12-31T21:13'),
};

export const sampleWithFullData: IJobHistory = {
  id: '641c82ec-f1c8-4416-9eab-abdf71b06628',
  startDate: dayjs('1969-12-31T12:39'),
  endDate: dayjs('1969-12-31T20:31'),
  language: Language['ENGLISH'],
};

export const sampleWithNewData: NewJobHistory = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
