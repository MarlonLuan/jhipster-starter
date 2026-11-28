import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MissingTranslationHandler, TranslateService, provideTranslateService } from '@ngx-translate/core';

import { missingTranslationHandler } from 'app/config';
import { AlertModel, AlertService, EventManager } from 'app/core/util';
import { MESSAGE_ERROR_HEADER_NAME, MESSAGE_PARAM_HEADER_NAME } from 'app/shared/jhipster/constants';
import { CONSTRAINT_VIOLATION_TYPE, PROBLEM_WITH_MESSAGE_TYPE } from 'app/shared/jhipster/error.constants';

import { AlertError } from './alert-error';

describe('Alert Error Component', () => {
  let comp: AlertError;
  let fixture: ComponentFixture<AlertError>;
  let eventManager: EventManager;
  let alertService: AlertService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideTranslateService({
          missingTranslationHandler: { provide: MissingTranslationHandler, useFactory: missingTranslationHandler },
        }),
        EventManager,
        AlertService,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertError);
    comp = fixture.componentInstance;
    eventManager = TestBed.inject(EventManager);
    alertService = TestBed.inject(AlertService);
    alertService.addAlert = (alert: AlertModel, alerts?: WritableSignal<AlertModel[]>) => {
      alerts?.update(current => [...current, alert]);
      return alert;
    };
  });

  describe('Error Handling', () => {
    it('should display an alert on error events', () => {
      eventManager.broadcast({ name: 'jhipsterApp.error', content: { message: 'Failed', key: 'error.failed' } });

      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.failed');
    });

    it('should display an alert on status 400 for an error message header', () => {
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders().append(MESSAGE_ERROR_HEADER_NAME, 'A foo cannot be created'),
        status: 400,
        error: {},
      });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: response });

      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].message).toBe('A foo cannot be created');
    });

    it('should display an alert on status 400 for an error key header without entity', () => {
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders().append(MESSAGE_ERROR_HEADER_NAME, 'header.error'),
        status: 400,
        error: {},
      });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: response });

      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationParams).toBeUndefined();
    });

    it('should display an alert for each invalid field', () => {
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders(),
        status: 400,
        error: {
          type: CONSTRAINT_VIOLATION_TYPE,
          message: 'error.validation',
          fieldErrors: [{ objectName: 'foo', field: 'items[3].name', message: 'NotNull' }],
        },
      });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: response });

      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.NotNull');
    });

    it('should display an alert on status 0', () => {
      // GIVEN
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: { status: 0 } });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.server.not.reachable');
    });

    it('should display an access denied alert on status 403 without body', () => {
      eventManager.broadcast({
        name: 'jhipsterApp.httpError',
        content: new HttpErrorResponse({ url: 'http://localhost:8080/api/foos', status: 403, error: null }),
      });
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.http.403');
    });

    it('should display the problem of a 403 that has one', () => {
      eventManager.broadcast({
        name: 'jhipsterApp.httpError',
        content: new HttpErrorResponse({
          url: 'http://localhost:8080/api/foos',
          status: 403,
          error: { type: PROBLEM_WITH_MESSAGE_TYPE, message: 'error.ownerOnly', detail: 'Only the owner can edit it' },
        }),
      });
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.ownerOnly');
    });

    it('should leave out the fields the form shows the error of', () => {
      fixture.componentRef.setInput('formFields', ['name']);
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders(),
        status: 400,
        error: {
          type: CONSTRAINT_VIOLATION_TYPE,
          message: 'error.validation',
          fieldErrors: [
            { objectName: 'foo', field: 'name', message: 'NotNull' },
            { objectName: 'foo', field: 'items[3].name', message: 'NotNull' },
          ],
        },
      });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: response });

      expect(comp.alerts().map(alert => alert.message)).toEqual(['items[].name: NotNull']);
    });

    it('should display an alert for an error without body', () => {
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        status: 500,
        statusText: 'Server Error',
        error: null,
      });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: response });
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].message).toBe(response.message);
    });

    it('should name the field of a user by the key of the user management', () => {
      const translateService = TestBed.inject(TranslateService);
      translateService.setTranslation('en', { userManagement: { login: 'Login' } });
      translateService.use('en');
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/admin/users',
        headers: new HttpHeaders(),
        status: 400,
        error: {
          type: CONSTRAINT_VIOLATION_TYPE,
          message: 'error.validation',
          fieldErrors: [{ objectName: 'userManagement', field: 'login', message: 'must not be null', code: 'NotNull' }],
        },
      });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: response });
      expect(comp.alerts()[0].translationParams).toEqual({ fieldName: 'Login' });
    });

    it('should fall back to the field and the message of the server for a field and a code without translation', () => {
      const addAlert = vi.spyOn(alertService, 'addAlert');
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders(),
        status: 400,
        error: {
          type: CONSTRAINT_VIOLATION_TYPE,
          message: 'error.validation',
          fieldErrors: [{ objectName: 'foo', field: 'name', message: 'must match "^[A-Z].*$"', code: 'Pattern' }],
        },
      });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: response });
      expect(addAlert).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'name: must match "^[A-Z].*$"', translationKey: 'error.Pattern' }),
        expect.anything(),
      );
    });

    it('should display an alert on status 404', () => {
      // GIVEN
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: { status: 404 } });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.url.not.found');
    });

    it('should display an alert on generic error', () => {
      // GIVEN
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: { error: { message: 'Error Message' } } });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: { error: 'Second Error Message' } });
      // THEN
      expect(comp.alerts()).toHaveLength(2);
      expect(comp.alerts()[0].translationKey).toBe('Error Message');
      expect(comp.alerts()[1].translationKey).toBe('Second Error Message');
    });

    it('should display an alert on status 400 for generic error', () => {
      // GIVEN
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders(),
        status: 400,
        statusText: 'Bad Request',
        error: {
          type: PROBLEM_WITH_MESSAGE_TYPE,
          title: 'Bad Request',
          status: 400,
          path: '/api/foos',
          message: 'error.validation',
        },
      });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: response });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.validation');
    });

    it('should display an alert on status 400 for generic error without message', () => {
      // GIVEN
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders(),
        status: 400,
        error: 'Bad Request',
      });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: response });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('Bad Request');
    });

    it('should display an alert on status 400 for invalid parameters', () => {
      // GIVEN
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders(),
        status: 400,
        statusText: 'Bad Request',
        error: {
          type: CONSTRAINT_VIOLATION_TYPE,
          title: 'Method argument not valid',
          status: 400,
          path: '/api/foos',
          message: 'error.validation',
          fieldErrors: [{ objectName: 'foo', field: 'minField', message: 'must be greater than or equal to 1', code: 'Min' }],
        },
      });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: response });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.Size');
    });

    it('should display an alert on status 400 for error headers', () => {
      // GIVEN
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders().append(MESSAGE_ERROR_HEADER_NAME, 'header.error').append(MESSAGE_PARAM_HEADER_NAME, 'foo'),
        status: 400,
        statusText: 'Bad Request',
        error: {
          status: 400,
          message: 'error.validation',
        },
      });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: response });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('header.error');
    });

    it('should display an alert on status 500 with detail', () => {
      // GIVEN
      const response = new HttpErrorResponse({
        url: 'http://localhost:8080/api/foos',
        headers: new HttpHeaders(),
        status: 500,
        statusText: 'Internal server error',
        error: {
          status: 500,
          message: 'error.http.500',
          detail: 'Detailed error message',
        },
      });
      eventManager.broadcast({ name: 'jhipsterApp.httpError', content: response });
      // THEN
      expect(comp.alerts()).toHaveLength(1);
      expect(comp.alerts()[0].translationKey).toBe('error.http.500');
    });
  });
});
