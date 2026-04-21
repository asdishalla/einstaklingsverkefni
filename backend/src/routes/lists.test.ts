import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    list: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock('../prisma.js', () => ({
  prisma: prismaMock,
}));

import { listsRoutes } from './lists.js';

describe('lists routes', () => {
  const app = new Hono();
  app.route('/lists', listsRoutes);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('gets all lists', async () => {
    prismaMock.list.findMany.mockResolvedValue([
      { id: 1, name: 'Skóli', createdAt: new Date() },
    ]);

    const res = await app.request('/lists');
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(prismaMock.list.findMany).toHaveBeenCalled();
  });

  it('creates a list', async () => {
    prismaMock.list.create.mockResolvedValue({
      id: 1,
      name: 'Heimilið',
      createdAt: new Date(),
    });

    const res = await app.request('/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Heimilið' }),
    });

    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.name).toBe('Heimilið');
    expect(prismaMock.list.create).toHaveBeenCalledWith({
      data: { name: 'Heimilið' },
    });
  });

  it('returns 400 when list name is missing', async () => {
    const res = await app.request('/lists', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
  });
});