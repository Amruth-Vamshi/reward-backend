import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  OneToMany,
  OneToOne,
  Tree,
  TreeChildren,
  TreeParent
} from "typeorm";
import { Application } from "./Application";
import { Campaign } from "../../../walkin-rewardx/src/entity/Campaign";
import { Store } from "./Store";
import { User } from "./User";
import { WalkInEntityExtendBase } from "./WalkInEntityExtendBase";
import { WalkinProduct } from "./WalkinProduct";
import { BusinessRuleDetail } from "./BusinessRuleDetail";
import { BankAccount } from "./BankAccount";
import { LegalDocument } from "./LegalDocument";

/**
 * @summary Organization entity created using the closure-table pattern for storing trees.
 */

@Entity()
@Tree("closure-table")
export class Organization extends WalkInEntityExtendBase {
  @Column("varchar", {
    nullable: false
  })
  public name: string;

  @Column("varchar", {
    nullable: true,
    unique: true,
    name: "code"
  })
  public code: string;

  @Column("varchar", {
    nullable: false,
    name: "status"
  })
  public status: string;

  @Column("varchar", {
    nullable: true
  })
  public phoneNumber: string;

  @Column("varchar", {
    nullable: true
  })
  public email: string;

  @Column("varchar", {
    name: "website",
    nullable: true
  })
  public website: string;

  @Column("varchar", {
    name: "organization_type",
    nullable: true
  })
  public organizationType: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public addressLine1: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public addressLine2: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public city: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public state: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public pinCode: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public country: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public externalOrganizationId: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 255,
    name: "business_type"
  })
  public businessType: string;

  // legal_name

  @Column({
    nullable: true,
    type: "varchar",
    length: 255,
    name: "legal_name"
  })
  public legalName: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 255,
    name: "brand_logo"
  })
  public brandLogo: string;

  @Column({
    nullable: true,
    type: "varchar",
    name: "parentId"
  })
  public parentId;

  @OneToMany(() => Application, application => application.organization, {
    eager: true
  })
  public applications: Application[];

  @OneToMany(() => BankAccount, bankAccount => bankAccount.organization, {
    eager: true,
    nullable: true
  })
  public bankAccount: BankAccount[];

  @TreeChildren()
  public children: Organization[];

  @TreeParent()
  public parent: Organization;

  @OneToMany(() => User, user => user.organization)
  public users: User[];

  @OneToMany(() => Campaign, campaign => campaign.organization)
  public campaigns: Campaign[];

  @OneToMany(() => LegalDocument, LegalDocuments => LegalDocuments.organization)
  public legalDocuments: LegalDocument[];

  @ManyToMany(() => WalkinProduct, walkinProduct => walkinProduct.organizations)
  public walkinProducts: WalkinProduct[];

  @OneToMany(
    () => BusinessRuleDetail,
    businessRuleDetail => businessRuleDetail.organization
  )
  public businessRuleDetails: BusinessRuleDetail;

  @OneToMany(() => Store, store => store.organization)
  public store: Store;
}
