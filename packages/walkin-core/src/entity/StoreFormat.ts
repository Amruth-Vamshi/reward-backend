import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  Unique,
  OneToOne,
} from "typeorm";
import { STATUS } from "../modules/common/constants";
import { Organization } from "./Organization";
import { TaxType } from "./TaxType";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
@Entity({
  name: "store_format",
})
@Unique(["storeFormatCode", "organization"])
export class StoreFormat extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    unique: true,
  })
  public name: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 1000,
  })
  public description: string;

  @Column({
    name: "store_format_code",
    nullable: true,
    type: "varchar",
    length: 1000,
  })
  public storeFormatCode: string;

  @Column({
    nullable: true,
    type: "varchar",
    default: STATUS.ACTIVE,
  })
  public status: string;

  @ManyToOne((type) => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id",
  })
  public organization: Organization;

  @ManyToMany(
    () => TaxType,
    (taxTypes) => taxTypes.storeFormat
  )
  @JoinTable({
    name: "store_format_tax_type",
    inverseJoinColumn: {
      name: "tax_type_id",
      referencedColumnName: "id",
    },
    joinColumn: {
      name: "store_format_id",
      referencedColumnName: "id",
    },
  })
  public taxTypes: TaxType[];

  constructor() {
    super();
  }
}
