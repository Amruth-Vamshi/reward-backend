import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "report_config" })
export class ReportConfig extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar"
  })
  public name: string = "";

  @Column({
    nullable: false,
    type: "varchar"
  })
  public description: string = "";

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public status: string = "";
}
