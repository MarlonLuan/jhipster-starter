import { Service, WritableSignal } from '@angular/core';
import { FieldTree, FormOptions, form, readonly, required } from '@angular/forms/signals';

import { IDepartment, NewDepartment } from '../department.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for the createFormModel argument.
 * It accepts IDepartment for edit and NewDepartmentFormInput for create.
 */
type DepartmentFormInput = IDepartment | PartialWithRequiredKeyOf<NewDepartment>;

type DepartmentFormDefaults = Pick<NewDepartment, 'id'>;

/**
 * The value of the form: the text fields are strings, empty when the entity has no value, and the dates and times
 * are the text of their inputs.
 */
export type DepartmentFormModel = {
  id: string;
  departmentName: string;
  location: NonNullable<IDepartment['location']> | null;
};

export type DepartmentForm = FieldTree<DepartmentFormModel>;

@Service()
export class DepartmentFormService {
  createDepartmentFormModel(department?: DepartmentFormInput): DepartmentFormModel {
    const value: Partial<IDepartment> | Partial<NewDepartment> = { ...this.getFormDefaults(), ...department };
    return {
      id: value.id ?? '',
      departmentName: value.departmentName ?? '',
      location: value.location ?? null,
    };
  }

  /**
   * The form of the model, its validation included, created in an injection context.
   */
  createDepartmentForm(model: WritableSignal<DepartmentFormModel>, options: FormOptions<DepartmentFormModel> = {}): DepartmentForm {
    return form(
      model,
      path => {
        readonly(path.id);
        required(path.departmentName);
      },
      options,
    );
  }

  getDepartment(model: DepartmentFormModel): IDepartment | NewDepartment {
    return {
      id: model.id || null,
      departmentName: model.departmentName || null,
      location: model.location,
    };
  }

  private getFormDefaults(): DepartmentFormDefaults {
    return {
      id: null,
    };
  }
}
