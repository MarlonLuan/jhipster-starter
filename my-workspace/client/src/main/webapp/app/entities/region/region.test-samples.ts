import { IRegion, NewRegion } from './region.model';

export const sampleWithRequiredData: IRegion = {
  id: '59449329-4e01-4f1a-ad99-3c5c6e150e5e',
};

export const sampleWithPartialData: IRegion = {
  id: 'ef2925e4-1173-49bf-bef8-037b8f28fc7a',
  regionName: 'beside',
};

export const sampleWithFullData: IRegion = {
  id: '490bcc84-7eaa-4b76-b32e-6c9ea923dcfa',
  regionName: 'pfft outside',
};

export const sampleWithNewData: NewRegion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
