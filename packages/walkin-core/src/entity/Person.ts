import { fragmentOnNonCompositeErrorMessage } from "graphql/validation/rules/FragmentsOnCompositeTypes";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique
} from "typeorm";
import { Application } from "./Application";
import { CustomerDevice } from "./CustomerDevice";
import { Organization } from "./Organization";
import { WalkInBaseEntityInteger } from "./WalkInBaseEntityInteger";
import { CustomerTag } from "./CustomerTag";
import { Address } from "./Address";
import { Customer } from ".";

/**
 *
 */
@Entity()
@Unique(["personIdentifier"])
export class Person extends WalkInBaseEntityInteger {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public firstName: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public lastName: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public email: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public phoneNumber: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public gender: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public dateOfBirth: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public personIdentifier: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public status: string;
}
