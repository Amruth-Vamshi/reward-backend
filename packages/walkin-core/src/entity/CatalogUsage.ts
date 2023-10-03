import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  RelationId
} from "typeorm";
import { Catalog } from "./Catalog";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({
  name: "catalog_usage"
})
export class CatalogUsage extends WalkInBaseEntity {
  @Column({
    type: "varchar",
    length: 255
  })
  public purpose: string;

  @OneToOne(type => Catalog)
  @JoinColumn({
    name: "catalog_id",
    referencedColumnName: "id"
  })
  public catalog: Catalog;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @RelationId((catalogUsage: CatalogUsage) => catalogUsage.catalog)
  public catalogId: string;

  @RelationId((catalogUsage: CatalogUsage) => catalogUsage.organization)
  public organizationId: string;
  constructor() {
    super();
  }
}
