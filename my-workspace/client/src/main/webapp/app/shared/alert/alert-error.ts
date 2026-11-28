import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, inject, input, signal } from '@angular/core';

import { NgbAlert } from '@ng-bootstrap/ng-bootstrap/alert';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

import { translationNotFoundMessage } from 'app/config';
import { AlertModel, AlertService, EventManager, EventWithContent } from 'app/core/util';
import { getMessageFromHeaders } from 'app/shared/jhipster/headers';
import {
  FieldErrorVM,
  JHipsterProblem,
  getServerProblem,
  isConstraintViolation,
  isProblemWithMessage,
} from 'app/shared/jhipster/problem-details';

import { AlertErrorModel } from './alert-error.model';

@Component({
  selector: 'jhi-alert-error',
  templateUrl: './alert-error.html',
  imports: [NgbAlert],
})
export class AlertError implements OnDestroy {
  /** The fields the form of the page shows the error of the server for, which the alert leaves out. */
  readonly formFields = input<readonly string[]>([]);
  readonly alerts = signal<AlertModel[]>([]);
  errorListener: Subscription;
  httpErrorListener: Subscription;

  private readonly alertService = inject(AlertService);
  private readonly eventManager = inject(EventManager);

  private readonly translateService = inject(TranslateService);

  constructor() {
    this.errorListener = this.eventManager.subscribe('jhipsterApp.error', (response: EventWithContent<unknown>) => {
      const errorResponse = (response as EventWithContent<AlertErrorModel>).content;
      this.addErrorAlert(errorResponse.message, errorResponse.key, errorResponse.params);
    });

    this.httpErrorListener = this.eventManager.subscribe('jhipsterApp.httpError', (response: EventWithContent<unknown>) => {
      this.handleHttpError(response);
    });
  }

  setClasses(alert: AlertModel): Record<string, boolean> {
    const classes = { 'jhi-toast': Boolean(alert.toast) };
    if (alert.position) {
      return { ...classes, [alert.position]: true };
    }
    return classes;
  }

  ngOnDestroy(): void {
    this.eventManager.destroy(this.errorListener);
    this.eventManager.destroy(this.httpErrorListener);
  }

  close(alert: AlertModel): void {
    alert.close?.();
  }

  private addErrorAlert(message?: string, translationKey?: string, translationParams?: Record<string, unknown>): void {
    this.alertService.addAlert({ type: 'danger', message, translationKey, translationParams }, this.alerts);
  }

  private handleHttpError(response: EventWithContent<unknown>): void {
    const httpErrorResponse = (response as EventWithContent<HttpErrorResponse>).content;
    switch (httpErrorResponse.status) {
      // connection refused, server not reachable
      case 0:
        this.addErrorAlert('Server not reachable', 'error.server.not.reachable');
        break;

      case 400: {
        this.handleBadRequest(httpErrorResponse);
        break;
      }

      // The security of the server denies the access without a body, a resource may tell why in a problem.
      case 403:
        if (getServerProblem(httpErrorResponse.error)?.message) {
          this.handleDefaultError(httpErrorResponse);
        } else {
          this.addErrorAlert('You are not authorized to access this page.', 'error.http.403');
        }
        break;

      case 404:
        this.addErrorAlert('Not found', 'error.url.not.found');
        break;

      default:
        this.handleDefaultError(httpErrorResponse);
    }
  }

  private handleBadRequest(httpErrorResponse: HttpErrorResponse): void {
    const headers = Object.fromEntries(httpErrorResponse.headers.keys().map(key => [key, httpErrorResponse.headers.getAll(key)]));
    const message = getMessageFromHeaders(headers);
    const problem = getServerProblem(httpErrorResponse.error);
    if (message.errorKey) {
      const alertData = message.param ? { entityName: this.translateService.instant(`global.menu.entities.${message.param}`) } : undefined;
      this.addErrorAlert(message.errorKey, message.errorKey, alertData);
    } else if (message.errorMessage) {
      this.addErrorAlert(message.errorMessage);
    } else if (isConstraintViolation(problem)) {
      this.handleFieldsError(problem.fieldErrors);
    } else {
      this.handleDefaultError(httpErrorResponse);
    }
  }

  private handleDefaultError(httpErrorResponse: HttpErrorResponse): void {
    // The body of an error may be a problem of the server, another object, a text or nothing.
    const { error } = httpErrorResponse;
    const problem: JHipsterProblem | undefined =
      getServerProblem(error) ?? (typeof error === 'object' && error !== null ? (error as JHipsterProblem) : undefined);
    const params = isProblemWithMessage(problem) ? problem.params : undefined;
    if (problem?.message) {
      this.addErrorAlert(
        problem.detail ?? problem.message,
        problem.message,
        params ? { entityName: this.translateService.instant(`global.menu.entities.${params}`) } : undefined,
      );
    } else if (typeof error === 'string' && error !== '') {
      this.addErrorAlert(error, error);
    } else {
      this.addErrorAlert(httpErrorResponse.message);
    }
  }

  private handleFieldsError(fieldErrors: FieldErrorVM[]): void {
    // The form shows the errors of its fields next to them.
    for (const fieldError of fieldErrors.filter(({ field }) => !this.formFields().includes(field))) {
      // The code of the constraint is the key of its translation, older servers send it as the message.
      const code: string = fieldError.code ?? fieldError.message;
      const errorKey = ['Min', 'Max', 'DecimalMin', 'DecimalMax'].includes(code) ? 'Size' : code;
      // convert 'something[14].other[4].id' to 'something[].other[].id' so translations can be written to it
      const convertedField: string = fieldError.field.replaceAll(/\[\d*\]/g, '[]');
      // The keys of the users are not prefixed by the application.
      const keyPrefix = fieldError.objectName === 'userManagement' ? 'userManagement' : `jhipsterApp.${fieldError.objectName}`;
      const labelKey = `${keyPrefix}.${convertedField}`;
      const label: string = this.translateService.instant(labelKey);
      // Without the translation of its label, the field is named as the server names it.
      const fieldName = label === `${translationNotFoundMessage}[${labelKey}]` ? convertedField : label;
      // Without the translation of its code, the error shows the field and the message of the server.
      this.addErrorAlert(`${fieldName}: ${fieldError.message}`, `error.${errorKey}`, { fieldName });
    }
  }
}
