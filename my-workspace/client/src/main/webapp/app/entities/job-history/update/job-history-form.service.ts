import { Service, WritableSignal } from '@angular/core';
import { FieldTree, FormOptions, form, readonly } from '@angular/forms/signals';

import dayjs from 'dayjs/esm';

import { DATE_TIME_FORMAT } from 'app/config';
import { IJobHistory, NewJobHistory } from '../job-history.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for the createFormModel argument.
 * It accepts IJobHistory for edit and NewJobHistoryFormInput for create.
 */
type JobHistoryFormInput = IJobHistory | PartialWithRequiredKeyOf<NewJobHistory>;

type JobHistoryFormDefaults = Pick<NewJobHistory, 'id'>;

/**
 * The value of the form: the text fields are strings, empty when the entity has no value, and the dates and times
 * are the text of their inputs.
 */
export type JobHistoryFormModel = {
  id: string;
  startDate: string;
  endDate: string;
  language: NonNullable<IJobHistory['language']> | '';
  job: NonNullable<IJobHistory['job']> | null;
  department: NonNullable<IJobHistory['department']> | null;
  employee: NonNullable<IJobHistory['employee']> | null;
};

export type JobHistoryForm = FieldTree<JobHistoryFormModel>;

@Service()
export class JobHistoryFormService {
  createJobHistoryFormModel(jobHistory?: JobHistoryFormInput): JobHistoryFormModel {
    const value: Partial<IJobHistory> | Partial<NewJobHistory> = { ...this.getFormDefaults(), ...jobHistory };
    return {
      id: value.id ?? '',
      startDate: value.startDate ? dayjs(value.startDate).format(DATE_TIME_FORMAT) : '',
      endDate: value.endDate ? dayjs(value.endDate).format(DATE_TIME_FORMAT) : '',
      language: value.language ?? '',
      job: value.job ?? null,
      department: value.department ?? null,
      employee: value.employee ?? null,
    };
  }

  /**
   * The form of the model, its validation included, created in an injection context.
   */
  createJobHistoryForm(model: WritableSignal<JobHistoryFormModel>, options: FormOptions<JobHistoryFormModel> = {}): JobHistoryForm {
    return form(
      model,
      path => {
        readonly(path.id);
      },
      options,
    );
  }

  getJobHistory(model: JobHistoryFormModel): IJobHistory | NewJobHistory {
    return {
      id: model.id || null,
      startDate: model.startDate ? dayjs(model.startDate, DATE_TIME_FORMAT).toJSON() : null,
      endDate: model.endDate ? dayjs(model.endDate, DATE_TIME_FORMAT).toJSON() : null,
      language: model.language || null,
      job: model.job,
      department: model.department,
      employee: model.employee,
    };
  }

  private getFormDefaults(): JobHistoryFormDefaults {
    return {
      id: null,
    };
  }
}
