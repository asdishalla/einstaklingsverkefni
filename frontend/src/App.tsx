import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import TasksPage from "./pages/TasksPage";
import HabitsPage from "./pages/HabitsPage";
import CalendarPage from "./pages/CalendarPage";
import "./styles/App.css";
import TitleManager from "./components/TitleManager";

function App() {
  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Skipuleggi</h1>
        <Navigation />
      </header>

      <main className="content">
        <TitleManager />
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/venjur" element={<HabitsPage />} />
          <Route path="/dagatal" element={<CalendarPage />} />
        </Routes>
      </main>

      <footer className="app-footer">
        <h3 className="app-footer-text">
          Einstaklingsverkefni - Vefforritun 2
        </h3>
      </footer>
    </div>
  );
}

export default App;
