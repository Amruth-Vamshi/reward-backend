import {
    BaseEntity,
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    PrimaryGeneratedColumn,
    UpdateDateColumn
} from "typeorm";
import { WalkInBase } from "./WalkInBase";

export class WalkInBaseEntityInteger extends WalkInBase {
    @PrimaryGeneratedColumn("increment")
    public id: number;
}
