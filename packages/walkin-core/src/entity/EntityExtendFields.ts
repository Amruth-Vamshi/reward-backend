import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";
import { EntityExtend } from "./EntityExtend";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

/**
 *
 */
@Entity()
export class EntityExtendFields extends WalkInBaseEntity {
  [x: string]: {};
  @PrimaryGeneratedColumn()
  public id = undefined;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public slug: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public label: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public help: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public type: string;

  @Column({
    nullable: false,
    type: "boolean",
    default: true
  })
  public required: boolean;

  @Column({
    nullable: true,
    type: "simple-array"
  })
  public choices: any[];

  @Column({
    nullable: true,
    type: "varchar"
  })
  public defaultValue: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public validator: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public description: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public searchable: boolean;

  @ManyToOne(type => EntityExtend)
  @JoinColumn({
    name: "entity_extend_id",
    referencedColumnName: "id"
  })
  public entityExtend: EntityExtend;
}
