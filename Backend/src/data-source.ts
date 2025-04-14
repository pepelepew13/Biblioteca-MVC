import "reflect-metadata";
import { DataSource } from "typeorm";
import { Material } from "./models/Material";
import { User } from "./models/User";
import { HistoryEntry } from "./models/History";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [Material, User, HistoryEntry],
  migrations: [],
  subscribers: [],
});