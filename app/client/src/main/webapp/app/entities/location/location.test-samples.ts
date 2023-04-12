import { ILocation, NewLocation } from './location.model';

export const sampleWithRequiredData: ILocation = {
  id: 'c1720011-f6c0-4cac-ad52-8c2220506dcd',
};

export const sampleWithPartialData: ILocation = {
  id: 'be14192e-bb63-45fb-afa2-2fbaedbc013e',
  city: 'Fort Dellaville',
};

export const sampleWithFullData: ILocation = {
  id: 'b6bd073a-8981-4f52-8c3c-47ee03a66c3a',
  streetAddress: 'Robust Coupe Intranet',
  postalCode: 'than scarily',
  city: 'Santa Rosa',
  stateProvince: 'collaborative parallelism over',
};

export const sampleWithNewData: NewLocation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
