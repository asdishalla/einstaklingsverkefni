import { Hono } from 'hono';
import { prisma } from '../prisma.js';

export const tasksRoutes = new Hono();

tasksRoutes.get('/', async (c) => {
  const tasks = await prisma.task.findMany({
    include: {
      list: true,
    },
    orderBy: { createdAt: 'desc' },
  });

  return c.json(tasks);
});

tasksRoutes.post('/', async (c) => {
  const body = (await c.req.json()) as {
    title?: string;
    listId?: number;
    dueDate?: string;
  };

  const { title, listId, dueDate } = body;

  if (!title || typeof title !== 'string') {
    return c.json({ error: 'Title is required' }, 400);
  }

  if (!listId || typeof listId !== 'number') {
    return c.json({ error: 'listId is required and must be a number' }, 400);
  }

  const list = await prisma.list.findUnique({
    where: { id: listId },
  });

  if (!list) {
    return c.json({ error: 'List not found' }, 404);
  }

  const newTask = await prisma.task.create({
    data: {
      title,
      listId,
      dueDate: dueDate ? new Date(dueDate) : null,
    },
  });

  return c.json(newTask, 201);
});

tasksRoutes.patch('/:id', async (c) => {
  const id = Number(c.req.param('id'));

  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid task id' }, 400);
  }

  const body = (await c.req.json()) as {
    title?: string;
    completed?: boolean;
    dueDate?: string | null;
  };

  const existingTask = await prisma.task.findUnique({
    where: { id },
  });

  if (!existingTask) {
    return c.json({ error: 'Task not found' }, 404);
  }

  const updatedTask = await prisma.task.update({
    where: { id },
    data: {
      title: body.title ?? existingTask.title,
      completed: body.completed ?? existingTask.completed,
      dueDate:
        body.dueDate === undefined
          ? existingTask.dueDate
          : body.dueDate === null
            ? null
            : new Date(body.dueDate),
    },
  });

  return c.json(updatedTask);
});

tasksRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));

  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid task id' }, 400);
  }

  const existingTask = await prisma.task.findUnique({
    where: { id },
  });

  if (!existingTask) {
    return c.json({ error: 'Task not found' }, 404);
  }

  await prisma.task.delete({
    where: { id },
  });

  return c.json({ message: 'Task deleted' });
});