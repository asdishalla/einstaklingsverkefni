import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import TasksPage from "./pages/TasksPage";
import HabitsPage from "./pages/HabitsPage";
import CalendarPage from "./pages/CalendarPage";
import "./styles/app.css";

function App() {
  return (
    <div className="app-container">
      <h1>Skipuleggi</h1>
      <Navigation />

      <main className="content">
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/venjur" element={<HabitsPage />} />
          <Route path="/dagatal" element={<CalendarPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
