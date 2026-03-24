import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IRegion, NewRegion } from '../region.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IRegion for edit and NewRegionFormGroupInput for create.
 */
type RegionFormGroupInput = IRegion | PartialWithRequiredKeyOf<NewRegion>;

type RegionFormDefaults = Pick<NewRegion, 'id'>;

type RegionFormGroupContent = {
  id: FormControl<IRegion['id'] | NewRegion['id']>;
  regionName: FormControl<IRegion['regionName']>;
};

export type RegionFormGroup = FormGroup<RegionFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class RegionFormService {
  createRegionFormGroup(region?: RegionFormGroupInput): RegionFormGroup {
    const regionRawValue = {
      ...this.getFormDefaults(),
      ...(region ?? { id: null }),
    };
    return new FormGroup<RegionFormGroupContent>({
      id: new FormControl(
        { value: regionRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      regionName: new FormControl(regionRawValue.regionName),
    });
  }

  getRegion(form: RegionFormGroup): IRegion | NewRegion {
    return form.getRawValue() as IRegion | NewRegion;
  }

  resetForm(form: RegionFormGroup, region: RegionFormGroupInput): void {
    const regionRawValue = { ...this.getFormDefaults(), ...region };
    form.reset({
      ...regionRawValue,
      id: { value: regionRawValue.id, disabled: true },
    });
  }

  private getFormDefaults(): RegionFormDefaults {
    return {
      id: null,
    };
  }
}
