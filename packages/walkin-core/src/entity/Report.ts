import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from "typeorm";
import { ReportConfig } from "./ReportConfig";
import { File } from "./File";
import { Organization } from "./Organization";
import { WalkInBaseEntity } from "./WalkInBaseEntity";

@Entity({ name: "report" })
export class Report extends WalkInBaseEntity {
  @ManyToOne(type => ReportConfig)
  @JoinColumn({
    name: "report_config_id",
    referencedColumnName: "id"
  })
  public reportConfig: ReportConfig;

  @ManyToOne(type => File)
  @JoinColumn({
    name: "report_file_id",
    referencedColumnName: "id"
  })
  public reportFile: File;

  @Column({
    nullable: true,
    type: "datetime",
    name: "report_date"
  })
  public reportDate: Date;

  @ManyToOne(type => Organization)
  @JoinColumn({
    name: "organization_id",
    referencedColumnName: "id"
  })
  public organization: Organization;

  @Column({
    nullable: false,
    type: "varchar"
  })
  public status: string = "";
}
