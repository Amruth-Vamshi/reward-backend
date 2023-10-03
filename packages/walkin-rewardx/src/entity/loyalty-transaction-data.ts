import { Column, Entity, JoinColumn, OneToOne } from "typeorm";
import { WalkInBaseEntityUUID } from "../../../walkin-core/src/entity";
import { LoyaltyTransaction } from "./loyalty-transaction";

@Entity({ name: "loyalty_transaction_data" })
export class LoyaltyTransactionData extends WalkInBaseEntityUUID {
  @Column({
    nullable: false,
    type: "datetime"
  })
  public date: Date;

  @Column({
    name: "data_input",
    nullable: false,
    type: "text"
  })
  public dataInput: string;

  @OneToOne(type => LoyaltyTransaction)
  @JoinColumn({
    name: "loyalty_transaction_id",
    referencedColumnName: "id"
  })
  public loyaltyTransaction: LoyaltyTransaction;
}
