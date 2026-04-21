import { describe, expect, it } from 'vitest';
import { calculateStreak } from './streak.js';

function daysAgo(n: number) {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - n);
  return date;
}

describe('calculateStreak', () => {
  it('returns 0 when there are no completions', () => {
    expect(calculateStreak([], [{ dayOfWeek: 'Monday' }])).toBe(0);
  });

  it('returns 0 when there are no scheduled days', () => {
    expect(
      calculateStreak([{ completedDate: daysAgo(0) }], []),
    ).toBe(0);
  });

  it('returns 2 when completed on two consecutive scheduled days', () => {
    expect(
      calculateStreak(
        [
          { completedDate: daysAgo(0) },
          { completedDate: daysAgo(1) },
        ],
        [
          { dayOfWeek: 'Monday' },
          { dayOfWeek: 'Tuesday' },
          { dayOfWeek: 'Wednesday' },
          { dayOfWeek: 'Thursday' },
          { dayOfWeek: 'Friday' },
          { dayOfWeek: 'Saturday' },
          { dayOfWeek: 'Sunday' },
        ],
      ),
    ).toBe(2);
  });

  it('returns 0 when the last completion was before the latest scheduled day', () => {
    expect(
      calculateStreak(
        [{ completedDate: daysAgo(3) }],
        [
          { dayOfWeek: 'Monday' },
          { dayOfWeek: 'Tuesday' },
          { dayOfWeek: 'Wednesday' },
          { dayOfWeek: 'Thursday' },
          { dayOfWeek: 'Friday' },
          { dayOfWeek: 'Saturday' },
          { dayOfWeek: 'Sunday' },
        ],
      ),
    ).toBe(0);
  });

  it('does not break streak because of unscheduled days', () => {
    expect(
      calculateStreak(
        [
          { completedDate: daysAgo(0) },
          { completedDate: daysAgo(2) },
        ],
        [
          { dayOfWeek: new Date(daysAgo(0)).toLocaleDateString('en-US', { weekday: 'long' }) },
          { dayOfWeek: new Date(daysAgo(2)).toLocaleDateString('en-US', { weekday: 'long' }) },
        ],
      ),
    ).toBe(2);
  });
});