import { useEffect, useState } from "react";
import type { Habit } from "../types";
import { API_URL } from "../lib/api";
import "../styles/habits.css";

const dayOptions = [
  "Mánudagur",
  "Þriðjudagur",
  "Miðvikudagur",
  "Fimmtudagur",
  "Föstudagur",
  "Laugardagur",
  "Sunnudagur",
];

const timeLabels: Record<string, string> = {
  morning: "Morgun",
  afternoon: "Síðdegi",
  night: "Kvöld",
};

const icelandicToEnglishDay: Record<string, string> = {
  Mánudagur: "Monday",
  Þriðjudagur: "Tuesday",
  Miðvikudagur: "Wednesday",
  Fimmtudagur: "Thursday",
  Föstudagur: "Friday",
  Laugardagur: "Saturday",
  Sunnudagur: "Sunday",
};

const englishToIcelandicDay: Record<string, string> = {
  Monday: "Mánudagur",
  Tuesday: "Þriðjudagur",
  Wednesday: "Miðvikudagur",
  Thursday: "Fimmtudagur",
  Friday: "Föstudagur",
  Saturday: "Laugardagur",
  Sunday: "Sunnudagur",
};

function isCompletedToday(completions: { completedDate: string }[]) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return completions.some((completion) => {
    const date = new Date(completion.completedDate);
    date.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  });
}

export default function HabitSection() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [newHabitName, setNewHabitName] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("morning");
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchHabits() {
      try {
        const res = await fetch(`${API_URL}/habits`);
        const data = await res.json();
        setHabits(data);
      } catch (error) {
        console.error("Error fetching habits:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchHabits();
  }, []);

  function handleStartEdit(habit: Habit) {
    setEditingHabitId(habit.id);
    setNewHabitName(habit.name);
    setTimeOfDay(habit.timeOfDay);
    setSelectedDays(
      habit.days.map(
        (day) => englishToIcelandicDay[day.dayOfWeek] ?? day.dayOfWeek,
      ),
    );
  }

  function handleToggleDay(day: string) {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }

  async function handleDeleteHabit(habitId: number) {
    try {
      await fetch(`${API_URL}/habits/${habitId}`, {
        method: "DELETE",
      });

      setHabits((prev) => prev.filter((habit) => habit.id !== habitId));

      if (editingHabitId === habitId) {
        setEditingHabitId(null);
        setNewHabitName("");
        setTimeOfDay("morning");
        setSelectedDays([]);
      }
    } catch (error) {
      console.error("Error deleting habit:", error);
    }
  }

  async function handleAddHabit(e: React.FormEvent) {
    e.preventDefault();

    if (!newHabitName.trim() || selectedDays.length === 0) return;

    const daysForBackend = selectedDays.map(
      (day) => icelandicToEnglishDay[day] ?? day,
    );

    try {
      if (editingHabitId !== null) {
        const res = await fetch(`${API_URL}/habits/${editingHabitId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newHabitName,
            timeOfDay,
            days: daysForBackend,
          }),
        });

        const updatedHabit: Habit = await res.json();

        setHabits((prev) =>
          prev.map((habit) =>
            habit.id === updatedHabit.id ? updatedHabit : habit,
          ),
        );

        setEditingHabitId(null);
      } else {
        const res = await fetch(`${API_URL}/habits`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: newHabitName,
            timeOfDay,
            days: daysForBackend,
          }),
        });

        const createdHabit: Habit = await res.json();

        setHabits((prev) => [createdHabit, ...prev]);
      }

      setNewHabitName("");
      setTimeOfDay("morning");
      setSelectedDays([]);
    } catch (error) {
      console.error("Error saving habit:", error);
    }
  }

  async function handleCompleteHabit(habitId: number) {
    try {
      const res = await fetch(`${API_URL}/habits/${habitId}/complete`, {
        method: "POST",
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Error completing habit:", errorData);
        return;
      }

      const habitsRes = await fetch(`${API_URL}/habits`);
      const updatedHabits = await habitsRes.json();
      setHabits(updatedHabits);
    } catch (error) {
      console.error("Error completing habit:", error);
    }
  }

  const todayName = new Date().toLocaleDateString("en-US", {
    weekday: "long",
  });

  const todaysHabits = habits.filter((habit) =>
    habit.days.some((day) => day.dayOfWeek === todayName),
  );

  return (
    <section className="habit-section">
      <h2>Venjur</h2>

      <form className="habit-form" onSubmit={handleAddHabit}>
        <input
          type="text"
          placeholder="Ný venja"
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
        />

        <select
          value={timeOfDay}
          onChange={(e) => setTimeOfDay(e.target.value)}
        >
          <option value="morning">Morgun</option>
          <option value="afternoon">Síðdegi</option>
          <option value="night">Kvöld</option>
        </select>

        <div className="habit-day-options">
          {dayOptions.map((day) => (
            <label key={day} className="habit-day-option">
              <input
                type="checkbox"
                checked={selectedDays.includes(day)}
                onChange={() => handleToggleDay(day)}
              />
              {day}
            </label>
          ))}
        </div>

        <div className="habit-form-actions">
          <button type="submit">
            {editingHabitId !== null ? "Vista breytingar" : "Bæta við venju"}
          </button>

          {editingHabitId !== null && (
            <button
              type="button"
              onClick={() => {
                setEditingHabitId(null);
                setNewHabitName("");
                setTimeOfDay("morning");
                setSelectedDays([]);
              }}
            >
              Hætta við
            </button>
          )}
        </div>
      </form>

      <div className="habit-group">
        <h3>Venjur dagsins</h3>

        {todaysHabits.length === 0 && <p>Engar venjur áætlaðar í dag.</p>}

        {todaysHabits.length > 0 && (
          <ul className="habit-list">
            {todaysHabits.map((habit) => {
              const completedToday = isCompletedToday(habit.completions);

              return (
                <li
                  key={habit.id}
                  className={`habit-item ${completedToday ? "completed" : ""}`}
                >
                  <div className="habit-main">
                    <div className="habit-name">
                      <strong>{habit.name}</strong>
                    </div>
                    <div className="habit-meta">
                      {timeLabels[habit.timeOfDay] ?? habit.timeOfDay}
                    </div>
                    <div className="habit-meta">Streak: {habit.streak}</div>
                  </div>

                  <div className="habit-actions">
                    <button
                      type="button"
                      onClick={() => handleCompleteHabit(habit.id)}
                      disabled={completedToday}
                    >
                      {completedToday ? "✔ Búið" : "Búið í dag"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {loading && <p>Hleður venjum...</p>}

      {!loading && habits.length === 0 && <p>Engar venjur enn.</p>}

      <div className="habit-group">
        <h3>Allar venjur</h3>
        <ul className="habit-list">
          {habits.map((habit) => {
            const completedToday = isCompletedToday(habit.completions);

            return (
              <li
                key={habit.id}
                className={`habit-item ${completedToday ? "completed" : ""}`}
              >
                <div className="habit-main">
                  <div className="habit-name">
                    <strong>{habit.name}</strong>
                  </div>
                  <div className="habit-meta">
                    {timeLabels[habit.timeOfDay] ?? habit.timeOfDay}
                  </div>
                  <div className="habit-meta">
                    Dagar:{" "}
                    {habit.days
                      .map(
                        (day) =>
                          englishToIcelandicDay[day.dayOfWeek] ?? day.dayOfWeek,
                      )
                      .join(", ")}
                  </div>
                  <div className="habit-meta">Streak: {habit.streak}</div>
                </div>

                <div className="habit-actions">
                  <button
                    type="button"
                    onClick={() => handleCompleteHabit(habit.id)}
                    disabled={completedToday}
                  >
                    {completedToday ? "✔ Búið" : "Búið í dag"}
                  </button>
                  <button type="button" onClick={() => handleStartEdit(habit)}>
                    Breyta
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteHabit(habit.id)}
                  >
                    Eyða
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
