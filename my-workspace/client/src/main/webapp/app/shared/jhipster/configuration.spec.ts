import { describe, expect, it } from 'vitest';

import { toConfiguration } from './configuration';

describe('configuration', () => {
  describe('toConfiguration', () => {
    it('should give the beans of the contexts ordered by prefix, with their texts', () => {
      const [section] = toConfiguration([
        {
          contexts: {
            bootstrap: { beans: { a: { prefix: 'b', properties: { key: 'value' } } } },
            jhipster: { beans: { b: { prefix: 'a', properties: { other: 1 } } } },
          },
        },
        { propertySources: [] },
      ]);

      expect(section).toEqual({
        label: expect.any(Object),
        columns: expect.any(Array),
        rows: [
          { key: 'a', properties: [{ key: 'other', value: '1' }] },
          { key: 'b', properties: [{ key: 'key', value: 'value' }] },
        ],
      });
    });

    it('should give the translation keys of the columns of the beans', () => {
      const [section] = toConfiguration([{ contexts: {} }, { propertySources: [] }]);

      expect(section.columns.map(({ translationKey }) => translationKey)).toEqual([
        'configuration.table.prefix',
        'configuration.table.properties',
      ]);
    });

    it('should keep one bean by name', () => {
      const [section] = toConfiguration([
        { contexts: { a: { beans: { bean: { prefix: 'first' } } }, b: { beans: { bean: { prefix: 'last' } } } } },
        { propertySources: [] },
      ]);

      expect(section.rows).toEqual([{ key: 'last', properties: [] }]);
    });

    it('should give a section by property source with readable values', () => {
      const [, section] = toConfiguration([
        { contexts: {} },
        {
          propertySources: [
            { name: 'server.ports', properties: { text: { value: '8080' }, flag: { value: false }, port: { value: 8080 } } },
          ],
        },
      ]);

      expect(section).toEqual({
        label: { text: 'server.ports' },
        columns: expect.any(Array),
        rows: [
          { key: 'text', value: '8080' },
          { key: 'flag', value: 'false' },
          { key: 'port', value: '8080' },
        ],
      });
    });
  });
});
