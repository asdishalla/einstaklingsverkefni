import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { listsRoutes } from './routes/lists.js';
import { tasksRoutes } from './routes/tasks.js';
import { habitsRoutes } from './routes/habits.js';

const app = new Hono();

app.use('*', cors());

app.get('/', (c) => c.text('Planner backend is running'));

app.route('/lists', listsRoutes);
app.route('/tasks', tasksRoutes);
app.route('/habits', habitsRoutes);

const port = Number(process.env.PORT) || 3000;

serve({
  fetch: app.fetch,
  port,
});

console.log(`Server running on http://localhost:${port}`);