import {
    WalkInBaseEntity,
} from "@walkinserver/walkin-core/src/entity";
import {
    Column, Entity, JoinColumn, ManyToOne, BaseEntity,
    PrimaryGeneratedColumn, PrimaryColumn
} from "typeorm";

@Entity({ name: "status" })
export class Status extends BaseEntity {
    @PrimaryColumn(
        {
            name: "status_id",
            type: "int"
        }
    )
    statusId;
    @Column({
        type: "varchar",
        name: "status_code",
        nullable: false
    })
    statusCode;

    @Column({
        type: "varchar",
        name: "status_type",
        nullable: true
    })
    statusType;

    @Column({
        type: "text",
        name: "description",
        nullable: true
    })
    description;
}
