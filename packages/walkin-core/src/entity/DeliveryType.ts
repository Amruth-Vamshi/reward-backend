import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";

@Entity()
@Unique(["code", "organization"])
export class DeliveryType extends WalkInBaseEntityUUID {
  @Column({
    name: "name",
    type: "varchar",
  })
  public name: string;

  @Column({
    name: "code",
    type: "varchar",
  })
  public code: string;

  @ManyToOne((type) => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id",
  })
  public organization: Organization;
}
