import { IRegion, NewRegion } from './region.model';

export const sampleWithRequiredData: IRegion = {
  id: '4ac22173-a27f-4cc2-bff5-851da2a397e4',
};

export const sampleWithPartialData: IRegion = {
  id: '51ce1af6-5077-4364-990c-ed374684f191',
};

export const sampleWithFullData: IRegion = {
  id: '3319f7aa-2386-44eb-921d-311f32b2c8ca',
  regionName: 'non-volatile withdrawal Computer',
};

export const sampleWithNewData: NewRegion = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
