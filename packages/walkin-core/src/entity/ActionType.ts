const { Entity, PrimaryGeneratedColumn, Column } = require("typeorm");
import { STATUS } from "../modules/common/constants";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ tableName: "action_type" })
export class ActionType extends WalkInBaseEntity {
  @Column({
    nullable: true,
    type: "varchar",
    unique: true
  })
  public type: string = "";

  @Column({
    nullable: true,
    type: "varchar"
    // enum: Object.values(STATUS),
    // default: STATUS.ACTIVE
  })
  public status: string;
}
