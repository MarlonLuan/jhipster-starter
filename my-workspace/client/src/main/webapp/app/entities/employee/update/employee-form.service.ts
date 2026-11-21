import { Service, WritableSignal } from '@angular/core';
import { FieldTree, FormOptions, form, readonly } from '@angular/forms/signals';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config';
import { IEmployee, NewEmployee } from '../employee.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for the createFormModel argument.
 * It accepts IEmployee for edit and NewEmployeeFormInput for create.
 */
type EmployeeFormInput = IEmployee | PartialWithRequiredKeyOf<NewEmployee>;

type EmployeeFormDefaults = Pick<NewEmployee, 'id' | 'hireDate'>;

/**
 * The value of the form: the text fields are strings, empty when the entity has no value, and the dates and times
 * are the text of their inputs.
 */
export type EmployeeFormModel = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  hireDate: string;
  salary: NonNullable<IEmployee['salary']> | null;
  commissionPct: NonNullable<IEmployee['commissionPct']> | null;
  manager: NonNullable<IEmployee['manager']> | null;
  department: NonNullable<IEmployee['department']> | null;
};

export type EmployeeForm = FieldTree<EmployeeFormModel>;

@Service()
export class EmployeeFormService {
  createEmployeeFormModel(employee?: EmployeeFormInput): EmployeeFormModel {
    const value: Partial<IEmployee> | Partial<NewEmployee> = { ...this.getFormDefaults(), ...employee };
    return {
      id: value.id ?? '',
      firstName: value.firstName ?? '',
      lastName: value.lastName ?? '',
      email: value.email ?? '',
      phoneNumber: value.phoneNumber ?? '',
      hireDate: value.hireDate ? dayjs(value.hireDate).format(DATE_TIME_FORMAT) : '',
      salary: value.salary ?? null,
      commissionPct: value.commissionPct ?? null,
      manager: value.manager ?? null,
      department: value.department ?? null,
    };
  }

  /**
   * The form of the model, its validation included, created in an injection context.
   */
  createEmployeeForm(model: WritableSignal<EmployeeFormModel>, options: FormOptions<EmployeeFormModel> = {}): EmployeeForm {
    return form(
      model,
      path => {
        readonly(path.id);
      },
      options,
    );
  }

  getEmployee(model: EmployeeFormModel): IEmployee | NewEmployee {
    return {
      id: model.id || null,
      firstName: model.firstName || null,
      lastName: model.lastName || null,
      email: model.email || null,
      phoneNumber: model.phoneNumber || null,
      hireDate: model.hireDate ? dayjs(model.hireDate, DATE_TIME_FORMAT).toJSON() : null,
      salary: model.salary,
      commissionPct: model.commissionPct,
      manager: model.manager,
      department: model.department,
    };
  }

  private getFormDefaults(): EmployeeFormDefaults {
    const currentTime = dayjs().toJSON();

    return {
      id: null,
      hireDate: currentTime,
    };
  }
}
