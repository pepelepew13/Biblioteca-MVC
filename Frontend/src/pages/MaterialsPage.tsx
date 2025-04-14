import { useState, useEffect } from "react";
import { MaterialForm } from "../components/MaterialForm";
import axios from "axios";
import "./MaterialsPage.css";

export const MaterialsPage = () => {
  const [materials, setMaterials] = useState<{ id: string; title: string; registeredQuantity: number; currentQuantity: number }[]>([]);
  const [incrementAmount, setIncrementAmount] = useState<number>(0);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/materials");
        setMaterials(response.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
      }
    };
    fetchMaterials();
  }, []);

  const handleDeleteMaterial = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/materials/${id}`);
      alert("Material eliminado!");
      setMaterials(materials.filter((material: any) => material.id !== id));
    } catch (error: any) {
      alert(error.response?.data?.error || "Error al eliminar el material.");
    }
  };

  const handleIncrementQuantity = async (id: string, amount: number) => {
    try {
      await axios.post(`http://localhost:3000/api/materials/${id}/increment`, { amount });
      alert("Cantidad incrementada!");
      const updatedMaterials = materials.map((material: any) =>
        material.id === id
          ? { ...material, registeredQuantity: material.registeredQuantity + amount, currentQuantity: material.currentQuantity + amount }
          : material
      );
      setMaterials(updatedMaterials);
    } catch (error: any) {
      alert(error.response?.data?.error || "Error al incrementar la cantidad.");
    }
  };

  return (
    <div>
      <h1>Materiales</h1>
      <MaterialForm />
      <h2>Lista de Materiales</h2>
      <table className="materials-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Título</th>
            <th>Cantidad Registrada</th>
            <th>Cantidad Actual</th>
          </tr>
        </thead>
        <tbody>
        {materials.map((material: any) => (
          <tr key={material.id}>
            <td>{material.id}</td>
            <td>{material.title}</td>
            <td>{material.registeredQuantity}</td>
            <td>{material.currentQuantity}</td>
            <td>
              <input
                type="number"
                placeholder="Cantidad"
                onChange={(e) => setIncrementAmount(Number(e.target.value))}
              />
              <button onClick={() => handleIncrementQuantity(material.id, incrementAmount)}>
                Incrementar
              </button>
            </td>
            <td>
              <button onClick={() => handleDeleteMaterial(material.id)}>Eliminar</button>
            </td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};