import { IRegion, NewRegion } from './region.model';

export const sampleWithRequiredData: IRegion = {
  id: '59449329-4e01-4f1a-9993-c5c6e150e5e9',
};

export const sampleWithPartialData: IRegion = {
  id: 'ef2925e4-1173-49bf-af80-37b8f28fc7ac',
};

export const sampleWithFullData: IRegion = {
  id: '34540494-490b-4cc8-87ea-ab7632e6c9ea',
  regionName: 'green silver',
};

export const sampleWithNewData: NewRegion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
