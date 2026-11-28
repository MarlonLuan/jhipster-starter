import { describe, expect, it } from 'vitest';

import { buildSortParam, parsePageParam, parseSortParam } from './pagination';

describe('pagination', () => {
  describe('parseSortParam', () => {
    it('should read the predicate and the order', () => {
      expect(parseSortParam('name,desc')).toEqual({ predicate: 'name', order: 'desc' });
      expect(parseSortParam('name,asc')).toEqual({ predicate: 'name', order: 'asc' });
    });

    it('should read an unknown order as ascending', () => {
      expect(parseSortParam('name,')).toEqual({ predicate: 'name', order: 'asc' });
    });

    it('should read a predicate without an order', () => {
      expect(parseSortParam('name')).toEqual({ predicate: 'name' });
    });

    it('should read no predicate', () => {
      expect(parseSortParam(undefined)).toEqual({});
      expect(parseSortParam('')).toEqual({});
      expect(parseSortParam(',desc')).toEqual({});
    });
  });

  describe('buildSortParam', () => {
    it('should write the predicate and the order, then the fallback', () => {
      expect(buildSortParam({ predicate: 'name', order: 'desc' }, 'id')).toEqual(['name,desc', 'id,asc']);
    });

    it('should not repeat the fallback', () => {
      expect(buildSortParam({ predicate: 'id', order: 'desc' }, 'id')).toEqual(['id,desc']);
    });

    it('should write only the fallback without an order', () => {
      expect(buildSortParam({ predicate: 'name' }, 'id')).toEqual(['id,asc']);
      expect(buildSortParam({})).toEqual([]);
    });
  });

  describe('parsePageParam', () => {
    it('should read a positive page', () => {
      expect(parsePageParam('3')).toBe(3);
    });

    it('should read the first page otherwise', () => {
      expect(parsePageParam(undefined)).toBe(1);
      expect(parsePageParam('0')).toBe(1);
      expect(parsePageParam('-2')).toBe(1);
      expect(parsePageParam('1.5')).toBe(1);
      expect(parsePageParam('x')).toBe(1);
    });
  });
});
