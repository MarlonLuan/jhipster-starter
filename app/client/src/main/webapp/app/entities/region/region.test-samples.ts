import { IRegion, NewRegion } from './region.model';

export const sampleWithRequiredData: IRegion = {
  id: 33747,
};

export const sampleWithPartialData: IRegion = {
  id: 30798,
  regionName: 'Folk',
};

export const sampleWithFullData: IRegion = {
  id: 14779,
  regionName: 'ubiquitous North',
};

export const sampleWithNewData: NewRegion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
