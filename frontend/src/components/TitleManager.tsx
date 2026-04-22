import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function TitleManager() {
  const location = useLocation();

  useEffect(() => {
    let title = "Skipuleggi";

    if (location.pathname === "/") title = "Verkefni";
    else if (location.pathname === "/venjur") title = "Venjur";
    else if (location.pathname === "/dagatal") title = "Dagatal";

    document.title = `${title} | Skipuleggi`;
  }, [location]);

  return null;
}