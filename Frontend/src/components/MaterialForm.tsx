import { useState } from "react";
import { registerMaterial } from "../services/api";

export const MaterialForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    registeredQuantity: "", // Cambiar a string para permitir un campo vacío
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.id || !formData.title || !formData.registeredQuantity) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    try {
      await registerMaterial({
        ...formData,
        registeredQuantity: Number(formData.registeredQuantity),
      });
      alert("Material registrado!");
      setFormData({ id: "", title: "", registeredQuantity: "" });
    } catch (error: any) {
      alert(error.response?.data?.error || "Error desconocido");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 border rounded">
      <div className="mb-3">
        <label className="form-label">ID del Material</label>
        <input
          type="text"
          className="form-control"
          value={formData.id}
          onChange={(e) => setFormData({ ...formData, id: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Título</label>
        <input
          type="text"
          className="form-control"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Cantidad</label>
        <input
          type="number"
          className="form-control"
          value={formData.registeredQuantity}
          onChange={(e) =>
            setFormData({ ...formData, registeredQuantity: e.target.value })
          }
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Registrar Material
      </button>
    </form>
  );
};