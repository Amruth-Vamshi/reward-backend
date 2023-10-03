import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { Organization } from ".";

@Entity()
export class Option extends WalkInBaseEntity {
  @Column({
    type: "varchar",
    unique: false,
    nullable: false
  })
  public name: string;

  @Column({
    type: "varchar"
  })
  public description: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @Column({
    name: "external_option_id",
    nullable: true,
    type: "varchar"
  })
  public externalOptionId: string;

  @Column({
    name: "code",
    nullable: true,
    type: "varchar"
  })
  public code: string;

  @Column({
    name: "sortSeq",
    nullable: true,
    type: "int",
    default: 0
  })
  public sortSeq: number;

  constructor() {
    super();
  }
}
