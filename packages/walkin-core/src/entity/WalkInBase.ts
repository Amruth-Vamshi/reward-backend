import {
  BaseEntity,
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm";

export class WalkInBase extends BaseEntity {
  public static async availableById(transactionManager, id) {
    const entityCount: number = await transactionManager.count(this, {
      where: {
        id
      }
    });
    if (entityCount > 0) {
      return true;
    }
    return {
      HTTP_CODE: 404,
      MESSAGE: `${this.name} not found`,
      CODE: "INF"
    };
  }

  public static async availableByIdForOrganization(
    transactionManager,
    id,
    organizationId
  ) {
    const entityCount: number = await transactionManager.count(this, {
      where: {
        id,
        organization: {
          id: organizationId
        }
      },
      relations: ["organization"]
    });
    if (entityCount > 0) {
      return true;
    }
    return {
      HTTP_CODE: 404,
      MESSAGE: `${this.name} not found`,
      CODE: "INF"
    };
  }

  /*
   * How to use availableByIdForEntity
   * Define `query`
   * set options.where = query
   * set options.relations = [<<relations>>]
   * */
  public static async availableByIdForEntity(
    transactionManager,
    options
  ) {
    const entityCount: number = await transactionManager.count(this, options);
    if (entityCount > 0) {
      return true;
    }
    return {
      HTTP_CODE: 404,
      MESSAGE: `${this.name} not found`,
      CODE: "INF"
    };
  }

  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    name: "created_by"
  })
  public createdBy: string;

  @Column({
    nullable: false,
    type: "varchar",
    length: 255,
    name: "last_modified_by"
  })
  public lastModifiedBy: string;

  @CreateDateColumn({
    nullable: false,
    name: "created_time"
  })
  public createdTime: Date;

  @UpdateDateColumn({
    nullable: false,
    name: "last_modified_time"
  })
  public lastModifiedTime: Date;

  @BeforeInsert()
  public updateAuditColumns() {
    // TODO udpate createdBy lastModifiedBy with actuals values
    // Replace with injector in the provider
    const dbUser = "defaultuser";
    this.createdBy = dbUser;
    this.lastModifiedBy = dbUser;
  }

  @BeforeUpdate()
  public updateModifiedColumns() {
    // TODO udpate lastModifiedBy with actuals values
    // Replace with injector in the provider
    const dbUser = "defaultuser";
    this.lastModifiedBy = dbUser;
  }
}
