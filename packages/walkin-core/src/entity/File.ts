import { Column, Entity, JoinColumn, ManyToOne, RelationId } from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";
import { FileSystem } from "./FileSystem";

@Entity()
export class File extends WalkInBaseEntity {
  @ManyToOne(() => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @RelationId((file: File) => file.organization)
  public organizationId: string;

  @ManyToOne(() => FileSystem)
  @JoinColumn({
    name: "file_system_id",
    referencedColumnName: "id"
  })
  public fileSystem: FileSystem;

  @RelationId((file: File) => file.fileSystem)
  public fileSystemId: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public name: string;

  @Column({
    nullable: false,
    type: "varchar",
    name: "mime_type"
  })
  public mimeType: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public encoding: string;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public description: string;

  @Column({
    nullable: false,
    type: "varchar",
    name: "internal_url"
  })
  public internalUrl: string;

  @Column({
    nullable: false,
    type: "varchar",
    name: "public_url"
  })
  public publicUrl: string;

  @Column({
    nullable: false,
    type: "varchar",
    name: "status"
  })
  public status: string;
}
