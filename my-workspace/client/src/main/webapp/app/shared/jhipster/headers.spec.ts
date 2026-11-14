import { describe, expect, it } from 'vitest';

import { MESSAGE_ALERT_HEADER_NAME, MESSAGE_ERROR_HEADER_NAME, MESSAGE_PARAM_HEADER_NAME } from './constants';
import { getMessageFromHeaders } from './headers';

describe('getMessageFromHeaders', () => {
  it('should read the messages and the decoded parameter of the headers', () => {
    expect(
      getMessageFromHeaders({
        [MESSAGE_ALERT_HEADER_NAME]: ['app.entity.created'],
        [MESSAGE_ERROR_HEADER_NAME]: 'An error',
        [MESSAGE_PARAM_HEADER_NAME]: 'a+param%21',
      }),
    ).toEqual({
      alert: 'app.entity.created',
      alertKey: 'app.entity.created',
      alertMessage: undefined,
      error: 'An error',
      errorKey: undefined,
      errorMessage: 'An error',
      param: 'a param!',
    });
  });

  it('should tell a message from a key', () => {
    expect(getMessageFromHeaders({ [MESSAGE_ALERT_HEADER_NAME]: 'An alert', [MESSAGE_ERROR_HEADER_NAME]: 'app.error' })).toMatchObject({
      alertKey: undefined,
      alertMessage: 'An alert',
      errorKey: 'app.error',
      errorMessage: undefined,
    });
  });

  it('should reject several values or a value that is not a string', () => {
    expect(() => getMessageFromHeaders({ [MESSAGE_ALERT_HEADER_NAME]: ['a', 'b'] })).toThrow('Multiple header values found');
    expect(() => getMessageFromHeaders({ [MESSAGE_ALERT_HEADER_NAME]: 1 })).toThrow('Header value is not a string');
  });
});
