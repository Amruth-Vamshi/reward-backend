import { WalkInBaseEntity } from "@walkinserver/walkin-core/src/entity";
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne
} from "typeorm";

@Entity({ name: "currency" })
export class Currency extends WalkInBaseEntity {
    @Column({
        type: "varchar",
        nullable: false,
        name: "code"
    })
    public code: string;

    @Column({
        name: "conversion_ratio",
        type: "float",
        default: 0
    })
    public conversionRatio;

    @Column({
        type: "varchar",
        nullable: false
    })
    public name: string;
}