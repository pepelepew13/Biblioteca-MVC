import { AppDataSource } from "../data-source";
import { HistoryEntry } from "../models/History";
import { Material } from "../models/Material";
import { User } from "../models/User";

export class HistoryController {
  static async getHistory() {
    const historyRepository = AppDataSource.getRepository(HistoryEntry);

    // Incluir relaciones con material y usuario
    return await historyRepository.find({
      relations: ["material", "user"],
      order: { date: "DESC" }, // Ordenar por fecha descendente
    });
  }

  static async logAction(action: string, user?: User | null, material?: Material | null) {
    const historyRepository = AppDataSource.getRepository(HistoryEntry);
  
    const historyEntry = historyRepository.create({
      date: new Date(),
      action: action as "loan" | "return" | "create_material" | "increment_quantity" | "delete_material" | "delete_user" | "register_user",
      user: user || null, // Permitir valores NULL
      material: material || null, // Permitir valores NULL
    });
  
    try {
      await historyRepository.save(historyEntry);
    } catch (error) {
      console.error("Error al guardar en el historial:", error);
      throw new Error("No se pudo registrar la acción en el historial.");
    }
  }
}