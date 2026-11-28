import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: '45d65e9e-1c5f-4bf0-87f0-94bd4c787463',
};

export const sampleWithPartialData: IEmployee = {
  id: 'e7bb318e-817b-4234-a44c-3feb57a7d003',
  firstName: 'broadcast pace who',
  lastName: 'postbox severe',
  email: 'how',
  phoneNumber: 'customise avow',
  salary: 24896,
};

export const sampleWithFullData: IEmployee = {
  id: '9cc8c9f0-b708-4c46-b961-1f02c7e2a3bc',
  firstName: 'eminent once out',
  lastName: 'tattered',
  email: 'roughly unique exaggerate',
  phoneNumber: 'powerful',
  hireDate: '2023-12-24T08:19:00.000Z',
  salary: 13793,
  commissionPct: 15557,
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
