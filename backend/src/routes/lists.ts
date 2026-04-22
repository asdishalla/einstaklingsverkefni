import { Hono } from 'hono';
import { prisma } from '../prisma.js';

export const listsRoutes = new Hono();

listsRoutes.get('/', async (c) => {
  try {
    const lists = await prisma.list.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return c.json(lists);
  } catch (error) {
    console.error('Error fetching lists:', error);
    return c.json({ error: 'Failed to fetch lists' }, 500);
  }
});

listsRoutes.post('/', async (c) => {
  try {
    const body = (await c.req.json()) as { name?: string };

    if (!body.name || typeof body.name !== 'string') {
      return c.json({ error: 'Name is required' }, 400);
    }

    const list = await prisma.list.create({
      data: { name: body.name },
    });

    return c.json(list, 201);
  } catch (error) {
    console.error('Error creating list:', error);
    return c.json({ error: 'Failed to create list' }, 500);
  }
});

listsRoutes.delete('/:id', async (c) => {
  try {
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
  } catch (error) {
    console.error('Error deleting list:', error);
    return c.json({ error: 'Failed to delete list' }, 500);
  }
});