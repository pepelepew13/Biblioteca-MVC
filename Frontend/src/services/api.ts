import axios from "axios";

const API_URL = "http://localhost:3000/api";

// Define interfaces locales
export interface Material {
  id: string;
  title: string;
  registeredQuantity: number;
}

export interface User {
  name: string;
  cedula: string;
  role: string;
}

// Funciones relacionadas con materiales
export const registerMaterial = (material: Material) => {
  return axios.post(`${API_URL}/materials`, material);
};

export const deleteMaterial = (id: string) => {
  return axios.delete(`${API_URL}/materials/${id}`);
};

export const incrementMaterialQuantity = (id: string, amount: number) => {
  return axios.post(`${API_URL}/materials/${id}/increment`, { amount });
};

// Funciones relacionadas con usuarios
export const registerUser = (user: User) => {
  return axios.post(`${API_URL}/users`, user);
};

export const deleteUser = (cedula: string) => {
  return axios.delete(`${API_URL}/users/${cedula}`);
};

// Funciones relacionadas con préstamos y devoluciones
export const registerLoan = (loanData: { materialId: string; userId: string }) => {
  return axios.post(`${API_URL}/loans`, loanData);
};

export const registerReturn = (returnData: { materialId: string; userId: string }) => {
  return axios.post(`${API_URL}/returns`, returnData);
};

// Función para obtener el historial
export const getHistory = () => {
  return axios.get(`${API_URL}/history`);
};