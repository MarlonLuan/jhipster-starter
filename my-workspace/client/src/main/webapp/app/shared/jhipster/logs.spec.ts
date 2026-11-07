import { describe, expect, it } from 'vitest';

import { toLogs } from './logs';

describe('logs', () => {
  describe('toLogs', () => {
    it('should convert the loggers using their effective level', () => {
      const logs = toLogs({
        levels: ['INFO', 'WARN'],
        loggers: { ROOT: { configuredLevel: 'INFO', effectiveLevel: 'INFO' }, main: { configuredLevel: null, effectiveLevel: 'WARN' } },
      });

      expect(logs).toEqual([
        { name: 'ROOT', level: 'INFO' },
        { name: 'main', level: 'WARN' },
      ]);
    });
  });
});
