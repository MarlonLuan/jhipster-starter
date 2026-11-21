import { type Label } from './label';

export interface HealthDetail {
  key: string;
  value: string;
}

/** A row of the health page, with its texts. */
export interface HealthCheck {
  id: string;
  label: Label;
  /** What tells apart the checks with the same label, like the name of a datasource. */
  sublabel?: string;
  status: Label;
  healthy: boolean;
  error?: string;
  details?: HealthDetail[];
}
