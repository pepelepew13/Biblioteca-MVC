import { Routes, Route, Link } from "react-router-dom";
import { MaterialsPage } from "./pages/MaterialsPage";
import { UsersPage } from "./pages/UsersPage";
import { LoansPage } from "./pages/LoansPage";
import { HistoryPage } from "./pages/HistoryPage";

function App() {
  return (
    <div>
      <nav>
        <Link to="/materials">Materiales</Link> |{" "}
        <Link to="/users">Usuarios</Link> |{" "}
        <Link to="/loans">Préstamos</Link> |{" "}
        <Link to="/history">Historial</Link>
      </nav>
      <Routes>
        <Route path="/materials" element={<MaterialsPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/loans" element={<LoansPage />} />
        <Route path="/history" element={<HistoryPage />} />
      </Routes>
    </div>
  );
}

export default App;