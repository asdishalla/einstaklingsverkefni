export type List = {
  id: number;
  name: string;
  createdAt: string;
};

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  dueDate: string | null;
  createdAt: string;
  listId: number;
  list?: List;
};

export type HabitDay = {
  id: number;
  dayOfWeek: string;
  habitId: number;
};

export type HabitCompletion = {
  id: number;
  completedDate: string;
  habitId: number;
};

export type Habit = {
  id: number;
  name: string;
  timeOfDay: string;
  createdAt: string;
  days: HabitDay[];
  completions: HabitCompletion[];
  streak: number;
};