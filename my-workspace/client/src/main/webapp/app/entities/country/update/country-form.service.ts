import { Service, WritableSignal } from '@angular/core';
import { FieldTree, FormOptions, form, readonly } from '@angular/forms/signals';

import { ICountry, NewCountry } from '../country.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for the createFormModel argument.
 * It accepts ICountry for edit and NewCountryFormInput for create.
 */
type CountryFormInput = ICountry | PartialWithRequiredKeyOf<NewCountry>;

type CountryFormDefaults = Pick<NewCountry, 'id'>;

/**
 * The value of the form: the text fields are strings, empty when the entity has no value, and the dates and times
 * are the text of their inputs.
 */
export type CountryFormModel = {
  id: string;
  countryName: string;
  region: NonNullable<ICountry['region']> | null;
};

export type CountryForm = FieldTree<CountryFormModel>;

@Service()
export class CountryFormService {
  createCountryFormModel(country?: CountryFormInput): CountryFormModel {
    const value: Partial<ICountry> | Partial<NewCountry> = { ...this.getFormDefaults(), ...country };
    return {
      id: value.id ?? '',
      countryName: value.countryName ?? '',
      region: value.region ?? null,
    };
  }

  /**
   * The form of the model, its validation included, created in an injection context.
   */
  createCountryForm(model: WritableSignal<CountryFormModel>, options: FormOptions<CountryFormModel> = {}): CountryForm {
    return form(
      model,
      path => {
        readonly(path.id);
      },
      options,
    );
  }

  getCountry(model: CountryFormModel): ICountry | NewCountry {
    return {
      id: model.id || null,
      countryName: model.countryName || null,
      region: model.region,
    };
  }

  private getFormDefaults(): CountryFormDefaults {
    return {
      id: null,
    };
  }
}
