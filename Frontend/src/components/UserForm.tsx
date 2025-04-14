import { useState } from 'react';
import { registerUser } from '../services/api';

export const UserForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    cedula: '',
    role: 'student'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.cedula || !formData.role) {
      alert("Todos los campos son obligatorios.");
      return;
    }
    try {
      await registerUser(formData); // Usar la función centralizada
      alert("Usuario registrado!");
      setFormData({ name: "", cedula: "", role: "student" });
    } catch (error: any) {
      alert(error.response?.data?.error || "Error desconocido");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Cédula"
        value={formData.cedula}
        onChange={(e) => setFormData({ ...formData, cedula: e.target.value })}
      />
      <select
        value={formData.role}
        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
      >
        <option value="student">Estudiante</option>
        <option value="professor">Profesor</option>
        <option value="administrative">Administrativo</option>
      </select>
      <button type="submit">Registrar Usuario</button>
    </form>
  );
};