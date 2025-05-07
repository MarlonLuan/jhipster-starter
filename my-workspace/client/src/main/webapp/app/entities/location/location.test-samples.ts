import { ILocation, NewLocation } from './location.model';

export const sampleWithRequiredData: ILocation = {
  id: 'c1720011-f6c0-4cac-b2d5-28c2220506dc',
};

export const sampleWithPartialData: ILocation = {
  id: 'be14192e-bb63-45fb-b6fa-22fbaedbc013',
  streetAddress: 'steeple',
  postalCode: 'charming',
  stateProvince: 'dissolve instead save',
};

export const sampleWithFullData: ILocation = {
  id: 'd4a9951e-9ebf-4cb4-af74-6bfaefdc6c6d',
  streetAddress: 'although sarcastic',
  postalCode: 'geez',
  city: 'Port Cheyanne',
  stateProvince: 'inquisitively farewell',
};

export const sampleWithNewData: NewLocation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
