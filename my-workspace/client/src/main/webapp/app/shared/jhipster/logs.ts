export type Level = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'OFF';

/** A logger of the loggers endpoint. */
export interface Logger {
  configuredLevel: Level | null;
  effectiveLevel: Level;
}

/** The response of the loggers endpoint. */
export interface LoggersResponse {
  levels: Level[];
  loggers: Record<string, Logger>;
}

/** A row of the logs page. */
export interface Log {
  name: string;
  level: Level;
}

/** Converts the response of the loggers endpoint to the rows of the logs page. */
export const toLogs = ({ loggers }: LoggersResponse): Log[] =>
  Object.entries(loggers).map(([name, { effectiveLevel }]) => ({ name, level: effectiveLevel }));
