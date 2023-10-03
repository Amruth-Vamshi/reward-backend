import { Injectable } from "@graphql-modules/di";
import { EntityManager } from "typeorm";
import {
  CACHING_KEYS,
  CACHING_PERIOD,
  EXPIRY_MODE
} from "@walkinserver/walkin-core/src/modules/common/constants";
import {
  getValueFromCache,
  setValueToCache
} from "@walkinserver/walkin-core/src/modules/common/utils/redisUtils";
import { LoyaltyLedger } from "../../entity";

@Injectable()
export class LoyaltyLedgerRepository {

  public async loyaltyLedgerLoyalty(
    transactionalEntityManager: EntityManager,
    body:any,
    relations:Array<string>
  ): Promise<LoyaltyLedger> {
    const key = `${CACHING_KEYS.LOYALTY_LEDGER}_${body.id}`;
    let loyaltyLedger: any = await getValueFromCache(key);
    if (!loyaltyLedger) {
      loyaltyLedger = await transactionalEntityManager.findOne(LoyaltyLedger, {
        where: {
          id: body.id
        },
        relations
      });
      if (loyaltyLedger) console.log("Fetched from database.")
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    if (loyaltyLedger) {
      await setValueToCache(
        key,
        loyaltyLedger,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated Cache with key :", key);
    }else{
      loyaltyLedger = await transactionalEntityManager.create(LoyaltyLedger,body);
      loyaltyLedger = await transactionalEntityManager.save(loyaltyLedger);
      await setValueToCache(
        key,
        loyaltyLedger,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Created a new record in Database and added to Cache with key :", key);
    }
    return loyaltyLedger;
  }

  public async getLoyaltyLedgerById(
    transactionalEntityManager: EntityManager,
    loyaltyLedgerId: string,
    relations: [string]
  ): Promise<LoyaltyLedger> {
    const key = `${CACHING_KEYS.LOYALTY_LEDGER}_${loyaltyLedgerId}`;
    let loyaltyLedger: any = await getValueFromCache(key);

    if (!loyaltyLedger) {
      loyaltyLedger = await transactionalEntityManager.findOne(LoyaltyLedger, {
        where: {
          id: loyaltyLedgerId
        },
        relations
      });

      if (loyaltyLedger) {
        await setValueToCache(
          key,
          loyaltyLedger,
          EXPIRY_MODE.EXPIRE,
          CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
        );
        console.log("Fetched from Database and added to Cache with key :", key);
      }
    } else {
      console.log("Fetched from Cache with key :", key);
    }
    return loyaltyLedger;
  }

  public async updateLoyaltyLedgerById(
    transactionalEntityManager: EntityManager,
    loyaltyLedgerId: string,
    body: any
  ): Promise<LoyaltyLedger> {
    const key = `${CACHING_KEYS.LOYALTY_LEDGER}_${loyaltyLedgerId}`;
    let loyaltyLedger: any = await getValueFromCache(key);

    if (!loyaltyLedger) {
      loyaltyLedger = await transactionalEntityManager.findOne(LoyaltyLedger, {
        where: {
          id: loyaltyLedgerId
        }
      });
      if (loyaltyLedger) console.log("Fetched from database.")
    } else {
      console.log("Fetched from Cache with key :", key);
    }

    if (!loyaltyLedger) return null

    loyaltyLedger = await transactionalEntityManager.update(LoyaltyLedger,{id:loyaltyLedgerId},body)

    if (loyaltyLedger) {
      await setValueToCache(
        key,
        loyaltyLedger,
        EXPIRY_MODE.EXPIRE,
        CACHING_PERIOD.VERY_LONG_CACHING_PERIOD
      );
      console.log("Updated the record in Database and updated Cache with key :", key);
    }
    return loyaltyLedger;
  }

  public async deleteLoyaltyLedgerById(
    transactionalEntityManager: EntityManager,
    loyaltyLedgerId: string
  ):Promise<boolean>{
    try{
      const queryRunner = await transactionalEntityManager.connection.createQueryRunner();
      await queryRunner.manager.query(`delete from loyalty_ledger where id=${loyaltyLedgerId}`);
      queryRunner.release();
      console.log("Deleted a loyaltyLedger record from database with id: ",loyaltyLedgerId);
      return true
    }catch(e){
      console.log(e);
      return false
    }
  }
}