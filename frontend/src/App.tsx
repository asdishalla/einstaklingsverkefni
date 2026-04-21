import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import TasksPage from "./pages/TasksPage";
import HabitsPage from "./pages/HabitsPage";
import CalendarPage from "./pages/CalendarPage";
import "./styles/app.css";

function App() {
  return (
    <div className="app">
      <h1>Skipulagsapp</h1>
      <Navigation />

      <Routes>
        <Route path="/" element={<TasksPage />} />
        <Route path="/venjur" element={<HabitsPage />} />
        <Route path="/dagatal" element={<CalendarPage />} />
      </Routes>
    </div>
  );
}

export default App;