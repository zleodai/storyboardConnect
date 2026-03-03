import { describe, expect, it } from 'vitest';
import handler from './health';

describe('health handler', () => {
  it('returns ok', async () => {
    const response = await handler(new Request('https://example.com/api/health'));

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: 'ok' });
  });
});
