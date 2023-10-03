import {
  WalkInBaseEntity,
  Organization,
  Communication
} from "@walkinserver/walkin-core/src/entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { LoyaltyCard } from "./loyalty-card";
import { LoyaltyProgram } from "./loyalty-program";

@Entity({ name: "expiry_communication" })
export class ExpiryCommunication {
  @PrimaryGeneratedColumn("increment")
  public id: number;

  @ManyToOne(type => LoyaltyCard)
  @JoinColumn({
    name: "loyalty_card_id_ec",
    referencedColumnName: "id"
  })
  loyaltyCard: LoyaltyCard;

  @ManyToOne(type => Communication)
  @JoinColumn({
    name: "communication_id_ec",
    referencedColumnName: "id"
  })
  communication: Communication;

  @Column({
    type: "text",
    name: "event_type"
  })
  public eventType: string;

  @Column({
    type: "int",
    name: "days"
  })
  public numberOfDays;

  @ManyToOne(type => LoyaltyProgram)
  @JoinColumn({
    name: "loyalty_program_id_ec",
    referencedColumnName: "id"
  })
  loyaltyProgram: LoyaltyProgram;
}
