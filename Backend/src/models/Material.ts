import { Entity, PrimaryColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { HistoryEntry } from "./History";
import { User } from "./User";

@Entity()
export class Material {
  @PrimaryColumn()
  id: string;

  @Column()
  title: string;

  @Column({ type: "date" })
  registrationDate: Date;

  @Column()
  registeredQuantity: number;

  @Column()
  currentQuantity: number;

  // Añade esta relación
  @OneToMany(() => HistoryEntry, history => history.material)
  historyEntries!: HistoryEntry[];

  // Relación directa con materiales prestados (nueva)
  @ManyToMany(() => User, user => user.borrowedMaterials)
  @JoinTable() // ← ¡Añade este decorador!
  borrowedBy!: User[];
}