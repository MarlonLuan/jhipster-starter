import { describe, expect, it } from 'vitest';
import { TestBed } from '@angular/core/testing';

import Docs from './docs';

describe('Docs', () => {
  it('should render the API documentation', async () => {
    const fixture = TestBed.createComponent(Docs);
    await fixture.whenStable();

    expect((fixture.nativeElement as HTMLElement).querySelector('iframe')?.getAttribute('src')).toBe('swagger-ui/index.html');
  });
});
