import { IDepartment, NewDepartment } from './department.model';

export const sampleWithRequiredData: IDepartment = {
  id: 'ba015a18-f470-41e0-8cb8-cf97424358e4',
  departmentName: 'RAM throughput Agent',
};

export const sampleWithPartialData: IDepartment = {
  id: 'c342a8e3-828c-44ad-8689-7bd4b8566453',
  departmentName: 'Nakfa schemas',
};

export const sampleWithFullData: IDepartment = {
  id: '9190f477-d3f9-4cc7-abb8-cb562198ee6e',
  departmentName: 'Principal input indeed',
};

export const sampleWithNewData: NewDepartment = {
  departmentName: 'Savings Bicycle excepting',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
