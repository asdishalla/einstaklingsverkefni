import { Hono } from 'hono';
import { prisma } from '../prisma.js';

export const listsRoutes = new Hono();

listsRoutes.get('/', async (c) => {
  const lists = await prisma.list.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return c.json(lists);
});

listsRoutes.post('/', async (c) => {
  const body = (await c.req.json()) as { name?: string };

  if (!body.name || typeof body.name !== 'string') {
    return c.json({ error: 'Name is required' }, 400);
  }

  const list = await prisma.list.create({
    data: { name: body.name },
  });

  return c.json(list, 201);
});

listsRoutes.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'));

  if (Number.isNaN(id)) {
    return c.json({ error: 'Invalid list id' }, 400);
  }

  const existingList = await prisma.list.findUnique({
    where: { id },
  });

  if (!existingList) {
    return c.json({ error: 'List not found' }, 404);
  }

  await prisma.list.delete({
    where: { id },
  });

  return c.json({ message: 'List deleted' });
});