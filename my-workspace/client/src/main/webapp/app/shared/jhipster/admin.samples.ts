/** Responses of the backend for the specs of the admin screens. */
const percentiles = { count: 2, mean: 1, max: 3, '0.0': 0, '0.5': 1, '0.75': 2, '0.95': 3, '0.99': 3 };

export const configurationResponses: unknown[] = [
  { contexts: { application: { beans: { bean: { prefix: 'jhipster', properties: { name: 'app' } } } } } },
  { propertySources: [{ name: 'server.ports', properties: { 'local.server.port': { value: '8080' } } }] },
];

export const healthResponse = { status: 'UP', components: { db: { status: 'UP' }, ping: { status: 'UP' } } };

export const loggersResponse = {
  levels: ['INFO', 'WARN'],
  loggers: { ROOT: { configuredLevel: 'INFO', effectiveLevel: 'INFO' } },
};

export const metricsResponses: unknown[] = [
  {
    jvm: { 'G1 Old Gen': { committed: 1048576, max: 4194304, used: 2097152 } },
    garbageCollector: {
      'jvm.gc.max.data.size': 4194304,
      'jvm.gc.live.data.size': 2097152,
      'jvm.gc.memory.promoted': 1048576,
      'jvm.gc.memory.allocated': 2097152,
      'jvm.gc.pause': percentiles,
      classesLoaded: 10,
      classesUnloaded: 1,
    },
    'http.server.requests': { all: { count: 1 }, percode: { 200: { count: 1, mean: 2, max: 3 } } },
    processMetrics: {
      'system.cpu.usage': 0.5,
      'system.cpu.count': 8,
      'process.cpu.usage': 0.25,
      'process.start.time': 0,
      'process.uptime': 1000,
    },
  },
  {
    threads: [
      {
        threadName: 'main',
        threadId: 1,
        threadState: 'RUNNABLE',
        blockedTime: -1,
        blockedCount: 0,
        waitedTime: -1,
        waitedCount: 0,
        lockName: null,
        stackTrace: [{ className: 'Foo', methodName: 'bar', fileName: 'Foo.java', lineNumber: 1 }],
      },
    ],
  },
];
