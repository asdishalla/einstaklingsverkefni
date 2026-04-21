const englishWeekdays = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

function normalizeDayName(day: string) {
  const normalized = day.trim().toLowerCase();

  const dayMap: Record<string, string> = {
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',

    sunnudagur: 'Sunday',
    mánudagur: 'Monday',
    manudagur: 'Monday',
    þriðjudagur: 'Tuesday',
    thridjudagur: 'Tuesday',
    miðvikudagur: 'Wednesday',
    midvikudagur: 'Wednesday',
    fimmtudagur: 'Thursday',
    föstudagur: 'Friday',
    fostudagur: 'Friday',
    laugardagur: 'Saturday',
  };

  return dayMap[normalized];
}

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getLocalDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function isScheduledDay(date: Date, scheduledDays: Set<string>) {
  const weekday = englishWeekdays[date.getDay()];
  return scheduledDays.has(weekday);
}

function getPreviousScheduledDate(fromDate: Date, scheduledDays: Set<string>) {
  const date = startOfDay(fromDate);

  while (!isScheduledDay(date, scheduledDays)) {
    date.setDate(date.getDate() - 1);
  }

  return date;
}

export function calculateStreak(
  completions: { completedDate: Date }[],
  days: { dayOfWeek: string }[],
) {
  if (completions.length === 0 || days.length === 0) {
    return 0;
  }

  const scheduledDays = new Set(
    days
      .map((day) => normalizeDayName(day.dayOfWeek))
      .filter((day): day is string => Boolean(day)),
  );

  if (scheduledDays.size === 0) {
    return 0;
  }

  const completionKeys = new Set(
    completions.map((completion) =>
      getLocalDateKey(startOfDay(new Date(completion.completedDate))),
    ),
  );

  const today = startOfDay(new Date());
  const latestScheduledDate = getPreviousScheduledDate(today, scheduledDays);

  if (!completionKeys.has(getLocalDateKey(latestScheduledDate))) {
    return 0;
  }

  let streak = 0;
  let currentDate = new Date(latestScheduledDate);

  while (true) {
    const currentKey = getLocalDateKey(currentDate);

    if (!completionKeys.has(currentKey)) {
      break;
    }

    streak++;

    currentDate.setDate(currentDate.getDate() - 1);
    currentDate = getPreviousScheduledDate(currentDate, scheduledDays);
  }

  return streak;
}