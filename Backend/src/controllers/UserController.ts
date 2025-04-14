import { AppDataSource } from "../data-source";
import { User } from "../models/User";
import { HistoryController } from "./HistoryController";

export class UserController {
  static async registerUser(userData: User) {
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOneBy({ cedula: userData.cedula });
    if (existingUser) throw new Error("Cédula ya registrada");

    const newUser = userRepository.create(userData);

    await userRepository.save(newUser);
    
    await HistoryController.logAction("register_user", newUser, null);
    
  }

  static async deleteUser(cedula: string) {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({
      where: { cedula },
      relations: ["borrowedMaterials"],
    });

    if (!user) throw new Error("Usuario no encontrado");
    if (user.borrowedMaterials.length > 0) {
      throw new Error("Usuario tiene materiales prestados");
    }

    await HistoryController.logAction("delete_user", user, null);
    await userRepository.remove(user);
  }
}