import { Service, WritableSignal } from '@angular/core';
import { FieldTree, FormOptions, form, readonly } from '@angular/forms/signals';

import { IJob, NewJob } from '../job.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for the createFormModel argument.
 * It accepts IJob for edit and NewJobFormInput for create.
 */
type JobFormInput = IJob | PartialWithRequiredKeyOf<NewJob>;

type JobFormDefaults = Pick<NewJob, 'id' | 'tasks'>;

/**
 * The value of the form: the text fields are strings, empty when the entity has no value, and the dates and times
 * are the text of their inputs.
 */
export type JobFormModel = {
  id: string;
  jobTitle: string;
  minSalary: NonNullable<IJob['minSalary']> | null;
  maxSalary: NonNullable<IJob['maxSalary']> | null;
  tasks: NonNullable<IJob['tasks']>;
  employee: NonNullable<IJob['employee']> | null;
};

export type JobForm = FieldTree<JobFormModel>;

@Service()
export class JobFormService {
  createJobFormModel(job?: JobFormInput): JobFormModel {
    const value: Partial<IJob> | Partial<NewJob> = { ...this.getFormDefaults(), ...job };
    return {
      id: value.id ?? '',
      jobTitle: value.jobTitle ?? '',
      minSalary: value.minSalary ?? null,
      maxSalary: value.maxSalary ?? null,
      tasks: value.tasks ?? [],
      employee: value.employee ?? null,
    };
  }

  /**
   * The form of the model, its validation included, created in an injection context.
   */
  createJobForm(model: WritableSignal<JobFormModel>, options: FormOptions<JobFormModel> = {}): JobForm {
    return form(
      model,
      path => {
        readonly(path.id);
      },
      options,
    );
  }

  getJob(model: JobFormModel): IJob | NewJob {
    return {
      id: model.id || null,
      jobTitle: model.jobTitle || null,
      minSalary: model.minSalary,
      maxSalary: model.maxSalary,
      tasks: model.tasks,
      employee: model.employee,
    };
  }

  private getFormDefaults(): JobFormDefaults {
    return {
      id: null,
      tasks: [],
    };
  }
}
