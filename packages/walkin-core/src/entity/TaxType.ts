import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique,
  ManyToMany
} from "typeorm";
import { STATUS } from "../modules/common/constants";
import { Organization } from "./Organization";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { StoreFormat } from "./StoreFormat";

@Entity({
  name: "tax_type"
})
@Unique(["name", "organization"])
@Unique(["taxTypeCode", "organization"])
export class TaxType extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public name: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 1000
  })
  public description: string;

  @Column({
    name: "tax_type_code",
    nullable: true,
    type: "varchar",
    length: 1000
  })
  public taxTypeCode: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public status: string;

  @ManyToMany(() => StoreFormat, storeFormat => storeFormat.taxTypes)
  public storeFormat: StoreFormat[];

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}
