import { useState, useEffect } from "react";
import axios from "axios";
import "./LoansPage.css";

export const LoansPage = () => {
  const [loanData, setLoanData] = useState({ materialId: "", userId: "" });
  const [materials, setMaterials] = useState([]);
  const [users, setUsers] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const materialsResponse = await axios.get("http://localhost:3000/api/materials");
        const usersResponse = await axios.get("http://localhost:3000/api/users");
        const historyResponse = await axios.get("http://localhost:3000/api/history");
        setMaterials(materialsResponse.data);
        setUsers(usersResponse.data);
        setHistory(historyResponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLoan = async () => {
    try {
      if (!loanData.materialId || !loanData.userId) {
        alert("Por favor, selecciona un material y un usuario.");
        return;
      }

      await axios.post("http://localhost:3000/api/loans", loanData);
      alert("Préstamo registrado!");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Error desconocido");
    }
  };

  const handleReturn = async () => {
    try {
      if (!loanData.materialId || !loanData.userId) {
        alert("Por favor, selecciona un material y un usuario.");
        return;
      }

      await axios.post("http://localhost:3000/api/returns", loanData);
      alert("Devolución registrada!");
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.error || "Error desconocido");
    }
  };

  if (loading) {
    return <p>Cargando datos...</p>;
  }

  return (
    <div className="loans-page">
      <h1>Préstamos y Devoluciones</h1>
      <div className="form-group">
        <label htmlFor="material-select">Material:</label>
        <select
          id="material-select"
          value={loanData.materialId}
          onChange={(e) => setLoanData({ ...loanData, materialId: e.target.value })}
        >
          <option value="">Selecciona un material</option>
          {materials.map((material: any) => (
            <option key={material.id} value={material.id}>
              {material.title}
            </option>
          ))}
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="user-select">Usuario:</label>
        <select
          id="user-select"
          value={loanData.userId}
          onChange={(e) => setLoanData({ ...loanData, userId: e.target.value })}
        >
          <option value="">Selecciona un usuario</option>
          {users.map((user: any) => (
            <option key={user.cedula} value={user.cedula}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div className="button-group">
        <button onClick={handleLoan}>Registrar Préstamo</button>
        <button onClick={handleReturn}>Registrar Devolución</button>
      </div>
      <h2>Historial de Préstamos y Devoluciones</h2>
      <table className="history-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Acción</th>
            <th>Material</th>
            <th>Usuario</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry: any) => (
            <tr key={entry.id}>
              <td>{new Date(entry.date).toLocaleString()}</td>
              <td>{entry.action}</td>
              <td>{entry.material?.title || "N/A"}</td> {/* Manejar material null */}
              <td>{entry.user?.name || "N/A"}</td> {/* Manejar usuario null */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};