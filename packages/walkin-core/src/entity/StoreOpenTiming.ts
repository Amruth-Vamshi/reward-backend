import {
    Column,
    Entity
} from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
@Entity({
    name: "store_open_timing"
})
export class StoreOpenTiming extends WalkInBaseEntityUUID {
    @Column({
        nullable: false,
        type: "varchar",
        length: 255,
    })
    public days: string[];

    @Column({
        nullable: false,
        type: "int",
    })
    public openTime: string;

    @Column({
        nullable: false,
        type: "int",
    })
    public closeTime: string;
}