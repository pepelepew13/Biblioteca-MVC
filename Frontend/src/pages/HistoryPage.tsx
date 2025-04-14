import { useEffect, useState } from "react";
import { getHistory } from "../services/api";
import "./HistoryPage.css";

export const HistoryPage = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await getHistory();
        setHistory(response.data);
      } catch (error: any) {
        alert(error.response?.data?.error || "Error desconocido");
      }
    };
    fetchHistory();
  }, []);

  return (
    <div>
      <h1>Historial de la Biblioteca</h1>
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
              <td>{entry.material?.title || "N/A"}</td>
              <td>{entry.user?.name || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};