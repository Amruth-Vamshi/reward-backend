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
import { STATUS } from "../modules/common/constants";
import { Store } from "./Store";

@Entity({
  name: "staff",
})
export class Staff extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    name: "name",
  })
  public name: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    name: "phone",
  })
  public phone: string;
  @Column({
    nullable: false,
    type: "varchar",
    name: "staffRole",
  })
  public staffRole: string;

  @Column({
    nullable: false,
    type: "varchar",
    name: "status",
    default: STATUS.ACTIVE,
  })
  public status: string;

  @Column({
    nullable: false,
    type: "boolean",
    name: "busy",
    default: false,
  })
  public busy: boolean;

  @Column({
    nullable: true,
    type: "varchar",
    name: "email",
  })
  public email: string;

  @ManyToOne((type) => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id",
  })
  public organization: Organization;
}
