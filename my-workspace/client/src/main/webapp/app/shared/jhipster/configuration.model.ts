import { type Label } from './label';

/** A property of a row. */
export interface ConfigurationProperty {
  key: string;
  value: string;
}

/** A row of a table of the configuration page: a value, or properties. */
export interface ConfigurationRow {
  key: string;
  value?: string;
  properties?: ConfigurationProperty[];
}

/** A table of the configuration page, with its texts. */
export interface ConfigurationSection {
  label: Label;
  columns: [Label, Label];
  rows: ConfigurationRow[];
}
