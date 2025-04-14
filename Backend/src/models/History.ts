import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { Material } from "./Material";
import { User } from "./User";

@Entity()
export class HistoryEntry {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "datetime" })
  date!: Date;

  @Column()
  action!: "loan" | "return" | "create_material" | "increment_quantity" | "delete_material" | "delete_user" | "register_user";

  @ManyToOne(() => Material, material => material.historyEntries, { nullable: true, onDelete: "SET NULL" })
  material!: Material | null;

  @ManyToOne(() => User, user => user.historyEntries, { nullable: true, onDelete: "SET NULL" })
  user!: User | null;
}