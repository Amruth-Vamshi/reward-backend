import { Column, Entity, JoinTable, ManyToMany } from "typeorm";
import { APIKey } from "./APIKey";
import { Policy } from "./Policy";
import { User } from "./User";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity()
export class Role extends WalkInBaseEntity {
  @Column({
    nullable: true,
    type: "varchar"
  })
  public name: string;

  @Column({
    nullable: true,
    type: "varchar"
  })
  public description: string;

  @Column({
    nullable: true,
    type: "simple-array"
  })
  public tags: any[];

  @ManyToMany(() => APIKey, apiKey => apiKey.roles)
  public apiKeys: APIKey[];

  @ManyToMany(() => User, user => user.roles)
  public users: User[];

  @ManyToMany(() => Policy, policy => policy.roles)
  @JoinTable()
  public policies: Policy[];
}
