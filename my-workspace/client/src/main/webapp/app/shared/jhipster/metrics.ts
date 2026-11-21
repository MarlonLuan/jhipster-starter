import { type Label } from './label';
import {
  type MetricCell,
  type MetricColumn,
  type MetricDetailFilter,
  type MetricDetailItem,
  type MetricDetails,
  type MetricGauge,
  type MetricItem,
  type MetricStatus,
  type MetricsBlock,
  type MetricsSection,
} from './metrics.model';

export interface JvmMetrics {
  committed: number;
  max: number;
  used: number;
}

export interface MaxMeanCount {
  max: number;
  mean: number;
  count: number;
}

export interface MetricsWithPercentile extends MaxMeanCount {
  '0.0': number;
  '0.5': number;
  '0.75': number;
  '0.95': number;
  '0.99': number;
}

export interface Databases {
  min: { value: number };
  idle: { value: number };
  max: { value: number };
  active: { value: number };
  usage: MetricsWithPercentile;
  acquire: MetricsWithPercentile;
  creation: MetricsWithPercentile;
}

export interface HttpServerRequests {
  all: { count: number };
  percode: Record<string, MaxMeanCount>;
}

export interface CacheMetrics {
  'cache.gets.miss': number;
  'cache.puts': number;
  'cache.gets.hit': number;
  'cache.removals': number;
  'cache.evictions': number;
}

export interface GarbageCollector {
  'jvm.gc.max.data.size': number;
  /** Missing until a first pause of the garbage collector. */
  'jvm.gc.pause'?: MetricsWithPercentile;
  'jvm.gc.memory.promoted': number;
  'jvm.gc.memory.allocated': number;
  classesLoaded: number;
  'jvm.gc.live.data.size': number;
  classesUnloaded: number;
}

export interface ProcessMetrics {
  'system.cpu.usage': number;
  'system.cpu.count': number;
  'system.load.average.1m'?: number;
  'process.cpu.usage': number;
  'process.files.max'?: number;
  'process.files.open'?: number;
  'process.start.time': number;
  'process.uptime': number;
}

/** The response of the metrics endpoint, the groups that the backend has no data for may be empty. */
export interface MetricsResponse {
  jvm: Record<string, JvmMetrics>;
  databases?: Partial<Databases>;
  'http.server.requests'?: HttpServerRequests;
  cache?: Record<string, CacheMetrics>;
  garbageCollector?: GarbageCollector;
  services?: Record<string, Record<string, MaxMeanCount>>;
  processMetrics: ProcessMetrics;
}

export const ThreadState = {
  Runnable: 'RUNNABLE',
  TimedWaiting: 'TIMED_WAITING',
  Waiting: 'WAITING',
  Blocked: 'BLOCKED',
  New: 'NEW',
} as const;

export type ThreadState = (typeof ThreadState)[keyof typeof ThreadState];

/** A frame of the stack trace of a thread. */
export interface StackTrace {
  className: string;
  methodName: string;
  fileName: string;
  lineNumber: number;
}

/** A thread of the thread dump endpoint. */
export interface Thread {
  threadName: string;
  threadId: number;
  threadState: ThreadState;
  blockedTime: number;
  blockedCount: number;
  waitedTime: number;
  waitedCount: number;
  lockName: string | null;
  stackTrace: StackTrace[];
}

/** The response of the thread dump endpoint. */
export interface ThreadDump {
  threads: Thread[];
}

/** The endpoints of the metrics page, their responses are given to `toMetrics` in this order. */
export const metricsEndpoints = ['management/jhimetrics', 'management/threaddump'];

const BYTES_PER_MEGABYTE = 1048576;

const MILLISECONDS_PER_UNIT = {
  year: 31557600000,
  month: 2629746000,
  day: 86400000,
  hour: 3600000,
  minute: 60000,
  second: 1000,
};

/** The language of the page, which is not always the one of the browser. */
const pageLocale = (): string | undefined => {
  try {
    return Intl.getCanonicalLocales(document.documentElement.lang)[0];
  } catch {
    return undefined;
  }
};

const formatNumber = (value: number, maximumFractionDigits = 0): string =>
  new Intl.NumberFormat(pageLocale(), { maximumFractionDigits }).format(Number.isNaN(value) ? 0 : value);

const formatMegabytes = (bytes: number): string => `${formatNumber(bytes / BYTES_PER_MEGABYTE)}M`;

const formatDuration = (milliseconds: number): string => {
  const durations: string[] = [];
  let remaining = milliseconds;
  for (const [unit, millisecondsPerUnit] of Object.entries(MILLISECONDS_PER_UNIT)) {
    const count = Math.floor(remaining / millisecondsPerUnit);
    if (count > 0) {
      durations.push(`${count} ${unit}${count > 1 ? 's' : ''}`);
      remaining %= millisecondsPerUnit;
    }
  }
  return durations.join(' ');
};

const formatDate = (milliseconds: number): string =>
  new Intl.DateTimeFormat(pageLocale(), { dateStyle: 'full', timeStyle: 'medium' }).format(milliseconds);

const toGauge = (value: number, max: number, status: MetricGauge['status'] = 'success'): MetricGauge => {
  const percent = max > 0 ? (100 * value) / max : 0;
  return { percent, text: `${formatNumber(percent)}%`, status };
};

const sortedEntries = <T>(values: Record<string, T>): [string, T][] => Object.entries(values).sort(([a], [b]) => a.localeCompare(b));

const toMemoryItem = ([name, { used, max, committed }]: [string, JvmMetrics]): MetricItem =>
  max === -1
    ? { label: { text: name }, value: formatMegabytes(used) }
    : {
        label: { text: name },
        value: `${formatMegabytes(used)} / ${formatMegabytes(max)}`,
        note: `Committed: ${formatMegabytes(committed)}`,
        gauge: toGauge(used, max),
      };

const threadStatuses: Record<ThreadState, MetricStatus> = {
  RUNNABLE: 'success',
  TIMED_WAITING: 'warning',
  WAITING: 'info',
  BLOCKED: 'danger',
  NEW: 'secondary',
};

const toThreadDetailItem = ({ threadName, threadId, threadState, stackTrace, ...thread }: Thread): MetricDetailItem => ({
  title: `${threadName} (ID ${threadId})`,
  value: threadState,
  status: threadStatuses[threadState],
  lines: stackTrace.map(({ className, methodName, fileName, lineNumber }) => `${className}.${methodName}(${fileName}:${lineNumber})`),
  cells: [
    String(thread.blockedTime),
    String(thread.blockedCount),
    String(thread.waitedTime),
    String(thread.waitedCount),
    thread.lockName ?? '',
  ],
});

const toThreadDetails = (threads: Thread[]): MetricDetails => {
  const toFilter = (label: Label, value: ThreadState): MetricDetailFilter => ({
    label,
    value,
    count: threads.filter(thread => thread.threadState === value).length,
    status: threadStatuses[value],
  });
  return {
    label: { text: 'Threads dump', translationKey: 'metrics.jvm.threads.dump.title' },
    showLines: { text: 'Show Stacktrace', translationKey: 'metrics.jvm.threads.dump.show' },
    hideLines: { text: 'Hide Stacktrace', translationKey: 'metrics.jvm.threads.dump.hide' },
    columns: [
      { text: 'Blocked Time', translationKey: 'metrics.jvm.threads.dump.blockedtime' },
      { text: 'Blocked Count', translationKey: 'metrics.jvm.threads.dump.blockedcount' },
      { text: 'Waited Time', translationKey: 'metrics.jvm.threads.dump.waitedtime' },
      { text: 'Waited Count', translationKey: 'metrics.jvm.threads.dump.waitedcount' },
      { text: 'Lock name', translationKey: 'metrics.jvm.threads.dump.lockname' },
    ],
    filters: [
      { label: { text: 'All', translationKey: 'metrics.jvm.threads.all' }, count: threads.length, status: 'primary' },
      toFilter({ text: 'Runnable', translationKey: 'metrics.jvm.threads.runnable' }, ThreadState.Runnable),
      toFilter({ text: 'Waiting', translationKey: 'metrics.jvm.threads.waiting' }, ThreadState.Waiting),
      toFilter({ text: 'Timed waiting', translationKey: 'metrics.jvm.threads.timedwaiting' }, ThreadState.TimedWaiting),
      toFilter({ text: 'Blocked', translationKey: 'metrics.jvm.threads.blocked' }, ThreadState.Blocked),
    ],
    items: threads.map(toThreadDetailItem),
  };
};

const toThreadsBlock = (threads: Thread[]): MetricsBlock => {
  const count = (threadState: ThreadState): number => threads.filter(thread => thread.threadState === threadState).length;
  const toThreadItem = (label: Label, threadState: ThreadState, status: MetricGauge['status']): MetricItem => ({
    label,
    value: formatNumber(count(threadState)),
    gauge: toGauge(count(threadState), threads.length, status),
  });
  return {
    label: { text: 'Threads', translationKey: 'metrics.jvm.threads.title' },
    items: [
      toThreadItem({ text: 'Runnable', translationKey: 'metrics.jvm.threads.runnable' }, ThreadState.Runnable, 'success'),
      toThreadItem({ text: 'Timed waiting', translationKey: 'metrics.jvm.threads.timedwaiting' }, ThreadState.TimedWaiting, 'warning'),
      toThreadItem({ text: 'Waiting', translationKey: 'metrics.jvm.threads.waiting' }, ThreadState.Waiting, 'warning'),
      toThreadItem({ text: 'Blocked', translationKey: 'metrics.jvm.threads.blocked' }, ThreadState.Blocked, 'danger'),
      { label: { text: 'Total' }, value: formatNumber(threads.length) },
    ],
    details: toThreadDetails(threads),
  };
};

const toSystemBlock = (system: ProcessMetrics): MetricsBlock => {
  const optional = (text: string, value: number | undefined, maximumFractionDigits = 0): MetricItem[] =>
    value === undefined ? [] : [{ label: { text }, value: formatNumber(value, maximumFractionDigits) }];
  const toCpuItem = (text: string, usage: number): MetricItem => ({
    label: { text },
    value: `${formatNumber(100 * usage, 2)} %`,
    gauge: toGauge(usage, 1),
  });
  return {
    label: { text: 'System' },
    items: [
      { label: { text: 'Uptime' }, value: formatDuration(system['process.uptime']) },
      { label: { text: 'Start time' }, value: formatDate(system['process.start.time']) },
      toCpuItem('Process CPU usage', system['process.cpu.usage']),
      toCpuItem('System CPU usage', system['system.cpu.usage']),
      { label: { text: 'System CPU count' }, value: formatNumber(system['system.cpu.count']) },
      ...optional('System 1m Load average', system['system.load.average.1m'], 2),
      ...optional('Process files max', system['process.files.max']),
      ...optional('Process files open', system['process.files.open']),
    ],
  };
};

const percentileColumns: MetricColumn[] = [
  { label: { text: 'Count', translationKey: 'metrics.servicesstats.table.count' }, numeric: true },
  { label: { text: 'Mean', translationKey: 'metrics.servicesstats.table.mean' }, numeric: true },
  { label: { text: 'Min', translationKey: 'metrics.servicesstats.table.min' }, numeric: true },
  { label: { text: 'p50', translationKey: 'metrics.servicesstats.table.p50' }, numeric: true },
  { label: { text: 'p75', translationKey: 'metrics.servicesstats.table.p75' }, numeric: true },
  { label: { text: 'p95', translationKey: 'metrics.servicesstats.table.p95' }, numeric: true },
  { label: { text: 'p99', translationKey: 'metrics.servicesstats.table.p99' }, numeric: true },
  { label: { text: 'Max', translationKey: 'metrics.servicesstats.table.max' }, numeric: true },
];

const toPercentileRow = (name: string, metric: MetricsWithPercentile): MetricCell[] => [
  { text: name },
  { text: formatNumber(metric.count) },
  ...[metric.mean, metric['0.0'], metric['0.5'], metric['0.75'], metric['0.95'], metric['0.99'], metric.max].map(value => ({
    text: formatNumber(value, 3),
  })),
];

const toJvmSection = ({ jvm, processMetrics }: MetricsResponse, threads: Thread[]): MetricsSection => ({
  id: 'jvmMetrics',
  label: { text: 'JVM Metrics', translationKey: 'metrics.jvm.title' },
  blocks: [
    { label: { text: 'Memory', translationKey: 'metrics.jvm.memory.title' }, items: sortedEntries(jvm).map(toMemoryItem) },
    toThreadsBlock(threads),
    toSystemBlock(processMetrics),
  ],
  tables: [],
});

const toGarbageCollectorSection = (garbageCollector: GarbageCollector): MetricsSection => {
  const live = garbageCollector['jvm.gc.live.data.size'];
  const max = garbageCollector['jvm.gc.max.data.size'];
  const promoted = garbageCollector['jvm.gc.memory.promoted'];
  const allocated = garbageCollector['jvm.gc.memory.allocated'];
  const pause = garbageCollector['jvm.gc.pause'];
  return {
    id: 'garbageCollectorMetrics',
    label: { text: 'Garbage collections', translationKey: 'metrics.jvm.gc.title' },
    blocks: [
      {
        items: [
          {
            label: { text: 'GC Live Data Size/GC Max Data Size' },
            value: `${formatMegabytes(live)} / ${formatMegabytes(max)}`,
            gauge: toGauge(live, max),
          },
        ],
      },
      {
        items: [
          {
            label: { text: 'GC Memory Promoted/GC Memory Allocated' },
            value: `${formatMegabytes(promoted)} / ${formatMegabytes(allocated)}`,
            gauge: toGauge(promoted, allocated),
          },
        ],
      },
      {
        items: [
          { label: { text: 'Classes loaded' }, value: formatNumber(garbageCollector.classesLoaded) },
          { label: { text: 'Classes unloaded' }, value: formatNumber(garbageCollector.classesUnloaded) },
        ],
      },
    ],
    tables: [
      {
        columns: [{ label: { text: '' } }, ...percentileColumns],
        rows: pause ? [toPercentileRow('jvm.gc.pause', pause)] : [],
      },
    ],
  };
};

const toRequestsSection = ({ all, percode }: HttpServerRequests): MetricsSection => ({
  id: 'requestMetrics',
  label: { text: 'HTTP requests (time in milliseconds)', translationKey: 'metrics.jvm.http.title' },
  blocks: [],
  tables: [
    {
      columns: [
        { label: { text: 'Code', translationKey: 'metrics.jvm.http.table.code' } },
        { label: { text: 'Count', translationKey: 'metrics.jvm.http.table.count' } },
        { label: { text: 'Mean', translationKey: 'metrics.jvm.http.table.mean' }, numeric: true },
        { label: { text: 'Max', translationKey: 'metrics.jvm.http.table.max' }, numeric: true },
      ],
      rows: sortedEntries(percode).map(([code, { count, mean, max }]) => [
        { text: code },
        { gauge: { ...toGauge(count, all.count), text: formatNumber(count) } },
        { text: formatNumber(mean, 2) },
        { text: formatNumber(max, 2) },
      ]),
    },
  ],
});

const toEndpointsSection = (services: Record<string, Record<string, MaxMeanCount>>): MetricsSection => ({
  id: 'endpointsRequestsMetrics',
  label: { text: 'Endpoints requests (time in milliseconds)' },
  blocks: [],
  tables: [
    {
      columns: [
        { label: { text: 'Method' } },
        { label: { text: 'Endpoint url' } },
        { label: { text: 'Count' }, numeric: true },
        { label: { text: 'Mean' }, numeric: true },
      ],
      rows: sortedEntries(services).flatMap(([url, methods]) =>
        sortedEntries(methods).map(([method, { count, mean }]) => [
          { text: method },
          { text: url },
          { text: formatNumber(count) },
          { text: formatNumber(mean, 3) },
        ]),
      ),
    },
  ],
});

const toCacheRow = (name: string, cache: CacheMetrics): MetricCell[] => {
  const hits = cache['cache.gets.hit'];
  const misses = cache['cache.gets.miss'];
  const gets = hits + misses;
  return [
    { text: name },
    ...[hits, misses, gets, cache['cache.puts'], cache['cache.removals'], cache['cache.evictions']].map(value => ({
      text: formatNumber(value),
    })),
    { text: formatNumber((100 * hits) / gets, 4) },
    { text: formatNumber((100 * misses) / gets, 4) },
  ];
};

const toCacheSection = (cache: Record<string, CacheMetrics>): MetricsSection => ({
  id: 'cacheMetrics',
  label: { text: 'Cache statistics', translationKey: 'metrics.cache.title' },
  blocks: [],
  tables: [
    {
      columns: [
        { label: { text: 'Cache name', translationKey: 'metrics.cache.cachename' } },
        { label: { text: 'Cache Hits', translationKey: 'metrics.cache.hits' }, numeric: true },
        { label: { text: 'Cache Misses', translationKey: 'metrics.cache.misses' }, numeric: true },
        { label: { text: 'Cache Gets', translationKey: 'metrics.cache.gets' }, numeric: true },
        { label: { text: 'Cache Puts', translationKey: 'metrics.cache.puts' }, numeric: true },
        { label: { text: 'Cache Removals', translationKey: 'metrics.cache.removals' }, numeric: true },
        { label: { text: 'Cache Evictions', translationKey: 'metrics.cache.evictions' }, numeric: true },
        { label: { text: 'Cache Hit %', translationKey: 'metrics.cache.hitPercent' }, numeric: true },
        { label: { text: 'Cache Miss %', translationKey: 'metrics.cache.missPercent' }, numeric: true },
      ],
      rows: sortedEntries(cache).map(([name, metrics]) => toCacheRow(name, metrics)),
    },
  ],
});

const toDatasourceSection = ({ active, min, max, idle, acquire, creation, usage }: Databases): MetricsSection => ({
  id: 'datasourceMetrics',
  label: { text: 'DataSource statistics (time in milliseconds)', translationKey: 'metrics.datasource.title' },
  blocks: [
    {
      items: [
        {
          label: { text: 'Connection Pool Usage', translationKey: 'metrics.datasource.usage' },
          value: `active: ${active.value}, min: ${min.value}, max: ${max.value}, idle: ${idle.value}`,
        },
      ],
    },
  ],
  tables: [
    {
      columns: [{ label: { text: 'Pool usage', translationKey: 'metrics.datasource.name' } }, ...percentileColumns],
      rows: [toPercentileRow('Acquire', acquire), toPercentileRow('Creation', creation), toPercentileRow('Usage', usage)],
    },
  ],
});

const isNotEmpty = <T extends object>(value: T | undefined): value is T => Object.keys(value ?? {}).length > 0;

/** Converts the responses of the `metricsEndpoints` to the sections of the metrics page. */
export const toMetrics = (responses: unknown[]): MetricsSection[] => {
  const [metrics, { threads }] = responses as [MetricsResponse, ThreadDump];
  const { garbageCollector, services, cache, databases } = metrics;
  const requests = metrics['http.server.requests'];
  return [
    toJvmSection(metrics, threads),
    ...(isNotEmpty(garbageCollector) ? [toGarbageCollectorSection(garbageCollector)] : []),
    ...(isNotEmpty(requests) ? [toRequestsSection(requests)] : []),
    ...(isNotEmpty(services) ? [toEndpointsSection(services)] : []),
    ...(isNotEmpty(cache) ? [toCacheSection(cache)] : []),
    ...(isNotEmpty(databases) ? [toDatasourceSection(databases as Databases)] : []),
  ];
};
