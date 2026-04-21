import { Hono } from 'hono';
import { prisma } from '../prisma.js';
import { calculateStreak } from '../utils/streak.js';

export const habitsRoutes = new Hono();

habitsRoutes.get('/', async (c) => {
  const habits = await prisma.habit.findMany({
    include: {
      days: true,
      completions: {
        orderBy: { completedDate: 'desc' },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const habitsWithStreaks = habits.map((habit) => ({
    ...habit,
    streak: calculateStreak(habit.completions, habit.days),
  }));

  return c.json(habitsWithStreaks);
});

habitsRoutes.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'));

  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid habit id' }, 400);
  }

  const body = (await c.req.json()) as {
    name?: string;
    timeOfDay?: string;
    days?: string[];
  };

  const existingHabit = await prisma.habit.findUnique({
    where: { id },
    include: { days: true },
  });

  if (!existingHabit) {
    return c.json({ error: 'Habit not found' }, 404);
  }

  const updatedHabit = await prisma.habit.update({
    where: { id },
    data: {
      name: body.name ?? existingHabit.name,
      timeOfDay: body.timeOfDay ?? existingHabit.timeOfDay,
      days:
        body.days !== undefined
          ? {
              deleteMany: {},
              create: body.days.map((day) => ({
                dayOfWeek: day,
              })),
            }
          : undefined,
    },
    include: {
      days: true,
      completions: {
        orderBy: { completedDate: 'desc' },
      },
    },
  });

  const habitWithStreak = {
    ...updatedHabit,
    streak: calculateStreak(updatedHabit.completions, updatedHabit.days),
  };

  return c.json(habitWithStreak);
});

habitsRoutes.post('/', async (c) => {
  const body = (await c.req.json()) as {
    name?: string;
    timeOfDay?: string;
    days?: string[];
  };

  const { name, timeOfDay, days } = body;

  if (!name || typeof name !== 'string') {
    return c.json({ error: 'Name is required' }, 400);
  }

  if (!timeOfDay || typeof timeOfDay !== 'string') {
    return c.json({ error: 'timeOfDay is required' }, 400);
  }

  if (!Array.isArray(days) || days.length === 0) {
    return c.json({ error: 'days must be a non-empty array' }, 400);
  }

  const newHabit = await prisma.habit.create({
    data: {
      name,
      timeOfDay,
      days: {
        create: days.map((day) => ({
          dayOfWeek: day,
        })),
      },
    },
    include: {
      days: true,
      completions: true,
    },
  });

  return c.json(newHabit, 201);
});

habitsRoutes.post('/:id/complete', async (c) => {
  const id = Number(c.req.param('id'));

  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid habit id' }, 400);
  }

  const existingHabit = await prisma.habit.findUnique({
    where: { id },
  });

  if (!existingHabit) {
    return c.json({ error: 'Habit not found' }, 404);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const existingCompletion = await prisma.habitCompletion.findFirst({
    where: {
      habitId: id,
      completedDate: today,
    },
  });

  if (existingCompletion) {
    return c.json({ error: 'Habit already completed today' }, 400);
  }

  const completion = await prisma.habitCompletion.create({
    data: {
      habitId: id,
      completedDate: today,
    },
  });

  return c.json(completion, 201);
});

habitsRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));

  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid habit id' }, 400);
  }

  const existingHabit = await prisma.habit.findUnique({
    where: { id },
  });

  if (!existingHabit) {
    return c.json({ error: 'Habit not found' }, 404);
  }

  await prisma.habit.delete({
    where: { id },
  });

  return c.json({ message: 'Habit deleted' });
});