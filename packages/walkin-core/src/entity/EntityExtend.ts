import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId
} from "typeorm";
import { EntityExtendFields } from "./EntityExtendFields";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

/**
 *
 */
// TODO: EE Add unique constraint on organization & baseEntityTYpe
@Entity()
export class EntityExtend extends WalkInBaseEntity {
  @PrimaryGeneratedColumn()
  public id = undefined;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public entityName: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public description: string;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @OneToMany(
    () => EntityExtendFields,
    entityExtendField => entityExtendField.entityExtend
  )
  public fields: EntityExtendFields[];

  // @RelationId(ee => ee.organization)
  // organizationId;
}
