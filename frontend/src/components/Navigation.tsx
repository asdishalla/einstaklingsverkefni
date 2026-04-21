import { NavLink } from "react-router-dom";

export default function Navigation() {
  return (
    <nav className="navigation">
      <NavLink to="/">Verkefni</NavLink>
      <NavLink to="/venjur">Venjur</NavLink>
      <NavLink to="/dagatal">Dagatal</NavLink>
    </nav>
  );
}