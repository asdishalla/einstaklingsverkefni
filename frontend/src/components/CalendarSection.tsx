import { useEffect, useMemo, useState } from "react";
import type { Task } from "../types";
import "../styles/calendar.css";

function getDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTasksForDate(tasks: Task[], date: Date) {
  const key = getDateKey(date);

  return tasks.filter((task) => {
    if (!task.dueDate) return false;
    const taskDate = new Date(task.dueDate);
    return getDateKey(taskDate) === key;
  });
}

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarSection() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  function goToPreviousMonth() {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1),
    );
  }

  function goToNextMonth() {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1),
    );
  }

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("http://localhost:3000/tasks");
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching calendar tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);

    const startDayIndex = firstDayOfMonth.getDay();
    const numberOfDays = lastDayOfMonth.getDate();

    const days: (Date | null)[] = [];

    for (let i = 0; i < startDayIndex; i++) {
      days.push(null);
    }

    for (let day = 1; day <= numberOfDays; day++) {
      days.push(new Date(currentYear, currentMonth, day));
    }

    return days;
  }, [currentYear, currentMonth]);

  return (
    <section className="calendar-section">
      <h2>Dagatal</h2>

      <div className="calendar-topbar">
        <h3 className="calendar-title">
          {currentDate.toLocaleDateString("is-IS", {
            month: "long",
            year: "numeric",
          })}
        </h3>

        <div className="calendar-nav">
          <button type="button" onClick={goToPreviousMonth}>
            ← Fyrri
          </button>
          <button type="button" onClick={goToNextMonth}>
            Næsti →
          </button>
        </div>
      </div>

      {loading && <p>Hleður dagatali...</p>}

      {!loading && (
        <div className="calendar">
          {weekdayLabels.map((label) => (
            <div key={label} className="calendar-header-cell">
              {label}
            </div>
          ))}

          {calendarDays.map((date, index) => {
            if (!date) {
              return (
                <div key={`empty-${index}`} className="calendar-cell empty" />
              );
            }

            const tasksForDay = getTasksForDate(tasks, date);
            const isToday = getDateKey(date) === getDateKey(today);

            return (
              <div
                key={date.toISOString()}
                className={`calendar-cell ${isToday ? "today" : ""}`}
              >
                <div className="calendar-date">{date.getDate()}</div>

                <ul className="calendar-task-list">
                  {tasksForDay.map((task) => (
                    <li
                      key={task.id}
                      className={`calendar-task ${
                        task.completed ? "completed" : ""
                      }`}
                    >
                      {task.title}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
