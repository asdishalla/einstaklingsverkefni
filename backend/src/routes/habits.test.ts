import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Hono } from 'hono';

const { prismaMock } = vi.hoisted(() => ({
  prismaMock: {
    habit: {
      findMany: vi.fn(),
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    habitCompletion: {
      findFirst: vi.fn(),
      create: vi.fn(),
    },
  },
}));

vi.mock('../prisma.js', () => ({
  prisma: prismaMock,
}));

import { habitsRoutes } from './habits.js';

describe('habits routes', () => {
  const app = new Hono();
  app.route('/habits', habitsRoutes);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('creates a habit with days', async () => {
    prismaMock.habit.create.mockResolvedValue({
      id: 1,
      name: 'Drekka vatn',
      timeOfDay: 'morning',
      createdAt: new Date(),
      days: [
        { id: 1, dayOfWeek: 'Monday', habitId: 1 },
        { id: 2, dayOfWeek: 'Tuesday', habitId: 1 },
      ],
      completions: [],
    });

    const res = await app.request('/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Drekka vatn',
        timeOfDay: 'morning',
        days: ['Monday', 'Tuesday'],
      }),
    });

    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.name).toBe('Drekka vatn');
    expect(prismaMock.habit.create).toHaveBeenCalled();
  });

  it('returns 400 when days are missing', async () => {
    const res = await app.request('/habits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Drekka vatn',
        timeOfDay: 'morning',
        days: [],
      }),
    });

    expect(res.status).toBe(400);
  });

  it('completes a habit for today', async () => {
    prismaMock.habit.findUnique.mockResolvedValue({
      id: 1,
      name: 'Drekka vatn',
    });

    prismaMock.habitCompletion.findFirst.mockResolvedValue(null);

    prismaMock.habitCompletion.create.mockResolvedValue({
      id: 1,
      habitId: 1,
      completedDate: new Date(),
    });

    const res = await app.request('/habits/1/complete', {
      method: 'POST',
    });

    expect(res.status).toBe(201);
    expect(prismaMock.habitCompletion.create).toHaveBeenCalled();
  });
});