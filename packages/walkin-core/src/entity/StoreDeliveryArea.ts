import {
    Column,
    Entity
} from "typeorm";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";
@Entity({
    name: "store_delivery_area",
})
export class StoreDeliveryArea extends WalkInBaseEntityUUID {
    @Column({
        nullable: false,
        type: "varchar",
        length: 255,
        name: "area_type",
    })
    public areaType: string; //// PINCODE or POLYGON as of now

    @Column({
        nullable: true,
        type: "int",
    })
    public pincode: string;

    @Column({
        nullable: true,
        type: "text",
    })
    public area: string; // WKT
}
