import { IDepartment, NewDepartment } from './department.model';

export const sampleWithRequiredData: IDepartment = {
  id: 'f23b36c6-ce8e-4ad7-8d51-94a265e96c72',
  departmentName: 'lest responsible helplessly',
};

export const sampleWithPartialData: IDepartment = {
  id: '9d4bb317-d3c3-429d-bc01-dd072ab73650',
  departmentName: 'yak gadzooks',
};

export const sampleWithFullData: IDepartment = {
  id: '63d14aac-49b6-4112-bf61-1fbd9c070203',
  departmentName: 'onto yowza lest',
};

export const sampleWithNewData: NewDepartment = {
  departmentName: 'peaceful if',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
