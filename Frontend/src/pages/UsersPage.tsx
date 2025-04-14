import { useState, useEffect } from "react";
import { UserForm } from "../components/UserForm";
import axios from "axios";
import "./UsersPage.css";

export const UsersPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/users");
        setUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (cedula: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${cedula}`);
      alert("Usuario eliminado!");
      setUsers(users.filter((user: any) => user.cedula !== cedula));
    } catch (error: any) {
      alert(error.response?.data?.error || "Error al eliminar el usuario.");
    }
  };

  return (
    <div>
      <h1>Usuarios</h1>
      <UserForm />
      <h2>Lista de Usuarios</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user: any) => (
            <tr key={user.cedula}>
              <td>{user.cedula}</td>
              <td>{user.name}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => handleDeleteUser(user.cedula)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};