import { describe, expect, it } from 'vitest';

import routes from './admin.routes';

describe('Admin routes', () => {
  it('should load the component or the children of each route', async () => {
    for (const route of routes) {
      expect(await (route.loadComponent ?? route.loadChildren)!()).toBeTruthy();
    }
  });
});
