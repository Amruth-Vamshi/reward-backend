import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity()
export class FileSystem extends WalkInBaseEntity {
  @ManyToOne(() => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @RelationId((fileSystem: FileSystem) => fileSystem.organization)
  public organizationId: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public name: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public description: string;

  // Access type - PRIVATE or  PUBLIC
  @Column({
    nullable: false,
    type: "varchar",
    name: "access_type"
  })
  public accessType: string;

  // storage provider type eg: S3 or Cloudinary etc
  @Column({
    nullable: false,
    type: "varchar",
    name: "file_system_type"
  })
  public fileSystemType: string;

  @Column({
    nullable: false,
    type: "simple-json"
  })
  public configuration: string;

  @Column({
    nullable: false,
    type: "boolean"
  })
  public enabled: boolean = true;

  @Column({
    nullable: false,
    type: "varchar",
    name: "status"
  })
  public status: string;
}
