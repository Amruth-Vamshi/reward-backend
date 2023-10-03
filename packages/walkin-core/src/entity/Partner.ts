import { Column, Entity, JoinColumn, ManyToOne, Unique } from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { PARTNER_TYPE, STATUS } from "../modules/common/constants";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";

@Entity()
@Unique(["code", "organization"])
export class Partner extends WalkInBaseEntityUUID {
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

  @Column({
    name: "partnerType",
    type: "varchar",
    enum: PARTNER_TYPE,
  })
  public partnerType: string;

  @ManyToOne((type) => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id",
  })
  public organization: Organization;
}
