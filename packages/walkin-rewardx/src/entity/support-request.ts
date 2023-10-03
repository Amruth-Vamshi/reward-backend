import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import {
  Organization,
  User,
  WalkInBaseEntity
} from "../../../walkin-core/src/entity";

@Entity({ name: "support_request" })
export class SupportRequest extends WalkInBaseEntity {
  @Column({
    name: "support_type",
    nullable: false,
    type: "varchar",
    length: 36
  })
  public supportType: string;

  @Column({
    name: "support_subtype",
    nullable: false,
    type: "varchar",
    length: 36
  })
  public supportSubType: string;

  @Column({
    name: "subject",
    nullable: false,
    type: "varchar",
    length: 255
  })
  public subject: string;

  @Column({
    name: "content",
    nullable: false,
    type: "text"
  })
  public content: string;

  @Column({
    name: "response",
    nullable: false,
    type: "simple-json"
  })
  public response: any;

  @ManyToOne(type => User)
  @JoinColumn({
    name: "user_id",
    referencedColumnName: "id"
  })
  public user: User;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;
}
