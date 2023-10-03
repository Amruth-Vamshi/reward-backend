import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  Unique
} from "typeorm";
import { MessageTemplateVariable } from "./MessageTemplateVariable";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { MESSAGE_FORMAT } from "../modules/common/constants";

@Entity()
@Unique(["name", "organization"])
export class MessageTemplate extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public name: string;

  @Column({
    type: "varchar",
    length: 1000
  })
  public description: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public messageFormat: MESSAGE_FORMAT;

  @Column({
    type: "text"
  })
  public templateBodyText: string;

  @Column({
    type: "varchar",
    length: 1000
  })
  public templateSubjectText: string;

  @Column({
    type: "varchar",
    length: 100
  })
  public templateStyle: string;

  @Column({
    type: "varchar",
    length: 500
  })
  public url: string;

  @Column({
    type: "varchar",
    length: 500
  })
  public imageUrl: string;

  @OneToMany(
    () => MessageTemplateVariable,
    messageTemplateVariable => messageTemplateVariable.messageTemplate,
    { eager: true }
  )
  public messageTemplateVariables: MessageTemplateVariable[];

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
  public status: string;

  @Column({
    name: "external_template_id",
    nullable: false,
    type: "varchar"
  })
  public externalTemplateId: string;
}
