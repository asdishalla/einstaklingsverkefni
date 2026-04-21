import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    task: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    list: {
      findUnique: vi.fn(),
    },
  },
}));

vi.mock('../prisma.js', () => ({
  prisma: prismaMock,
}));

import { tasksRoutes } from './tasks.js';

describe('tasks routes', () => {
  const app = new Hono();
  app.route('/tasks', tasksRoutes);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a task when valid data is sent', async () => {
    prismaMock.list.findUnique.mockResolvedValue({
      id: 1,
      name: 'Skóli',
    });

    prismaMock.task.create.mockResolvedValue({
      id: 1,
      title: 'Klára verkefni',
      completed: false,
      dueDate: null,
      createdAt: new Date(),
      listId: 1,
    });

    const res = await app.request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Klára verkefni',
        listId: 1,
      }),
    });

    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.title).toBe('Klára verkefni');
    expect(prismaMock.task.create).toHaveBeenCalled();
  });

  it('returns 404 if list does not exist', async () => {
    prismaMock.list.findUnique.mockResolvedValue(null);

    const res = await app.request('/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Klára verkefni',
        listId: 999,
      }),
    });

    expect(res.status).toBe(404);
  });

  it('updates a task', async () => {
    prismaMock.task.findUnique.mockResolvedValue({
      id: 1,
      title: 'Gamalt task',
      completed: false,
      dueDate: null,
    });

    prismaMock.task.update.mockResolvedValue({
      id: 1,
      title: 'Nýtt task',
      completed: true,
      dueDate: null,
    });

    const res = await app.request('/tasks/1', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Nýtt task',
        completed: true,
      }),
    });

    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.title).toBe('Nýtt task');
    expect(data.completed).toBe(true);
  });
});