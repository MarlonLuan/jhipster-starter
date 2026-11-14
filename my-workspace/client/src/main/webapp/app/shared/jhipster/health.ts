import { type HealthCheck } from './health.model';
import { type Label } from './label';

/** A component of the response of the health endpoint, named by the backend. */
export interface HealthComponent {
  status: string;
  details?: Record<string, unknown>;
  components?: Record<string, HealthComponent>;
}

/** The response of the health endpoint. */
export interface HealthResponse {
  status: string;
  components?: Record<string, HealthComponent>;
}

/** The endpoint of the health page, the response of an unhealthy application comes with the status 503. */
export const healthEndpoint = 'management/health';

const readableValue = (value: unknown): string => (typeof value === 'string' ? value : JSON.stringify(value));

const readableBytes = (value: unknown): string => {
  if (typeof value !== 'number') {
    return readableValue(value);
  }
  const gigabytes = value / 1073741824;
  return gigabytes > 1 ? `${gigabytes.toFixed(2)} GB` : `${(value / 1048576).toFixed(2)} MB`;
};

/** The components whose details are not shown as they came, by base name. */
const detailFormatters: Record<string, (value: unknown) => string> = {
  diskSpace: readableBytes,
};

const toIndicatorLabel = (text: string): Label => ({ text, translationKey: `health.indicator.${text}` });
const toStatusLabel = (text: string): Label => ({ text, translationKey: `health.status.${text}` });

const toHealthCheck = (id: string, { status, details: { error, ...details } = {} }: HealthComponent): HealthCheck => {
  const [baseName, ...subSystem] = id.split('.');
  const format = detailFormatters[baseName] ?? readableValue;
  const entries = Object.entries(details);
  return {
    id,
    label: toIndicatorLabel(baseName),
    ...(subSystem.length > 0 ? { sublabel: subSystem.join('.') } : {}),
    status: toStatusLabel(status),
    healthy: status === 'UP',
    ...(error === undefined ? {} : { error: readableValue(error) }),
    ...(entries.length > 0 ? { details: entries.map(([key, value]) => ({ key, value: format(value) })) } : {}),
  };
};

const toChecks = (components: Record<string, HealthComponent> = {}, path?: string): HealthCheck[] =>
  Object.entries(components).flatMap(([key, component]) => {
    const id = path ? `${path}.${key}` : key;
    const check = toHealthCheck(id, component);
    const children = toChecks(component.components, id);
    // A component with sub-components is a row only when it has something to tell.
    return children.length === 0 || check.details || check.error ? [check, ...children] : children;
  });

/** Converts the response of the health endpoint to the rows of the health page. */
export const toHealthChecks = (response: unknown): HealthCheck[] => toChecks((response as HealthResponse).components);
