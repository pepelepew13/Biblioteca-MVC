import { Entity, Column, PrimaryColumn, OneToMany, ManyToMany } from "typeorm";
import { HistoryEntry } from "./History";
import { Material } from "./Material";

export type Role = "student" | "professor" | "administrative";

@Entity()
export class User {
  @PrimaryColumn()
  cedula!: string;

  @Column()
  name!: string;

  @Column({
    type: "simple-enum",
    enum: ["student", "professor", "administrative"],
  })
  role!: Role;

  // Relación con el historial
  @OneToMany(() => HistoryEntry, history => history.user)
  historyEntries!: HistoryEntry[];

  // Relación directa con materiales prestados (nueva)
  @ManyToMany(() => Material, material => material.borrowedBy)
  borrowedMaterials!: Material[];
}