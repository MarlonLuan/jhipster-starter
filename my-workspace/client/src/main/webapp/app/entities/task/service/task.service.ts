import { HttpClient, HttpResponse, httpResource } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable } from 'rxjs';

import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { isPresent } from 'app/core/util/operators';
import { ITask, NewTask } from '../task.model';

export type PartialUpdateTask = Partial<ITask> & Pick<ITask, 'id'>;

@Injectable()
export class TasksService {
  readonly tasksParams = signal<Record<string, string | number | boolean | readonly (string | number | boolean)[]> | undefined>(undefined);
  readonly tasksResource = httpResource<ITask[]>(() => {
    const params = this.tasksParams();
    if (!params) {
      return undefined;
    }
    return { url: this.resourceUrl, params };
  });
  /**
   * This signal holds the list of task that have been fetched. It is updated when the tasksResource emits a new value.
   * In case of error while fetching the tasks, the signal is set to an empty array.
   */
  readonly tasks = computed(() => (this.tasksResource.hasValue() ? this.tasksResource.value() : []));
  protected readonly applicationConfigService = inject(ApplicationConfigService);
  protected readonly resourceUrl = this.applicationConfigService.getEndpointFor('api/tasks');
}

@Injectable({ providedIn: 'root' })
export class TaskService extends TasksService {
  protected readonly http = inject(HttpClient);

  create(task: NewTask): Observable<ITask> {
    return this.http.post<ITask>(this.resourceUrl, task);
  }

  update(task: ITask): Observable<ITask> {
    return this.http.put<ITask>(`${this.resourceUrl}/${encodeURIComponent(this.getTaskIdentifier(task))}`, task);
  }

  partialUpdate(task: PartialUpdateTask): Observable<ITask> {
    return this.http.patch<ITask>(`${this.resourceUrl}/${encodeURIComponent(this.getTaskIdentifier(task))}`, task);
  }

  find(id: string): Observable<ITask> {
    return this.http.get<ITask>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  query(req?: any): Observable<HttpResponse<ITask[]>> {
    const options = createRequestOption(req);
    return this.http.get<ITask[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<undefined> {
    return this.http.delete<undefined>(`${this.resourceUrl}/${encodeURIComponent(id)}`);
  }

  getTaskIdentifier(task: Pick<ITask, 'id'>): string {
    return task.id;
  }

  compareTask(o1: Pick<ITask, 'id'> | null, o2: Pick<ITask, 'id'> | null): boolean {
    return o1 && o2 ? this.getTaskIdentifier(o1) === this.getTaskIdentifier(o2) : o1 === o2;
  }

  addTaskToCollectionIfMissing<Type extends Pick<ITask, 'id'>>(
    taskCollection: Type[],
    ...tasksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const tasks: Type[] = tasksToCheck.filter(isPresent);
    if (tasks.length > 0) {
      const taskCollectionIdentifiers = taskCollection.map(taskItem => this.getTaskIdentifier(taskItem));
      const tasksToAdd = tasks.filter(taskItem => {
        const taskIdentifier = this.getTaskIdentifier(taskItem);
        if (taskCollectionIdentifiers.includes(taskIdentifier)) {
          return false;
        }
        taskCollectionIdentifiers.push(taskIdentifier);
        return true;
      });
      return [...tasksToAdd, ...taskCollection];
    }
    return taskCollection;
  }
}
