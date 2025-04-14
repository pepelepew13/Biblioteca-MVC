import { AppDataSource } from "../data-source";
import { Material } from "../models/Material";
import { User } from "../models/User";
import { HistoryEntry } from "../models/History";
import { HistoryController } from "./HistoryController";

export class MaterialController {
  static async registerMaterial(newMaterial: Omit<Material, "registrationDate">) {
    const materialRepository = AppDataSource.getRepository(Material);

    // Validar ID único
    const existingMaterial = await materialRepository.findOneBy({ id: newMaterial.id });
    if (existingMaterial) throw new Error("ID de material ya existe");

    const material = materialRepository.create({
      ...newMaterial,
      registrationDate: new Date(),
      currentQuantity: newMaterial.registeredQuantity,
    });

    // Registrar acción en el historial
    await materialRepository.save(material);

    await HistoryController.logAction("create_material", undefined, material);
  }

  static async incrementQuantity(materialId: string, amount: number) {
    const materialRepository = AppDataSource.getRepository(Material);
    const material = await materialRepository.findOneBy({ id: materialId });

    if (!material) throw new Error("Material no encontrado");

    material.registeredQuantity += amount;
    material.currentQuantity += amount;

    await materialRepository.save(material);

    await HistoryController.logAction("increment_quantity", undefined, material);
  }

  static async registerLoan(materialId: string, userId: string) {
    const materialRepository = AppDataSource.getRepository(Material);
    const userRepository = AppDataSource.getRepository(User);

    const material = await materialRepository.findOneBy({ id: materialId });
    if (!material) throw new Error("Material no encontrado");

    const user = await userRepository.findOne({
      where: { cedula: userId },
      relations: ["borrowedMaterials"],
    });
    if (!user) throw new Error("Usuario no encontrado");

    if (material.currentQuantity <= 0) throw new Error("Material no disponible");

    const maxLoans = user.role === "student" ? 5 : user.role === "professor" ? 3 : 1;
    if (user.borrowedMaterials.length >= maxLoans) {
      throw new Error("Límite de préstamos alcanzado");
    }

    material.currentQuantity -= 1;
    user.borrowedMaterials.push(material);

    await materialRepository.save(material);
    await userRepository.save(user);

    await HistoryController.logAction("loan", user, material);
  }

  static async registerReturn(materialId: string, userId: string) {
    const materialRepository = AppDataSource.getRepository(Material);
    const userRepository = AppDataSource.getRepository(User);
    const historyRepository = AppDataSource.getRepository(HistoryEntry);

    const material = await materialRepository.findOneBy({ id: materialId });
    const user = await userRepository.findOne({
      where: { cedula: userId },
      relations: ["borrowedMaterials"],
    });

    if (!material) throw new Error("Material no encontrado");
    if (!user) throw new Error("Usuario no encontrado");

    const borrowedMaterialIndex = user.borrowedMaterials.findIndex(
      (borrowedMaterial) => borrowedMaterial.id === materialId
    );
    if (borrowedMaterialIndex === -1) {
      throw new Error("El usuario no tiene este material prestado");
    }

    material.currentQuantity += 1;
    user.borrowedMaterials.splice(borrowedMaterialIndex, 1);

    const historyEntry = historyRepository.create({
      date: new Date(),
      action: "return",
      material,
      user,
    });

    await materialRepository.save(material);
    await userRepository.save(user);
    await historyRepository.save(historyEntry);
    await HistoryController.logAction("create_material", null, material);

  }
}