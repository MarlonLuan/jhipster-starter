import { ILocation, NewLocation } from './location.model';

export const sampleWithRequiredData: ILocation = {
  id: 'e0df5e1a-be08-465b-acc9-eb918c1e21ed',
};

export const sampleWithPartialData: ILocation = {
  id: '905dc622-49b2-4006-b140-b1a55724e58d',
};

export const sampleWithFullData: ILocation = {
  id: 'ffc7cefd-2e70-402b-aad3-0f7dcc0f2bd8',
  streetAddress: 'Savings',
  postalCode: '1080p Analyst Shoes',
  city: 'Lake Yazminchester',
  stateProvince: 'silver hack Tactics',
};

export const sampleWithNewData: NewLocation = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
