import { beforeEach, describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import 'app/config/dayjs';

import DurationPipe from './duration.pipe';

describe('DurationPipe', () => {
  let durationPipe: DurationPipe;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [DurationPipe] });
    durationPipe = TestBed.inject(DurationPipe);
  });

  it('should return an empty string without a duration', () => {
    expect(durationPipe.transform(undefined)).toBe('');
  });

  it('should humanize a duration', () => {
    expect(durationPipe.transform(60000)).toBe('a minute');
  });
});
