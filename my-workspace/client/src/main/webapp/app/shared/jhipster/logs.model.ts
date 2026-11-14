export type Level = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'OFF';

/** A row of the logs page. */
export interface Log {
  name: string;
  level: Level;
}
