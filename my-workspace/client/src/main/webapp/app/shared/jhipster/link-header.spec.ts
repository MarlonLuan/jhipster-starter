import { describe, expect, it } from 'vitest';

import { getPageNumberFromLinkHeader, parseLinkHeader } from './link-header';

describe('link header', () => {
  it('should read the pages of the links', () => {
    expect(getPageNumberFromLinkHeader('</api/x?page=1&size=20>; rel="next",</api/x?size=20>; rel="first"')).toEqual({ next: 1 });
  });

  it('should reject an invalid header', () => {
    expect(() => parseLinkHeader('')).toThrow('input must not be of zero length');
    expect(() => parseLinkHeader('</api/x?page=1>')).toThrow('section could not be split on ";"');
  });
});
