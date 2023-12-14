import dayjs from 'dayjs/esm';

import { IEmployee, NewEmployee } from './employee.model';

export const sampleWithRequiredData: IEmployee = {
  id: '57427bc4-b977-459e-ae6b-83582f8a0c27',
};

export const sampleWithPartialData: IEmployee = {
  id: '1d9467fc-a3d4-4467-a631-0ea58b74cf92',
  firstName: 'Reed',
  lastName: 'Price',
};

export const sampleWithFullData: IEmployee = {
  id: '3d952da4-b247-4407-b3ee-289940d420ba',
  firstName: 'Sister',
  lastName: 'Gutkowski',
  email: 'Juwan42@yahoo.com',
  phoneNumber: 'overstretch continent',
  hireDate: dayjs('2023-12-13T12:50'),
  salary: 12188,
  commissionPct: 20613,
};

export const sampleWithNewData: NewEmployee = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
