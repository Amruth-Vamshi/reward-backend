import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { STATUS, ACCOUNT_TYPE } from "../modules/common/constants";
import { Store } from "./Store";

@Entity({
  name: "bank_account",
})
export class BankAccount extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    name: "name",
  })
  public name: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 255,
    name: "phone",
  })
  public phone: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 255,
    name: "email",
  })
  public email: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 255,
    name: "beneficiary_name",
  })
  public beneficiaryName: string;

  @Column({
    nullable: false,
    type: "varchar",
    name: "status",
    default: STATUS.ACTIVE,
  })
  public status: string;

  @Column({
    nullable: false,
    type: "varchar",
    name: "account_number",
    default: STATUS.ACTIVE,
  })
  public accountNumber: string;

  @Column({
    nullable: false,
    type: "varchar",
    name: "ifsc_code",
    default: STATUS.ACTIVE,
  })
  public ifscCode: string;

  @Column({
    nullable: true,
    type: "varchar",
    name: "external_account_id",
  })
  public externalAccountId: string;

  @Column({
    nullable: false,
    type: "boolean",
    name: "verified",
    default: "false",
  })
  public verified: boolean;

  @Column({
    nullable: false,
    type: "varchar",
    name: "account_type",
  })
  public accountType: string;

  @ManyToOne(
    () => Organization,
    (organization) => organization.bankAccount
  )
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id",
  })
  public organization: Organization;
}
