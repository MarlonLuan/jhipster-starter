import { Service, WritableSignal } from '@angular/core';
import { FieldTree, FormOptions, form, readonly } from '@angular/forms/signals';

import { ILocation, NewLocation } from '../location.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for the createFormModel argument.
 * It accepts ILocation for edit and NewLocationFormInput for create.
 */
type LocationFormInput = ILocation | PartialWithRequiredKeyOf<NewLocation>;

type LocationFormDefaults = Pick<NewLocation, 'id'>;

/**
 * The value of the form: the text fields are strings, empty when the entity has no value, and the dates and times
 * are the text of their inputs.
 */
export type LocationFormModel = {
  id: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  stateProvince: string;
  country: NonNullable<ILocation['country']> | null;
};

export type LocationForm = FieldTree<LocationFormModel>;

@Service()
export class LocationFormService {
  createLocationFormModel(location?: LocationFormInput): LocationFormModel {
    const value: Partial<ILocation> | Partial<NewLocation> = { ...this.getFormDefaults(), ...location };
    return {
      id: value.id ?? '',
      streetAddress: value.streetAddress ?? '',
      postalCode: value.postalCode ?? '',
      city: value.city ?? '',
      stateProvince: value.stateProvince ?? '',
      country: value.country ?? null,
    };
  }

  /**
   * The form of the model, its validation included, created in an injection context.
   */
  createLocationForm(model: WritableSignal<LocationFormModel>, options: FormOptions<LocationFormModel> = {}): LocationForm {
    return form(
      model,
      path => {
        readonly(path.id);
      },
      options,
    );
  }

  getLocation(model: LocationFormModel): ILocation | NewLocation {
    return {
      id: model.id || null,
      streetAddress: model.streetAddress || null,
      postalCode: model.postalCode || null,
      city: model.city || null,
      stateProvince: model.stateProvince || null,
      country: model.country,
    };
  }

  private getFormDefaults(): LocationFormDefaults {
    return {
      id: null,
    };
  }
}
