import { describe, expect, it } from 'vitest';

import { CONSTRAINT_VIOLATION_TYPE, INVALID_PASSWORD_TYPE, PROBLEM_WITH_MESSAGE_TYPE } from './error.constants';
import { getServerProblem } from './problem-details';

describe('getServerProblem', () => {
  it('should read a body that is not a problem as none', () => {
    expect(getServerProblem(null)).toBeUndefined();
    expect(getServerProblem(undefined)).toBeUndefined();
    expect(getServerProblem('')).toBeUndefined();
    expect(getServerProblem('Bad request')).toBeUndefined();
    expect(getServerProblem({})).toBeUndefined();
    expect(getServerProblem({ type: 'about:blank', title: 'Not Found' })).toBeUndefined();
  });

  it('should read a problem with a message', () => {
    const data = { type: PROBLEM_WITH_MESSAGE_TYPE, status: 400, message: 'error.idexists', params: 'author' };
    expect(getServerProblem(data)).toEqual(data);
  });

  it('should read a problem of the account as one with a message', () => {
    const data = { type: INVALID_PASSWORD_TYPE, status: 400, title: 'Incorrect password', message: 'error.http.400' };
    expect(getServerProblem(data)).toEqual(data);
  });

  it('should read the field errors of a constraint violation', () => {
    const fieldError = { objectName: 'author', field: 'name', message: 'must not be null', code: 'NotNull' };
    const data = {
      type: CONSTRAINT_VIOLATION_TYPE,
      status: 400,
      message: 'error.validation',
      fieldErrors: [fieldError, null, { field: 'name' }],
    };
    expect(getServerProblem(data)).toEqual({ ...data, fieldErrors: [fieldError] });
  });

  it('should not read a constraint violation without field errors', () => {
    expect(getServerProblem({ type: CONSTRAINT_VIOLATION_TYPE, status: 400, message: 'error.validation' })).toBeUndefined();
  });
});
