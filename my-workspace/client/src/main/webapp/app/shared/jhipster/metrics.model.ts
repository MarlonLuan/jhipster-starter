import { type Label } from './label';

export type MetricStatus = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger';

/** A progress bar of the metrics page. */
export interface MetricGauge {
  percent: number;
  text: string;
  status: MetricStatus;
}

/** A line of a block, with its value and progress bar. */
export interface MetricItem {
  label: Label;
  value?: string;
  note?: string;
  gauge?: MetricGauge;
}

/** A filter of the details of a block, without a value it keeps all the items. */
export interface MetricDetailFilter {
  label: Label;
  value?: string;
  count: number;
  status: MetricStatus;
}

/** An item of the details of a block. */
export interface MetricDetailItem {
  title: string;
  /** The value the filters compare, shown in a badge. */
  value: string;
  status: MetricStatus;
  /** The lines shown on demand. */
  lines: string[];
  /** The values of the columns of the details. */
  cells: string[];
}

/** What a block has to show in a modal. */
export interface MetricDetails {
  label: Label;
  showLines: Label;
  hideLines: Label;
  columns: Label[];
  filters: MetricDetailFilter[];
  items: MetricDetailItem[];
}

/** A column of the blocks of a section. */
export interface MetricsBlock {
  label?: Label;
  items: MetricItem[];
  details?: MetricDetails;
}

export interface MetricColumn {
  label: Label;
  numeric?: boolean;
}

export interface MetricCell {
  text?: string;
  gauge?: MetricGauge;
}

export interface MetricsTable {
  columns: MetricColumn[];
  rows: MetricCell[][];
}

/** A section of the metrics page, with its texts. */
export interface MetricsSection {
  id: string;
  label: Label;
  blocks: MetricsBlock[];
  tables: MetricsTable[];
}
