import { MigrationInterface, QueryRunner } from "typeorm";

export class RewardxDatabaseCleanup1652182341119 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query("DROP TABLE `campaign_offers`");
    await queryRunner.query("DROP TABLE `response`");
    await queryRunner.query("DROP TABLE `choice`");
    await queryRunner.query("DROP TABLE `customer_feedback`");
    await queryRunner.query("DROP TABLE `customer_offer_redemption`");
    await queryRunner.query("DROP TABLE `customer_offers`");
    await queryRunner.query("DROP TABLE `feedback_form`");
    await queryRunner.query("DROP TABLE `question`");
    await queryRunner.query("DROP TABLE `feedback_category_closure`");
    await queryRunner.query("DROP TABLE `feedback_category`");
    await queryRunner.query("DROP TABLE `feedback_handler`");
    await queryRunner.query("DROP TABLE `feedback_template_url`");
    await queryRunner.query("DROP TABLE `feedback_ui_config`");
    await queryRunner.query("DROP TABLE `hyperx`");
    await queryRunner.query("DROP TABLE `offer`");
    await queryRunner.query("DROP TABLE `order_note`");
    await queryRunner.query("DROP TABLE `order_refund`");
    await queryRunner.query("DROP TABLE `order_payment`");
    await queryRunner.query("DROP TABLE `order_delivery`");
    await queryRunner.query("DROP TABLE `order_line_taxes`");
    await queryRunner.query("DROP TABLE `order_line_charges`");
    await queryRunner.query("DROP TABLE `order_line_discount`");
    await queryRunner.query("DROP TABLE `order_line_item`");
    await queryRunner.query("DROP TABLE `order`");
    await queryRunner.query("DROP TABLE `orderx`");
  }

  public async down(queryRunner: QueryRunner): Promise<any> {}
}
