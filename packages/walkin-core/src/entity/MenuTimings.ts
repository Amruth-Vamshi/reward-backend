import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
import { Organization } from "./Organization";

@Entity({
  name: "menu_timings"
})
export class MenuTimings extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public name: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public code: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public days: string[];

  @Column({
    nullable: false,
    type: "int"
  })
  public openTime: string;

  @Column({
    nullable: false,
    type: "int"
  })
  public closeTime: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}
