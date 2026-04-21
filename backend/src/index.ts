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

serve({
  fetch: app.fetch,
  port: 3000,
});

console.log('Server running on http://localhost:3000');