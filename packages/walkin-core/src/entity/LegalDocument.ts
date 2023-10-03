import { type } from "os";
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Organization } from "./Organization";
import { WalkInBaseEntityUUID } from "./WalkInBaseEntityUUID";

@Entity({
  name: "legal_document",
})
export class LegalDocument extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "varchar",
    name: "legal_document_type",
  })
  public legalDocumentType: string;

  @Column({
    nullable: true,
    type: "varchar",
    name: "legal_document_value",
  })
  public legalDocumentValue: string;

  @Column({
    nullable: true,
    type: "simple-json",
    name: "legal_document_info",
  })
  public legalDocumentInfo: string;

  @Column({
    nullable: true,
    type: "varchar",
    length: 255,
    name: "legal_document_url",
  })
  public legalDocumentUrl: string;

  // tslint:disable-next-line:no-shadowed-variable
  @ManyToOne((type) => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id",
  })
  public organization: Organization;
}
