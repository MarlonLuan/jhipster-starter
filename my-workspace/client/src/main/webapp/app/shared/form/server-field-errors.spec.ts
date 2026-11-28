import { describe, expect, it } from 'vitest';
import { HttpErrorResponse } from '@angular/common/http';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FieldTree, form } from '@angular/forms/signals';

import { EMPTY, of, throwError } from 'rxjs';

import { CONSTRAINT_VIOLATION_TYPE, PROBLEM_WITH_MESSAGE_TYPE } from 'app/shared/jhipster/error.constants';

import { getServerFieldErrors, toSubmissionResult } from './server-field-errors';

const createNameForm = (): FieldTree<{ name: string; createdBy: string }> =>
  TestBed.runInInjectionContext(() => form(signal({ name: '', createdBy: '' })));

const constraintViolation = (...fieldErrors: unknown[]): HttpErrorResponse =>
  new HttpErrorResponse({
    status: 400,
    error: { type: CONSTRAINT_VIOLATION_TYPE, message: 'error.validation', fieldErrors },
  });

describe('getServerFieldErrors', () => {
  it('should mark the given fields the server refused', () => {
    const nameForm = createNameForm();

    const result = getServerFieldErrors(
      nameForm,
      ['name'],
      constraintViolation({ objectName: 'nameModel', field: 'name', message: 'is refused', code: 'Refused' }),
    );

    expect(result).toEqual([{ kind: 'server', message: 'is refused', fieldTree: nameForm.name }]);
  });

  it('should not mark the fields that are not given nor the unknown ones', () => {
    const nameForm = createNameForm();

    const result = getServerFieldErrors(
      nameForm,
      ['name'],
      constraintViolation(
        { objectName: 'nameModel', field: 'createdBy', message: 'is refused', code: 'Refused' },
        { objectName: 'nameModel', field: 'notAField', message: 'is refused', code: 'Refused' },
      ),
    );

    expect(result).toEqual([]);
  });

  it('should mark no field for an error without field errors', () => {
    const result = getServerFieldErrors(
      createNameForm(),
      ['name'],
      new HttpErrorResponse({ status: 400, error: { type: PROBLEM_WITH_MESSAGE_TYPE, message: 'error.http.400' } }),
    );

    expect(result).toBeUndefined();
  });

  it('should mark no field for an error that is not of http', () => {
    expect(getServerFieldErrors(createNameForm(), ['name'], new Error('failure'))).toBeUndefined();
  });
});

describe('toSubmissionResult', () => {
  it('should give no error for a request that succeeds', async () => {
    expect(await toSubmissionResult(createNameForm(), ['name'], of({ name: 'saved' }))).toBeUndefined();
  });

  it('should give the errors of the given fields the server refused', async () => {
    const nameForm = createNameForm();

    const result = await toSubmissionResult(
      nameForm,
      ['name'],
      throwError(() => constraintViolation({ objectName: 'nameModel', field: 'name', message: 'is refused', code: 'Refused' })),
    );

    expect(result).toEqual([{ kind: 'server', message: 'is refused', fieldTree: nameForm.name }]);
  });

  it('should give no error for a request that completes without a value', async () => {
    expect(await toSubmissionResult(createNameForm(), ['name'], EMPTY)).toBeUndefined();
  });
});
