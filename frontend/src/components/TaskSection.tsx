import { useEffect, useMemo, useState } from "react";
import type { Task } from "../types";

type TaskSectionProps = {
  selectedListId: number | null;
};

export default function TaskSection({ selectedListId }: TaskSectionProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);

  function handleStartEdit(task: Task) {
    setEditingTaskId(task.id);
    setNewTaskTitle(task.title);
    setNewTaskDueDate(
      task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 16) : "",
    );
  }

  useEffect(() => {
    async function fetchTasks() {
      try {
        const res = await fetch("http://localhost:3000/tasks");
        const data = await res.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    if (selectedListId === null) return [];
    return tasks.filter((task) => task.listId === selectedListId);
  }, [tasks, selectedListId]);

  async function handleAddTask(e: React.FormEvent) {
    e.preventDefault();

    if (!newTaskTitle.trim() || selectedListId === null) return;

    try {
      if (editingTaskId !== null) {
        const res = await fetch(
          `http://localhost:3000/tasks/${editingTaskId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: newTaskTitle,
              dueDate: newTaskDueDate
                ? new Date(newTaskDueDate).toISOString()
                : null,
            }),
          },
        );

        const updatedTask: Task = await res.json();

        setTasks((prev) =>
          prev.map((task) => (task.id === updatedTask.id ? updatedTask : task)),
        );

        setEditingTaskId(null);
      } else {
        const res = await fetch("http://localhost:3000/tasks", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: newTaskTitle,
            listId: selectedListId,
            dueDate: newTaskDueDate
              ? new Date(newTaskDueDate).toISOString()
              : undefined,
          }),
        });

        const createdTask: Task = await res.json();

        setTasks((prev) => [createdTask, ...prev]);
      }

      setNewTaskTitle("");
      setNewTaskDueDate("");
    } catch (error) {
      console.error("Error saving task:", error);
    }
  }

  async function handleToggleCompleted(task: Task) {
    try {
      const res = await fetch(`http://localhost:3000/tasks/${task.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: !task.completed,
        }),
      });

      const updatedTask: Task = await res.json();

      setTasks((prev) =>
        prev.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      );
    } catch (error) {
      console.error("Error updating task:", error);
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      await fetch(`http://localhost:3000/tasks/${taskId}`, {
        method: "DELETE",
      });

      setTasks((prev) => prev.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  }

  return (
    <section>
      <h2>Verkefni</h2>

      {selectedListId === null && <p>Veldu lista til þess að sjá verkefni.</p>}

      {selectedListId !== null && (
        <>
          <form onSubmit={handleAddTask}>
            <input
              type="text"
              placeholder="Nýtt verkefni"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />

            <input
              type="datetime-local"
              value={newTaskDueDate}
              onChange={(e) => setNewTaskDueDate(e.target.value)}
            />

            <button type="submit">
              {editingTaskId !== null
                ? "Vista breytingar"
                : "Bæta við verkefni"}
            </button>

            {editingTaskId !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingTaskId(null);
                  setNewTaskTitle("");
                  setNewTaskDueDate("");
                }}
              >
                Hætta við
              </button>
            )}
          </form>

          {loading && <p>Hleður verkefnum...</p>}

          {!loading && filteredTasks.length === 0 && (
            <p>Engin verkefni á þessum lista ennþá.</p>
          )}

          <ul>
            {filteredTasks.map((task) => (
              <li key={task.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleCompleted(task)}
                  />
                  {task.title}
                </label>

                {task.dueDate && (
                  <span style={{ marginLeft: "0.5rem" }}>
                    ({new Date(task.dueDate).toLocaleString()})
                  </span>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  style={{ marginLeft: "0.75rem" }}
                >
                  Eyða
                </button>

                <button
                  type="button"
                  onClick={() => handleStartEdit(task)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  Breyta
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
