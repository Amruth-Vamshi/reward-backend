import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { Option } from "./Option";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({
  name: "option_value"
})
export class OptionValue extends WalkInBaseEntity {
  @Column({
    type: "varchar",
    unique: false
  })
  public value: string;

  @ManyToOne(type => Option)
  @JoinColumn({
    name: "option_id",
    referencedColumnName: "id"
  })
  public option: Option;

  @Column({
    name: "external_option_value_id",
    nullable: true,
    type: "varchar"
  })
  public externalOptionValueId: string;

  @Column({
    name: "code",
    nullable: true,
    type: "varchar"
  })
  public code: string;

  @Column({
    name: "sortSeq",
    nullable: true,
    type: "int",
    default: 0
  })
  public sortSeq: number;

  @RelationId((optionValue: OptionValue) => optionValue.option)
  public optionId: string;

  constructor() {
    super();
  }
}
