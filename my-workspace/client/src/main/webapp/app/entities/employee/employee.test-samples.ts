import dayjs from 'dayjs/esm';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: '547cb75e-6852-4802-aa2a-a196fad4730a',
};

export const sampleWithPartialData: IEmployee = {
  id: '2ab447e2-94d2-4be2-b8f2-ad4108735bad',
  firstName: 'Pedro',
  hireDate: dayjs('1970-01-01T06:00'),
  salary: 29591,
};

export const sampleWithFullData: IEmployee = {
  id: 'ae2dc6a2-f78a-4b7c-8189-ea91cba2fa08',
  firstName: 'Martine',
  lastName: 'Sporer',
  email: 'Rafaela_Schuppe@yahoo.com',
  phoneNumber: 'snowplow er',
  hireDate: dayjs('1969-12-31T15:33'),
  salary: 10730,
  commissionPct: 9731,
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
