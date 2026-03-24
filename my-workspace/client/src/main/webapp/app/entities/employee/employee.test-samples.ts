import dayjs from 'dayjs/esm';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: '45d65e9e-1c5f-4bf0-87f0-94bd4c787463',
};

export const sampleWithPartialData: IEmployee = {
  id: 'e7bb318e-817b-4234-a44c-3feb57a7d003',
  firstName: 'Edgar',
  lastName: 'McGlynn',
  email: 'Katherine.Harvey@gmail.com',
  phoneNumber: 'awareness to',
  salary: 31027,
};

export const sampleWithFullData: IEmployee = {
  id: '9cc8c9f0-b708-4c46-b961-1f02c7e2a3bc',
  firstName: 'Myrna',
  lastName: 'VonRueden',
  email: 'Daisy49@hotmail.com',
  phoneNumber: 'regarding rigid roughly',
  hireDate: dayjs('1970-01-01T09:46'),
  salary: 14746,
  commissionPct: 15920,
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
