import { IRegion, NewRegion } from './region.model';

export const sampleWithRequiredData: IRegion = {
  id: '549240fa-9356-4105-99e2-2e179ff0782f',
};

export const sampleWithPartialData: IRegion = {
  id: '44449bc4-ea73-4ece-893c-a8b91fcbaa57',
};

export const sampleWithFullData: IRegion = {
  id: '65260b7b-dfd8-4fb7-88fb-7a3ced65ae87',
  regionName: 'pfft',
};

export const sampleWithNewData: NewRegion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
