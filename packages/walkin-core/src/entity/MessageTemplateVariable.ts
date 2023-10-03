import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
import { MessageTemplate } from "./MessageTemplate";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity()
export class MessageTemplateVariable extends WalkInBaseEntity {
  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    unique: true
  })
  public name: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    unique: true
  })
  public key: string;

  @Column({
    type: "varchar",
    length: 255
  })
  public type: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255
  })
  public format: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 255
  })
  public defaultValue: string;

  @Column({
    type: "boolean"
  })
  public required: boolean;

  @ManyToOne(
    () => MessageTemplate,
    messageTemplate => messageTemplate.messageTemplateVariables
  )
  public messageTemplate: MessageTemplate;

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
}
