import { useState } from "react";
import ListSection from "../components/ListSection";
import TaskSection from "../components/TaskSection";

export default function TasksPage() {
  const [selectedListId, setSelectedListId] = useState<number | null>(null);

  return (
    <div className="tasks-page-layout">
      <ListSection
        selectedListId={selectedListId}
        onSelectList={setSelectedListId}
      />
      <TaskSection selectedListId={selectedListId} />
    </div>
  );
}