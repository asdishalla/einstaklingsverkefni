import { NavLink } from "react-router-dom";
import "../styles/navigation.css";

export default function Navigation() {
  return (
    <nav className="navigation">
      {" "}
      <NavLink to="/" className="nav-link">
        {" "}
        Verkefni{" "}
      </NavLink>{" "}
      <NavLink to="/venjur" className="nav-link">
        {" "}
        Venjur{" "}
      </NavLink>{" "}
      <NavLink to="/dagatal" className="nav-link">
        {" "}
        Dagatal{" "}
      </NavLink>{" "}
    </nav>
  );
}
