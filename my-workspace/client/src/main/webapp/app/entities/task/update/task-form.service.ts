import { Service, WritableSignal } from '@angular/core';
import { FieldTree, FormOptions, form, readonly } from '@angular/forms/signals';

import { ITask, NewTask } from '../task.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for the createFormModel argument.
 * It accepts ITask for edit and NewTaskFormInput for create.
 */
type TaskFormInput = ITask | PartialWithRequiredKeyOf<NewTask>;

type TaskFormDefaults = Pick<NewTask, 'id'>;

/**
 * The value of the form: the text fields are strings, empty when the entity has no value, and the dates and times
 * are the text of their inputs.
 */
export type TaskFormModel = {
  id: string;
  title: string;
  description: string;
};

export type TaskForm = FieldTree<TaskFormModel>;

@Service()
export class TaskFormService {
  createTaskFormModel(task?: TaskFormInput): TaskFormModel {
    const value: Partial<ITask> | Partial<NewTask> = { ...this.getFormDefaults(), ...task };
    return {
      id: value.id ?? '',
      title: value.title ?? '',
      description: value.description ?? '',
    };
  }

  /**
   * The form of the model, its validation included, created in an injection context.
   */
  createTaskForm(model: WritableSignal<TaskFormModel>, options: FormOptions<TaskFormModel> = {}): TaskForm {
    return form(
      model,
      path => {
        readonly(path.id);
      },
      options,
    );
  }

  getTask(model: TaskFormModel): ITask | NewTask {
    return {
      id: model.id || null,
      title: model.title || null,
      description: model.description || null,
    };
  }

  private getFormDefaults(): TaskFormDefaults {
    return {
      id: null,
    };
  }
}
