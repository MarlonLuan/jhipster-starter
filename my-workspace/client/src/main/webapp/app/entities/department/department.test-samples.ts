import { IDepartment, NewDepartment } from './department.model';

export const sampleWithRequiredData: IDepartment = {
  id: 'ba015a18-f470-41e0-94cb-8cf97424358e',
  departmentName: 'muffled readily skewer',
};

export const sampleWithPartialData: IDepartment = {
  id: '4ad06897-bd4b-4856-9645-35635c9190f4',
  departmentName: 'legitimate happy',
};

export const sampleWithFullData: IDepartment = {
  id: '62198ee6-ee57-4af3-bc48-be5d93626cc8',
  departmentName: 'zowie subsidence',
};

export const sampleWithNewData: NewDepartment = {
  departmentName: 'even absentmindedly',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
