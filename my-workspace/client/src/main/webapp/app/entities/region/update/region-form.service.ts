import { Service, WritableSignal } from '@angular/core';
import { FieldTree, FormOptions, form, readonly } from '@angular/forms/signals';

import { IRegion, NewRegion } from '../region.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for the createFormModel argument.
 * It accepts IRegion for edit and NewRegionFormInput for create.
 */
type RegionFormInput = IRegion | PartialWithRequiredKeyOf<NewRegion>;

type RegionFormDefaults = Pick<NewRegion, 'id'>;

/**
 * The value of the form: the text fields are strings, empty when the entity has no value, and the dates and times
 * are the text of their inputs.
 */
export type RegionFormModel = {
  id: string;
  regionName: string;
};

export type RegionForm = FieldTree<RegionFormModel>;

@Service()
export class RegionFormService {
  createRegionFormModel(region?: RegionFormInput): RegionFormModel {
    const value: Partial<IRegion> | Partial<NewRegion> = { ...this.getFormDefaults(), ...region };
    return {
      id: value.id ?? '',
      regionName: value.regionName ?? '',
    };
  }

  /**
   * The form of the model, its validation included, created in an injection context.
   */
  createRegionForm(model: WritableSignal<RegionFormModel>, options: FormOptions<RegionFormModel> = {}): RegionForm {
    return form(
      model,
      path => {
        readonly(path.id);
      },
      options,
    );
  }

  getRegion(model: RegionFormModel): IRegion | NewRegion {
    return {
      id: model.id || null,
      regionName: model.regionName || null,
    };
  }

  private getFormDefaults(): RegionFormDefaults {
    return {
      id: null,
    };
  }
}
