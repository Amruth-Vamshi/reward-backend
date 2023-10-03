import {
  WalkInBaseEntity,
  Organization
} from "@walkinserver/walkin-core/src/entity";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  RelationId,
  OneToMany,
  OneToOne
} from "typeorm";
import { Currency } from "./currency";

@Entity({ name: "loyalty_card" })
export class LoyaltyCard extends WalkInBaseEntity {
  @Column({
    type: "varchar",
    nullable: false,
    name: "code"
  })
  public code: string;

  @Column({
    type: "text",
    nullable: true
  })
  public description: string;

  @Column({
    type: "varchar",
    nullable: false
  })
  public name: string;

  @ManyToOne(type => Currency)
  @JoinColumn({
    name: "currency_id",
    referencedColumnName: "id"
  })
  currency;

  @RelationId((loyaltyCard: LoyaltyCard) => loyaltyCard.currency)
  currencyId;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  organization;

  @RelationId((loyaltyCard: LoyaltyCard) => loyaltyCard.organization)
  organizationId;
}
