// The page and the sort of the entity lists, kept in the query parameters of the route.
export const PAGE_PARAM = 'page';
export const SORT_PARAM = 'sort';

export type SortOrder = 'asc' | 'desc';

export const ASC = 'asc' satisfies SortOrder;
export const DESC = 'desc' satisfies SortOrder;

export const ITEMS_PER_PAGE = 20;

export type SortState = { predicate?: string; order?: SortOrder };

/**
 * The sort state of a sort parameter: `<predicate>,<order>`, or `<predicate>` without an order.
 */
export const parseSortParam = (sortParam: string | null | undefined): SortState => {
  if (!sortParam?.includes(',')) {
    return sortParam ? { predicate: sortParam } : {};
  }
  const [predicate, order] = sortParam.split(',');
  return predicate ? { predicate, order: order === 'desc' ? 'desc' : 'asc' } : {};
};

/**
 * The sort parameters of a sort state, followed by the fallback predicate in ascending order when it differs, for a stable order.
 */
export const buildSortParam = ({ predicate, order }: SortState, fallback?: string): string[] => {
  const sortParam = predicate && order ? [`${predicate},${order}`] : [];
  if (fallback && predicate !== fallback) {
    sortParam.push(`${fallback},asc`);
  }
  return sortParam;
};

/**
 * The page of a page parameter: a positive integer, the first page otherwise.
 */
export const parsePageParam = (pageParam: string | null | undefined): number => {
  const page = Number(pageParam);
  return Number.isInteger(page) && page > 0 ? page : 1;
};
