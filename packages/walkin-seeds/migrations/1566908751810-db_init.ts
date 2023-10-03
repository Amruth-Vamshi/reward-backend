import { MigrationInterface, QueryRunner } from "typeorm";

export class DbInit1566908751810 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "CREATE TABLE IF NOT EXISTS `action_type` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `type` varchar(255) NULL, `status` varchar(255) NULL, UNIQUE INDEX `IDX_83bf9742fcac88a00c4507ea2e` (`type`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `action_definition` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `format` varchar(255) NULL, `name` varchar(255) NULL, `schema` text NULL, `status` varchar(255) NULL, `accessLevel` varchar(255) NULL, `action_type_id` int NULL, UNIQUE INDEX `IDX_daa94d74b9a6f8f02582609857` (`name`), UNIQUE INDEX `REL_8c22e041093b11f3287b982330` (`action_type_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `policy` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `effect` varchar(255) NOT NULL DEFAULT 'ALLOW', `type` varchar(255) NOT NULL DEFAULT 'ORGANIZATION', `accessLevel` varchar(255) NOT NULL DEFAULT 'OWN', `resource` varchar(255) NOT NULL DEFAULT 'ORGANIZATION', `permission` varchar(255) NOT NULL DEFAULT 'READ', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `store` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` varchar(36) NOT NULL, `extend` text NULL, `code` varchar(255) NULL, `name` varchar(255) NULL, `externalCustomerId` varchar(255) NULL, `addressLine1` varchar(255) NULL, `addressLine2` varchar(255) NULL, `city` varchar(255) NULL, `state` varchar(255) NULL, `pinCode` varchar(255) NULL, `country` varchar(255) NULL, `externalStoreId` varchar(255) NULL, `STATUS` varchar(255) NULL DEFAULT 'ACTIVE', PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `walkin_product` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(1000) NULL, `latest_version` varchar(255) NOT NULL, `status` varchar(255) NULL DEFAULT 'ACTIVE', UNIQUE INDEX `IDX_28256ca7df87c37aee1484c5d9` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `organization` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` varchar(36) NOT NULL, `extend` text NULL, `name` varchar(255) NOT NULL, `code` varchar(255) NULL, `status` varchar(255) NOT NULL, `phoneNumber` varchar(255) NULL, `website` varchar(255) NULL, `organization_type` varchar(255) NULL, `addressLine1` varchar(255) NULL, `addressLine2` varchar(255) NULL, `city` varchar(255) NULL, `state` varchar(255) NULL, `pinCode` varchar(255) NULL, `country` varchar(255) NULL, `externalOrganizationId` varchar(255) NULL, `parentId` varchar(36) NULL, `storeId` varchar(36) NULL, UNIQUE INDEX `IDX_aa6e74e96ed2dddfcf09782110` (`code`), UNIQUE INDEX `REL_8ea4792a1052c8b8b1aba8a6c6` (`storeId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `rule` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(1000) NULL, `status` varchar(255) NOT NULL DEFAULT 'ACTIVE', `type` varchar(255) NOT NULL DEFAULT 'SIMPLE', `rule_configuration` text NOT NULL, `rule_expression` text NOT NULL, `organization_id` varchar(36) NULL, UNIQUE INDEX `IDX_e272edd8cbd400c7c29462142f` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `campaign` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NULL, `description` varchar(1000) NULL, `campaignType` varchar(255) NULL, `campaignTriggerType` varchar(255) NULL, `priority` int NOT NULL DEFAULT 0, `campaignStatus` varchar(255) NULL, `isCampaignControlEnabled` tinyint NOT NULL DEFAULT 0, `campaignControlPercent` int NOT NULL DEFAULT 0, `isGlobalControlEnabled` int NOT NULL DEFAULT 1, `startTime` datetime NULL, `endTime` datetime NULL, `status` varchar(255) NULL, `trigger_rule_id` int NULL, `ownerId` varchar(36) NULL, `audience_filter_rule_id` int NULL, `application_id` varchar(36) NULL, `organization_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `member` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `applicationId` varchar(255) NOT NULL, `userId` varchar(255) NOT NULL, `Role` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `user` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` varchar(36) NOT NULL, `extend` text NULL, `email` varchar(255) NOT NULL, `firstName` varchar(255) NULL, `lastName` varchar(255) NULL, `password` varchar(1000) NOT NULL, `status` varchar(100) NULL DEFAULT 'ACTIVE', `organizationId` varchar(36) NULL, UNIQUE INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` (`email`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `role` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NULL, `description` varchar(255) NULL, `tags` text NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `api_key` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` varchar(36) NOT NULL, `extend` text NULL, `environment` varchar(255) NOT NULL DEFAULT 'DEVELOPMENT', `status` varchar(255) NOT NULL DEFAULT 'ACTIVE', `applicationId` varchar(36) NULL, `generatedById` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `application` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` varchar(36) NOT NULL, `extend` text NULL, `name` varchar(255) NULL, `description` varchar(255) NULL, `auth_key_hooks` varchar(255) NULL, `platform` varchar(255) NULL, `organizationId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `action` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `validation` tinyint NULL, `actionResult` varchar(255) NULL, `actionData` text NULL, `actionMessage` text NULL, `action_definition_id` int NULL, `organization_id` varchar(36) NULL, `applicationId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `business_rule` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `rule_level` varchar(255) NOT NULL, `rule_type` varchar(255) NOT NULL, `rule_value` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `business_rule_detail` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `rule_level` varchar(255) NOT NULL, `rule_level_id` varchar(255) NOT NULL, `rule_type` varchar(255) NOT NULL, `rule_value` varchar(255) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `segment` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(1000) NULL, `segmentType` varchar(255) NOT NULL, `status` varchar(255) NOT NULL, `rule_id` int NULL, `organization_id` varchar(36) NULL, `application_id` varchar(36) NULL, UNIQUE INDEX `IDX_9e0406598d248857fe96f5e929` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `audience` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `status` varchar(255) NOT NULL, `campaign_id` int NULL, `segment_id` int NULL, `organization_id` varchar(36) NULL, `application_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `customer_device` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` varchar(36) NOT NULL, `extend` text NULL, `fcmToken` varchar(255) NULL, `deviceId` varchar(255) NULL, `osVersion` varchar(255) NULL, `modelNumber` varchar(255) NOT NULL, `status` varchar(255) NULL, `customerId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `customer` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` varchar(36) NOT NULL, `extend` text NULL, `firstName` varchar(255) NULL, `lastName` varchar(255) NULL, `email` varchar(255) NULL, `phoneNumber` varchar(255) NOT NULL, `gender` varchar(255) NULL, `dateOfBirth` varchar(255) NULL, `externalCustomerId` varchar(255) NULL, `customerIdentifier` varchar(255) NULL, `onboard_source` varchar(255) NULL, `status` varchar(255) NULL, `organization_id` varchar(36) NULL, `parentId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `campaign_control` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `startTime` datetime NULL, `endTime` datetime NULL, `status` varchar(255) NOT NULL DEFAULT 'ACTIVE', `customer_id` varchar(36) NULL, `campaign_id` int NULL, `organization_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `global_control` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `startTime` datetime NULL, `endTime` datetime NULL, `status` varchar(255) NOT NULL DEFAULT 'ACTIVE', `organization_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `audience_member` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `status` varchar(255) NOT NULL, `audience_id` int NULL, `customer_id` varchar(36) NULL, UNIQUE INDEX `REL_0a1751eb55c7a28a104cea1885` (`audience_id`), UNIQUE INDEX `REL_42e3c7f4f5d906dc5f05a3bebf` (`customer_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `catalog` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(1000) NOT NULL, `organization_id` varchar(36) NULL, UNIQUE INDEX `IDX_408ad15a08984a8e9b0619ee3e` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `catalog_usage` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `purpose` varchar(255) NOT NULL, `catalog_id` int NULL, `organization_id` varchar(36) NULL, UNIQUE INDEX `REL_221bd7d3f026e7121b990c1116` (`catalog_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `option` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, UNIQUE INDEX `IDX_5e47276c1d6a3fb881283fdbf1` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `option_value` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `value` varchar(255) NOT NULL, `option_id` int NULL, UNIQUE INDEX `IDX_489f2d087b47aff8d3e31b6aaa` (`value`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `product_variant_value` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `product_variant_id` int NULL, `option_value_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `product_variant` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `sku` varchar(255) NOT NULL, `product_id` varchar(36) NULL, UNIQUE INDEX `IDX_f4dc2c0888b66d547c175f090e` (`sku`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `product` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` varchar(36) NOT NULL, `extend` text NULL, `code` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `description` varchar(1000) NULL, `type` varchar(255) NOT NULL DEFAULT 'REGULAR', `imageUrl` varchar(255) NOT NULL DEFAULT 'REGULAR', `sku` varchar(255) NOT NULL DEFAULT 'REGULAR', `status` varchar(255) NULL DEFAULT 'ACTIVE', `organization_id` varchar(36) NULL, UNIQUE INDEX `IDX_99c39b067cfa73c783f0fc49a6` (`code`), UNIQUE INDEX `IDX_22cc43e9a74d7498546e9a63e7` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `product_category` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `product_id` varchar(36) NULL, `category_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `category` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` varchar(36) NOT NULL, `extend` text NULL, `name` varchar(255) NOT NULL, `description` varchar(1000) NULL, `code` varchar(255) NOT NULL, `status` varchar(255) NULL DEFAULT 'ACTIVE', `catalog_id` int NULL, `parentId` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `entity_extend_fields` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `slug` varchar(255) NOT NULL, `label` varchar(255) NULL, `help` varchar(255) NULL, `type` varchar(255) NOT NULL, `required` tinyint NOT NULL DEFAULT 1, `choices` text NULL, `defaultValue` varchar(255) NULL, `validator` varchar(255) NULL, `entity_extend_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `entity_extend` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `entityName` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `organization_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `event_type` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `type` varchar(255) NOT NULL, `format` varchar(255) NULL, `schema` text NULL, `meta` text NULL, `status` varchar(255) NOT NULL DEFAULT 'ACTIVE', UNIQUE INDEX `IDX_f66937d15b24437e3bb5fbcf76` (`type`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `event_subscription` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `queue` varchar(255) NOT NULL, `meta` text NULL, `status` varchar(255) NOT NULL, `event_type_id` int NULL, `organization_id` varchar(36) NULL, `application_id` varchar(36) NULL, UNIQUE INDEX `IDX_31b205e1c93e3a0b623f28b777` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `events` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `producer_event_id` varchar(255) NOT NULL, `producer_event_time` datetime NOT NULL, `event_arrival_time` datetime NOT NULL, `source` varchar(255) NOT NULL DEFAULT 'DEFAULT', `data` text NULL, `event_type_id` int NULL, `organization_id` varchar(36) NULL, `application_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `product_option` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `product_id` varchar(36) NULL, `option_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `rule_entity` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `entity_name` varchar(255) NOT NULL, `entity_code` varchar(255) NOT NULL, `status` varchar(255) NOT NULL DEFAULT 'ACTIVE', `organization_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `rule_attribute` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `attribute_name` varchar(255) NOT NULL, `attribute_value_type` varchar(255) NOT NULL, `description` varchar(1000) NULL, `status` varchar(255) NOT NULL DEFAULT 'ACTIVE', `rule_entity_id` int NULL, `organization_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `session` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` varchar(36) NOT NULL, `extend` text NULL, `status` varchar(255) NULL, `customer_id` varchar(36) NULL, `organization_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `webhook` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `event` varchar(255) NOT NULL, `method` varchar(255) NOT NULL, `url` varchar(255) NOT NULL, `headers` text NOT NULL, `status` varchar(255) NOT NULL, `organization_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `webhook_data` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `data` text NOT NULL, `http_status` varchar(255) NOT NULL, `webhook_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `webhook_event_type` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `event` varchar(255) NOT NULL, `status` varchar(255) NOT NULL, UNIQUE INDEX `IDX_f4d2864a39b5a79ccd7104d33c` (`event`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `workflow` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `organization_id` varchar(36) NULL, UNIQUE INDEX `IDX_8ec5afd3566bb368910c59f441` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `workflow_entity` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `entity_id` varchar(255) NOT NULL, `entity_type` varchar(255) NOT NULL, `workflow_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `workflow_process` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `workflow_id` int NULL, UNIQUE INDEX `IDX_7756b0d84326656e38d1480afb` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `workflow_state` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `code` int NOT NULL, `description` varchar(255) NOT NULL, `workflow_id` int NULL, UNIQUE INDEX `IDX_554a1e68bf7d4cfddb48ecc6e5` (`code`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `workflow_process_transition` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `rule_config` varchar(255) NOT NULL, `pickup_state_id` int NULL, `drop_state_id` int NULL, `workflow_process_id` int NULL, UNIQUE INDEX `IDX_9a9ab3ca5323d398b127340acb` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `workflow_entity_transition` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `workflow_entity_id` int NULL, `workflow_process_transition_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `workflow_entity_transition_history` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `workflow_entity_id` int NULL, `workflow_process_transition_id` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `metric_filter` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `key` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `status` varchar(255) NOT NULL, UNIQUE INDEX `IDX_99ee6eca594b7fd47ec208385e` (`name`), UNIQUE INDEX `IDX_1192c0fd503a6cf0728a903864` (`key`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `metric` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(255) NOT NULL, `query` varchar(255) NOT NULL, `type` varchar(255) NOT NULL,`source` varchar(255) NULL, `status` varchar(255) NOT NULL, `organization_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `message_template` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `description` varchar(1000) NOT NULL, `messageFormat` varchar(255) NOT NULL, `templateBodyText` text NOT NULL, `templateSubjectText` varchar(1000) NOT NULL, `templateStyle` varchar(100) NOT NULL, `status` varchar(255) NOT NULL, `organization_id` varchar(36) NULL, UNIQUE INDEX `IDX_332cce35545f88fa6a69a56d18` (`name`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `message_template_variable` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NOT NULL, `key` varchar(255) NOT NULL, `type` varchar(255) NOT NULL, `format` varchar(255) NOT NULL, `defaultValue` varchar(255) NULL, `required` tinyint NOT NULL, `status` varchar(255) NOT NULL, `messageTemplateId` int NULL, `organization_id` varchar(36) NULL, UNIQUE INDEX `IDX_e066811dd4a31d4aaa1011b533` (`name`), UNIQUE INDEX `IDX_ffcf58ae9128ab7509e15b2f49` (`key`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `workflow_route` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `entity_type` varchar(255) NOT NULL, `status` varchar(255) NOT NULL, `workflow_id` int NULL, `rule_id` int NULL, `organization_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `offer` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `name` varchar(255) NULL, `description` varchar(255) NULL, `offerCategory` varchar(255) NULL, `offerType` varchar(255) NULL, `reward` text NULL, `status` varchar(255) NULL, `state` varchar(255) NULL, `stateCode` int NOT NULL, `isCustomCoupon` tinyint NULL, `coupon` varchar(255) NULL, `offerEligibilityRule_id` int NULL, `rewardRedemptionRule_id` int NULL, `organization_id` varchar(36) NULL, UNIQUE INDEX `IDX_93f350ef80008e9c1aad98cbf6` (`stateCode`), UNIQUE INDEX `IDX_282b296ca0d156c123cc0b38c0` (`coupon`), UNIQUE INDEX `REL_72cb605dad1c0ed4c79e35b358` (`offerEligibilityRule_id`), UNIQUE INDEX `REL_8cb3c188dbac3513ce1c532fb6` (`rewardRedemptionRule_id`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `campaign_offers` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `startDate` datetime NULL, `endDate` datetime NULL, `status` varchar(255) NULL, `offer_id` int NULL, `campaign_id` int NULL, `organization_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `coupon` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `coupon` varchar(255) NULL, `status` varchar(255) NULL, `campaign_id` int NULL, `offer_id` int NULL, `customer_id` varchar(36) NULL, `organization_id` varchar(36) NULL, UNIQUE INDEX `IDX_75af98fc8fbae69cf49e6df639` (`coupon`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `customer_offer_redemption` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `campaignOffer` varchar(255) NULL, `redeemDateTime` datetime NULL, `transactionDateTime` datetime NULL, `transactionData` text NULL, `customer_id` varchar(36) NULL, `campaign_id` int NULL, `offer_id` int NULL, `organization_id` varchar(36) NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `response` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `questionData` text NOT NULL, `responseData` text NOT NULL, `customerFeedbackId` varchar(36) NULL, `choiceSelectedId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `choice` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `choiceText` varchar(255) NULL, `rangeStart` int NULL, `rangeEnd` int NULL, `fromQuestionId` int NULL, `toQuestionId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `feedback_handler` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `feedback_category` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `parentId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `question` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `questionText` varchar(255) NULL, `type` varchar(255) NULL DEFAULT 'TEXT', `rangeMin` int NULL, `rangeMax` int NULL, `feedbackCategoryId` int NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `feedback_form` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `questionnaireRootId` int NULL, `campaignId` int NULL, UNIQUE INDEX `REL_ad6eef848f72a331779a201c95` (`questionnaireRootId`), UNIQUE INDEX `REL_6c973ea4d22982b5464036f5f6` (`campaignId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `customer_feedback` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` varchar(36) NOT NULL, `extend` text NULL, `completed` tinyint NOT NULL DEFAULT 0, `customerId` varchar(36) NULL, `feedbackFormId` int NULL, `eventId` int NULL, UNIQUE INDEX `REL_6241ad4637d5f8c1c8e557322f` (`eventId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `customer_feedback_configs` (`created_by` varchar(255) NOT NULL, `last_modified_by` varchar(255) NOT NULL, `created_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `last_modified_time` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `id` int NOT NULL AUTO_INCREMENT, `text` varchar(255) NOT NULL DEFAULT '', `primaryColor` varchar(255) NULL, `secondaryColor` varchar(255) NULL, `transition` varchar(255) NULL DEFAULT 'horizontal', `customerFeedbackId` varchar(36) NULL, UNIQUE INDEX `REL_14103cfd243785c9e87357b531` (`customerFeedbackId`), PRIMARY KEY (`id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `walkin_product_org` (`walkin_product_id` int NOT NULL, `organization_id` varchar(36) NOT NULL, INDEX `IDX_f3fa5ba86050feff9785ee9790` (`walkin_product_id`), INDEX `IDX_4fa276e89d5488ec1cb626a7ad` (`organization_id`), PRIMARY KEY (`walkin_product_id`, `organization_id`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `user_roles_role` (`userId` varchar(36) NOT NULL, `roleId` int NOT NULL, INDEX `IDX_5f9286e6c25594c6b88c108db7` (`userId`), INDEX `IDX_4be2f7adf862634f5f803d246b` (`roleId`), PRIMARY KEY (`userId`, `roleId`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `role_policies_policy` (`roleId` int NOT NULL, `policyId` int NOT NULL, INDEX `IDX_77a05aab87336e865f79c05874` (`roleId`), INDEX `IDX_e7d4d602e498d9684443f6ba13` (`policyId`), PRIMARY KEY (`roleId`, `policyId`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `api_key_roles_role` (`apiKeyId` varchar(36) NOT NULL, `roleId` int NOT NULL, INDEX `IDX_0cad0c0339988fd6a3f78f89c3` (`apiKeyId`), INDEX `IDX_71f23548b2ea751cda772bcbdb` (`roleId`), PRIMARY KEY (`apiKeyId`, `roleId`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `metric_filters_metric_filter` (`metricId` int NOT NULL, `metricFilterId` int NOT NULL, INDEX `IDX_45c4ebe98367f7da3122abf266` (`metricId`), INDEX `IDX_c5700a15e6de5ab30dcfa9928a` (`metricFilterId`), PRIMARY KEY (`metricId`, `metricFilterId`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `FeedbackCategoryOrganizationRel` (`feedbackCategoryId` int NOT NULL, `organizationId` varchar(36) NOT NULL, INDEX `IDX_de7e665a5b2d0635cc7b56dbdf` (`feedbackCategoryId`), INDEX `IDX_5b9b9e52ab00fb7cbf27965fb1` (`organizationId`), PRIMARY KEY (`feedbackCategoryId`, `organizationId`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `organization_closure` (`id_ancestor` varchar(255) NOT NULL, `id_descendant` varchar(255) NOT NULL, INDEX `IDX_ea74b7c4a55b7887af4470ea46` (`id_ancestor`), INDEX `IDX_f51963aac115d526960ac74cf2` (`id_descendant`), PRIMARY KEY (`id_ancestor`, `id_descendant`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `category_closure` (`id_ancestor` varchar(255) NOT NULL, `id_descendant` varchar(255) NOT NULL, INDEX `IDX_4aa1348fc4b7da9bef0fae8ff4` (`id_ancestor`), INDEX `IDX_6a22002acac4976977b1efd114` (`id_descendant`), PRIMARY KEY (`id_ancestor`, `id_descendant`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "CREATE TABLE `feedback_category_closure` (`id_ancestor` int NOT NULL, `id_descendant` int NOT NULL, INDEX `IDX_e42b4ec5af683f4f9ffb5a0528` (`id_ancestor`), INDEX `IDX_295761650ecf9c371e4b5e78b4` (`id_descendant`), PRIMARY KEY (`id_ancestor`, `id_descendant`)) ENGINE=InnoDB"
    );
    await queryRunner.query(
      "ALTER TABLE `action_definition` ADD CONSTRAINT `FK_8c22e041093b11f3287b982330e` FOREIGN KEY (`action_type_id`) REFERENCES `action_type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `organization` ADD CONSTRAINT `FK_da6c3ae56a0c3fc3ce81b0e90a6` FOREIGN KEY (`parentId`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `organization` ADD CONSTRAINT `FK_8ea4792a1052c8b8b1aba8a6c6c` FOREIGN KEY (`storeId`) REFERENCES `store`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `rule` ADD CONSTRAINT `FK_c10c6407af89cbb2de449670e6b` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign` ADD CONSTRAINT `FK_1193a9f2460ee9a9705a96a8d8e` FOREIGN KEY (`trigger_rule_id`) REFERENCES `rule`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign` ADD CONSTRAINT `FK_470ffd2c3c3fa8e2269af93924d` FOREIGN KEY (`ownerId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign` ADD CONSTRAINT `FK_b5c4c0412080b0f4e1bc14f06bd` FOREIGN KEY (`audience_filter_rule_id`) REFERENCES `rule`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign` ADD CONSTRAINT `FK_f20e1f5cb5bb6cdb95fb0f6c5b2` FOREIGN KEY (`application_id`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign` ADD CONSTRAINT `FK_8e2fbfe1fc6dc632c4631a1224b` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `member` ADD CONSTRAINT `FK_74b6b9924cdfdc39bfab5330d40` FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `member` ADD CONSTRAINT `FK_08897b166dee565859b7fb2fcc8` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `user` ADD CONSTRAINT `FK_dfda472c0af7812401e592b6a61` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `api_key` ADD CONSTRAINT `FK_c4a5095066c00dccb60c862489e` FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `api_key` ADD CONSTRAINT `FK_13ae2648860cf5bba4c36d9b4b9` FOREIGN KEY (`generatedById`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `application` ADD CONSTRAINT `FK_88e675c3f80602005b728979e4a` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `action` ADD CONSTRAINT `FK_9068aa368b8e6dd44f054054431` FOREIGN KEY (`action_definition_id`) REFERENCES `action_definition`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `action` ADD CONSTRAINT `FK_e60f38865de4c5255fdef557955` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `action` ADD CONSTRAINT `FK_cd282cee5d1c9e4e7d7b4c4df70` FOREIGN KEY (`applicationId`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `segment` ADD CONSTRAINT `FK_afd3b8b976f0d4529f4ba950e57` FOREIGN KEY (`rule_id`) REFERENCES `rule`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `segment` ADD CONSTRAINT `FK_af89ecbd81bad529fad041440ff` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `segment` ADD CONSTRAINT `FK_7f85834d4bad4979280f938d7e0` FOREIGN KEY (`application_id`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `audience` ADD CONSTRAINT `FK_fcd16b3cf7dc88ea69d8101ae60` FOREIGN KEY (`campaign_id`) REFERENCES `campaign`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `audience` ADD CONSTRAINT `FK_20ba4b7743f36afb67beccb30ff` FOREIGN KEY (`segment_id`) REFERENCES `segment`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `audience` ADD CONSTRAINT `FK_0ed458a52aca357de502ae9ca20` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `audience` ADD CONSTRAINT `FK_a0d9c257e4e5c8ad393ebd0ff48` FOREIGN KEY (`application_id`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_device` ADD CONSTRAINT `FK_6b39c096ab23ae90db8795d98d2` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `customer` ADD CONSTRAINT `FK_f59a476121c4fe9ea136699a95d` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `customer` ADD CONSTRAINT `FK_009f5197ebf5eea0f815cdec07e` FOREIGN KEY (`parentId`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign_control` ADD CONSTRAINT `FK_c4354a7e9be05fd5737bc8d4c42` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign_control` ADD CONSTRAINT `FK_c3ff286dbb0b6ff3b81178741ff` FOREIGN KEY (`campaign_id`) REFERENCES `campaign`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign_control` ADD CONSTRAINT `FK_7c817fb5eedf92c60489bd3cf7c` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `global_control` ADD CONSTRAINT `FK_4d6d79a027802ede338c87e85dc` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `audience_member` ADD CONSTRAINT `FK_0a1751eb55c7a28a104cea18857` FOREIGN KEY (`audience_id`) REFERENCES `audience`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `audience_member` ADD CONSTRAINT `FK_42e3c7f4f5d906dc5f05a3bebf7` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `catalog` ADD CONSTRAINT `FK_7264a80c370a502036f9577cac3` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `catalog_usage` ADD CONSTRAINT `FK_221bd7d3f026e7121b990c11168` FOREIGN KEY (`catalog_id`) REFERENCES `catalog`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `catalog_usage` ADD CONSTRAINT `FK_d5d581922bbe9bcb2a0982429da` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `option_value` ADD CONSTRAINT `FK_fd5bfb13a905b965a5103b65163` FOREIGN KEY (`option_id`) REFERENCES `option`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_value` ADD CONSTRAINT `FK_d5797bca28269d9c17f8acfded1` FOREIGN KEY (`product_variant_id`) REFERENCES `product_variant`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_value` ADD CONSTRAINT `FK_7f84424c3d7d24f384eb47ca49e` FOREIGN KEY (`option_value_id`) REFERENCES `option_value`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` ADD CONSTRAINT `FK_ca67dd080aac5ecf99609960cd2` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `product` ADD CONSTRAINT `FK_856d7e7672c2a22652daf70e1e7` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `product_category` ADD CONSTRAINT `FK_0374879a971928bc3f57eed0a59` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `product_category` ADD CONSTRAINT `FK_2df1f83329c00e6eadde0493e16` FOREIGN KEY (`category_id`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `category` ADD CONSTRAINT `FK_ddd03d18d0e3c52e5c7c6a19866` FOREIGN KEY (`catalog_id`) REFERENCES `catalog`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `category` ADD CONSTRAINT `FK_d5456fd7e4c4866fec8ada1fa10` FOREIGN KEY (`parentId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `entity_extend_fields` ADD CONSTRAINT `FK_6c1bad23672c78cda9365cf8343` FOREIGN KEY (`entity_extend_id`) REFERENCES `entity_extend`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `entity_extend` ADD CONSTRAINT `FK_8a7689112e2c676cbec1e756ea0` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `event_subscription` ADD CONSTRAINT `FK_0461ce0a325bdf442e4f56fac9d` FOREIGN KEY (`event_type_id`) REFERENCES `event_type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `event_subscription` ADD CONSTRAINT `FK_c0e9fb56654aa775d1cc951f3c1` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `event_subscription` ADD CONSTRAINT `FK_fd4ad0642e788a5bd72e2039b72` FOREIGN KEY (`application_id`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `events` ADD CONSTRAINT `FK_cca2d7a421ac4b1b24b9996d101` FOREIGN KEY (`event_type_id`) REFERENCES `event_type`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `events` ADD CONSTRAINT `FK_8557ec49101496ab87be666d633` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `events` ADD CONSTRAINT `FK_d682e6004909b59ceec39aa3d34` FOREIGN KEY (`application_id`) REFERENCES `application`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `product_option` ADD CONSTRAINT `FK_e634fca34f6b594b87fdbee95f6` FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `product_option` ADD CONSTRAINT `FK_9f53e0e9868b4d64b048bff8701` FOREIGN KEY (`option_id`) REFERENCES `option`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `rule_entity` ADD CONSTRAINT `FK_ca615e5563e916198ac01fec780` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `rule_attribute` ADD CONSTRAINT `FK_ff862f359b5787c610fdf57b493` FOREIGN KEY (`rule_entity_id`) REFERENCES `rule_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `rule_attribute` ADD CONSTRAINT `FK_512a5ae6eabc585f191fa122dff` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `session` ADD CONSTRAINT `FK_d2ff75316511596841335e82cd7` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `session` ADD CONSTRAINT `FK_adeb5918e4fe0997ef63f15b791` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `webhook` ADD CONSTRAINT `FK_2d4f7f00655c8aa6a4bb69a9add` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `webhook_data` ADD CONSTRAINT `FK_32ce935f84b2fac3203e3e2c590` FOREIGN KEY (`webhook_id`) REFERENCES `webhook`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow` ADD CONSTRAINT `FK_0a00f8a2b02e6c81f3c5450f260` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_entity` ADD CONSTRAINT `FK_2fb4c22390390fdc77f780a6da6` FOREIGN KEY (`workflow_id`) REFERENCES `workflow`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_process` ADD CONSTRAINT `FK_0f28d982d672437bdd7a1d23d67` FOREIGN KEY (`workflow_id`) REFERENCES `workflow`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_state` ADD CONSTRAINT `FK_8f019434755f68eeeffa524d06a` FOREIGN KEY (`workflow_id`) REFERENCES `workflow`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_process_transition` ADD CONSTRAINT `FK_a117ce0a4055e2feddc13808157` FOREIGN KEY (`pickup_state_id`) REFERENCES `workflow_state`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_process_transition` ADD CONSTRAINT `FK_19fa6979abea530c5c65dcbcad2` FOREIGN KEY (`drop_state_id`) REFERENCES `workflow_state`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_process_transition` ADD CONSTRAINT `FK_532c86eadb78324abe76aa49d81` FOREIGN KEY (`workflow_process_id`) REFERENCES `workflow_process`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_entity_transition` ADD CONSTRAINT `FK_77e385161b169723fe5d6606a5a` FOREIGN KEY (`workflow_entity_id`) REFERENCES `workflow_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_entity_transition` ADD CONSTRAINT `FK_b08bc25e48e49219c9c615ea795` FOREIGN KEY (`workflow_process_transition_id`) REFERENCES `workflow_process_transition`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_entity_transition_history` ADD CONSTRAINT `FK_f01653635110556bdec2e53bc59` FOREIGN KEY (`workflow_entity_id`) REFERENCES `workflow_entity`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_entity_transition_history` ADD CONSTRAINT `FK_39122c5be6a34a3a721dfa08524` FOREIGN KEY (`workflow_process_transition_id`) REFERENCES `workflow_process_transition`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `metric` ADD CONSTRAINT `FK_bbd390ca4055143ce4b002dd944` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `message_template` ADD CONSTRAINT `FK_b6dec49a6de32bb92b7d1bdc761` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `message_template_variable` ADD CONSTRAINT `FK_ded01297ddd11563d28cfd25745` FOREIGN KEY (`messageTemplateId`) REFERENCES `message_template`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `message_template_variable` ADD CONSTRAINT `FK_101c1d26ccb8876c3cca4c4a0a3` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_route` ADD CONSTRAINT `FK_24b7adfd8f848f6c00412268014` FOREIGN KEY (`workflow_id`) REFERENCES `workflow`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_route` ADD CONSTRAINT `FK_c9bd6c824b4834c65cf9cc424f6` FOREIGN KEY (`rule_id`) REFERENCES `rule`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_route` ADD CONSTRAINT `FK_f465e56576a28ac7ccfb92bbf13` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `offer` ADD CONSTRAINT `FK_72cb605dad1c0ed4c79e35b3589` FOREIGN KEY (`offerEligibilityRule_id`) REFERENCES `rule`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `offer` ADD CONSTRAINT `FK_8cb3c188dbac3513ce1c532fb6a` FOREIGN KEY (`rewardRedemptionRule_id`) REFERENCES `rule`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `offer` ADD CONSTRAINT `FK_d5911f5c73c2a83b3df5803b66a` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign_offers` ADD CONSTRAINT `FK_562ac6c2247e2922b5bb7940ce5` FOREIGN KEY (`offer_id`) REFERENCES `offer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign_offers` ADD CONSTRAINT `FK_8c385a79ed4c0e24ae39fc29f76` FOREIGN KEY (`campaign_id`) REFERENCES `campaign`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign_offers` ADD CONSTRAINT `FK_3191ebc36d523477e03c3b0c6f6` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `coupon` ADD CONSTRAINT `FK_f39dd537a7219bcccde324c2586` FOREIGN KEY (`campaign_id`) REFERENCES `campaign`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `coupon` ADD CONSTRAINT `FK_8c340fa8d64cdb2033209d43773` FOREIGN KEY (`offer_id`) REFERENCES `offer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `coupon` ADD CONSTRAINT `FK_488b6d2a93ad31b4cd5e1e01cfe` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `coupon` ADD CONSTRAINT `FK_67e3f26087d0b6806693359b472` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_offer_redemption` ADD CONSTRAINT `FK_a17fdd66fcb72275c52f2d040e7` FOREIGN KEY (`customer_id`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_offer_redemption` ADD CONSTRAINT `FK_bf92d3031c3a081bc683f4f5db3` FOREIGN KEY (`campaign_id`) REFERENCES `campaign`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_offer_redemption` ADD CONSTRAINT `FK_769449b782610c6c4c016a2f354` FOREIGN KEY (`offer_id`) REFERENCES `offer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_offer_redemption` ADD CONSTRAINT `FK_9a4d07b771a6004357320b37f4e` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `response` ADD CONSTRAINT `FK_550aea9c8a350bbb086e02f5c6f` FOREIGN KEY (`customerFeedbackId`) REFERENCES `customer_feedback`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `response` ADD CONSTRAINT `FK_d694fec000933f47f54a6891eeb` FOREIGN KEY (`choiceSelectedId`) REFERENCES `choice`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `choice` ADD CONSTRAINT `FK_bed033411ff0351478187760c93` FOREIGN KEY (`fromQuestionId`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `choice` ADD CONSTRAINT `FK_e72f9ff94861a97f70fcbc1e7de` FOREIGN KEY (`toQuestionId`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `feedback_category` ADD CONSTRAINT `FK_42a8a2f0a231de34886cd25a215` FOREIGN KEY (`parentId`) REFERENCES `feedback_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `question` ADD CONSTRAINT `FK_873e5eb2fe2a6e63b9bd381ef6d` FOREIGN KEY (`feedbackCategoryId`) REFERENCES `feedback_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `feedback_form` ADD CONSTRAINT `FK_ad6eef848f72a331779a201c950` FOREIGN KEY (`questionnaireRootId`) REFERENCES `question`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `feedback_form` ADD CONSTRAINT `FK_6c973ea4d22982b5464036f5f69` FOREIGN KEY (`campaignId`) REFERENCES `campaign`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_feedback` ADD CONSTRAINT `FK_3b6a72756eac949812ac4c505b4` FOREIGN KEY (`customerId`) REFERENCES `customer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_feedback` ADD CONSTRAINT `FK_116dc18c7880a2cdd9e1d5bca28` FOREIGN KEY (`feedbackFormId`) REFERENCES `feedback_form`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_feedback` ADD CONSTRAINT `FK_6241ad4637d5f8c1c8e557322fd` FOREIGN KEY (`eventId`) REFERENCES `events`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_feedback_configs` ADD CONSTRAINT `FK_14103cfd243785c9e87357b5319` FOREIGN KEY (`customerFeedbackId`) REFERENCES `customer_feedback`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `walkin_product_org` ADD CONSTRAINT `FK_f3fa5ba86050feff9785ee9790f` FOREIGN KEY (`walkin_product_id`) REFERENCES `walkin_product`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `walkin_product_org` ADD CONSTRAINT `FK_4fa276e89d5488ec1cb626a7ad2` FOREIGN KEY (`organization_id`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_5f9286e6c25594c6b88c108db77` FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `user_roles_role` ADD CONSTRAINT `FK_4be2f7adf862634f5f803d246b8` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `role_policies_policy` ADD CONSTRAINT `FK_77a05aab87336e865f79c058745` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `role_policies_policy` ADD CONSTRAINT `FK_e7d4d602e498d9684443f6ba132` FOREIGN KEY (`policyId`) REFERENCES `policy`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `api_key_roles_role` ADD CONSTRAINT `FK_0cad0c0339988fd6a3f78f89c36` FOREIGN KEY (`apiKeyId`) REFERENCES `api_key`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `api_key_roles_role` ADD CONSTRAINT `FK_71f23548b2ea751cda772bcbdbd` FOREIGN KEY (`roleId`) REFERENCES `role`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `metric_filters_metric_filter` ADD CONSTRAINT `FK_45c4ebe98367f7da3122abf2662` FOREIGN KEY (`metricId`) REFERENCES `metric`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `metric_filters_metric_filter` ADD CONSTRAINT `FK_c5700a15e6de5ab30dcfa9928af` FOREIGN KEY (`metricFilterId`) REFERENCES `metric_filter`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `FeedbackCategoryOrganizationRel` ADD CONSTRAINT `FK_de7e665a5b2d0635cc7b56dbdfa` FOREIGN KEY (`feedbackCategoryId`) REFERENCES `feedback_category`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `FeedbackCategoryOrganizationRel` ADD CONSTRAINT `FK_5b9b9e52ab00fb7cbf27965fb11` FOREIGN KEY (`organizationId`) REFERENCES `organization`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `organization_closure` ADD CONSTRAINT `FK_ea74b7c4a55b7887af4470ea468` FOREIGN KEY (`id_ancestor`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `organization_closure` ADD CONSTRAINT `FK_f51963aac115d526960ac74cf2f` FOREIGN KEY (`id_descendant`) REFERENCES `organization`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `category_closure` ADD CONSTRAINT `FK_4aa1348fc4b7da9bef0fae8ff48` FOREIGN KEY (`id_ancestor`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `category_closure` ADD CONSTRAINT `FK_6a22002acac4976977b1efd114a` FOREIGN KEY (`id_descendant`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `feedback_category_closure` ADD CONSTRAINT `FK_e42b4ec5af683f4f9ffb5a0528f` FOREIGN KEY (`id_ancestor`) REFERENCES `feedback_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
    await queryRunner.query(
      "ALTER TABLE `feedback_category_closure` ADD CONSTRAINT `FK_295761650ecf9c371e4b5e78b4d` FOREIGN KEY (`id_descendant`) REFERENCES `feedback_category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION"
    );
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `feedback_category_closure` DROP FOREIGN KEY `FK_295761650ecf9c371e4b5e78b4d`"
    );
    await queryRunner.query(
      "ALTER TABLE `feedback_category_closure` DROP FOREIGN KEY `FK_e42b4ec5af683f4f9ffb5a0528f`"
    );
    await queryRunner.query(
      "ALTER TABLE `category_closure` DROP FOREIGN KEY `FK_6a22002acac4976977b1efd114a`"
    );
    await queryRunner.query(
      "ALTER TABLE `category_closure` DROP FOREIGN KEY `FK_4aa1348fc4b7da9bef0fae8ff48`"
    );
    await queryRunner.query(
      "ALTER TABLE `organization_closure` DROP FOREIGN KEY `FK_f51963aac115d526960ac74cf2f`"
    );
    await queryRunner.query(
      "ALTER TABLE `organization_closure` DROP FOREIGN KEY `FK_ea74b7c4a55b7887af4470ea468`"
    );
    await queryRunner.query(
      "ALTER TABLE `FeedbackCategoryOrganizationRel` DROP FOREIGN KEY `FK_5b9b9e52ab00fb7cbf27965fb11`"
    );
    await queryRunner.query(
      "ALTER TABLE `FeedbackCategoryOrganizationRel` DROP FOREIGN KEY `FK_de7e665a5b2d0635cc7b56dbdfa`"
    );
    await queryRunner.query(
      "ALTER TABLE `metric_filters_metric_filter` DROP FOREIGN KEY `FK_c5700a15e6de5ab30dcfa9928af`"
    );
    await queryRunner.query(
      "ALTER TABLE `metric_filters_metric_filter` DROP FOREIGN KEY `FK_45c4ebe98367f7da3122abf2662`"
    );
    await queryRunner.query(
      "ALTER TABLE `api_key_roles_role` DROP FOREIGN KEY `FK_71f23548b2ea751cda772bcbdbd`"
    );
    await queryRunner.query(
      "ALTER TABLE `api_key_roles_role` DROP FOREIGN KEY `FK_0cad0c0339988fd6a3f78f89c36`"
    );
    await queryRunner.query(
      "ALTER TABLE `role_policies_policy` DROP FOREIGN KEY `FK_e7d4d602e498d9684443f6ba132`"
    );
    await queryRunner.query(
      "ALTER TABLE `role_policies_policy` DROP FOREIGN KEY `FK_77a05aab87336e865f79c058745`"
    );
    await queryRunner.query(
      "ALTER TABLE `user_roles_role` DROP FOREIGN KEY `FK_4be2f7adf862634f5f803d246b8`"
    );
    await queryRunner.query(
      "ALTER TABLE `user_roles_role` DROP FOREIGN KEY `FK_5f9286e6c25594c6b88c108db77`"
    );
    await queryRunner.query(
      "ALTER TABLE `walkin_product_org` DROP FOREIGN KEY `FK_4fa276e89d5488ec1cb626a7ad2`"
    );
    await queryRunner.query(
      "ALTER TABLE `walkin_product_org` DROP FOREIGN KEY `FK_f3fa5ba86050feff9785ee9790f`"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_feedback_configs` DROP FOREIGN KEY `FK_14103cfd243785c9e87357b5319`"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_feedback` DROP FOREIGN KEY `FK_6241ad4637d5f8c1c8e557322fd`"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_feedback` DROP FOREIGN KEY `FK_116dc18c7880a2cdd9e1d5bca28`"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_feedback` DROP FOREIGN KEY `FK_3b6a72756eac949812ac4c505b4`"
    );
    await queryRunner.query(
      "ALTER TABLE `feedback_form` DROP FOREIGN KEY `FK_6c973ea4d22982b5464036f5f69`"
    );
    await queryRunner.query(
      "ALTER TABLE `feedback_form` DROP FOREIGN KEY `FK_ad6eef848f72a331779a201c950`"
    );
    await queryRunner.query(
      "ALTER TABLE `question` DROP FOREIGN KEY `FK_873e5eb2fe2a6e63b9bd381ef6d`"
    );
    await queryRunner.query(
      "ALTER TABLE `feedback_category` DROP FOREIGN KEY `FK_42a8a2f0a231de34886cd25a215`"
    );
    await queryRunner.query(
      "ALTER TABLE `choice` DROP FOREIGN KEY `FK_e72f9ff94861a97f70fcbc1e7de`"
    );
    await queryRunner.query(
      "ALTER TABLE `choice` DROP FOREIGN KEY `FK_bed033411ff0351478187760c93`"
    );
    await queryRunner.query(
      "ALTER TABLE `response` DROP FOREIGN KEY `FK_d694fec000933f47f54a6891eeb`"
    );
    await queryRunner.query(
      "ALTER TABLE `response` DROP FOREIGN KEY `FK_550aea9c8a350bbb086e02f5c6f`"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_offer_redemption` DROP FOREIGN KEY `FK_9a4d07b771a6004357320b37f4e`"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_offer_redemption` DROP FOREIGN KEY `FK_769449b782610c6c4c016a2f354`"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_offer_redemption` DROP FOREIGN KEY `FK_bf92d3031c3a081bc683f4f5db3`"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_offer_redemption` DROP FOREIGN KEY `FK_a17fdd66fcb72275c52f2d040e7`"
    );
    await queryRunner.query(
      "ALTER TABLE `coupon` DROP FOREIGN KEY `FK_67e3f26087d0b6806693359b472`"
    );
    await queryRunner.query(
      "ALTER TABLE `coupon` DROP FOREIGN KEY `FK_488b6d2a93ad31b4cd5e1e01cfe`"
    );
    await queryRunner.query(
      "ALTER TABLE `coupon` DROP FOREIGN KEY `FK_8c340fa8d64cdb2033209d43773`"
    );
    await queryRunner.query(
      "ALTER TABLE `coupon` DROP FOREIGN KEY `FK_f39dd537a7219bcccde324c2586`"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign_offers` DROP FOREIGN KEY `FK_3191ebc36d523477e03c3b0c6f6`"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign_offers` DROP FOREIGN KEY `FK_8c385a79ed4c0e24ae39fc29f76`"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign_offers` DROP FOREIGN KEY `FK_562ac6c2247e2922b5bb7940ce5`"
    );
    await queryRunner.query(
      "ALTER TABLE `offer` DROP FOREIGN KEY `FK_d5911f5c73c2a83b3df5803b66a`"
    );
    await queryRunner.query(
      "ALTER TABLE `offer` DROP FOREIGN KEY `FK_8cb3c188dbac3513ce1c532fb6a`"
    );
    await queryRunner.query(
      "ALTER TABLE `offer` DROP FOREIGN KEY `FK_72cb605dad1c0ed4c79e35b3589`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_route` DROP FOREIGN KEY `FK_f465e56576a28ac7ccfb92bbf13`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_route` DROP FOREIGN KEY `FK_c9bd6c824b4834c65cf9cc424f6`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_route` DROP FOREIGN KEY `FK_24b7adfd8f848f6c00412268014`"
    );
    await queryRunner.query(
      "ALTER TABLE `message_template_variable` DROP FOREIGN KEY `FK_101c1d26ccb8876c3cca4c4a0a3`"
    );
    await queryRunner.query(
      "ALTER TABLE `message_template_variable` DROP FOREIGN KEY `FK_ded01297ddd11563d28cfd25745`"
    );
    await queryRunner.query(
      "ALTER TABLE `message_template` DROP FOREIGN KEY `FK_b6dec49a6de32bb92b7d1bdc761`"
    );
    await queryRunner.query(
      "ALTER TABLE `metric` DROP FOREIGN KEY `FK_bbd390ca4055143ce4b002dd944`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_entity_transition_history` DROP FOREIGN KEY `FK_39122c5be6a34a3a721dfa08524`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_entity_transition_history` DROP FOREIGN KEY `FK_f01653635110556bdec2e53bc59`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_entity_transition` DROP FOREIGN KEY `FK_b08bc25e48e49219c9c615ea795`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_entity_transition` DROP FOREIGN KEY `FK_77e385161b169723fe5d6606a5a`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_process_transition` DROP FOREIGN KEY `FK_532c86eadb78324abe76aa49d81`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_process_transition` DROP FOREIGN KEY `FK_19fa6979abea530c5c65dcbcad2`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_process_transition` DROP FOREIGN KEY `FK_a117ce0a4055e2feddc13808157`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_state` DROP FOREIGN KEY `FK_8f019434755f68eeeffa524d06a`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_process` DROP FOREIGN KEY `FK_0f28d982d672437bdd7a1d23d67`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow_entity` DROP FOREIGN KEY `FK_2fb4c22390390fdc77f780a6da6`"
    );
    await queryRunner.query(
      "ALTER TABLE `workflow` DROP FOREIGN KEY `FK_0a00f8a2b02e6c81f3c5450f260`"
    );
    await queryRunner.query(
      "ALTER TABLE `webhook_data` DROP FOREIGN KEY `FK_32ce935f84b2fac3203e3e2c590`"
    );
    await queryRunner.query(
      "ALTER TABLE `webhook` DROP FOREIGN KEY `FK_2d4f7f00655c8aa6a4bb69a9add`"
    );
    await queryRunner.query(
      "ALTER TABLE `session` DROP FOREIGN KEY `FK_adeb5918e4fe0997ef63f15b791`"
    );
    await queryRunner.query(
      "ALTER TABLE `session` DROP FOREIGN KEY `FK_d2ff75316511596841335e82cd7`"
    );
    await queryRunner.query(
      "ALTER TABLE `rule_attribute` DROP FOREIGN KEY `FK_512a5ae6eabc585f191fa122dff`"
    );
    await queryRunner.query(
      "ALTER TABLE `rule_attribute` DROP FOREIGN KEY `FK_ff862f359b5787c610fdf57b493`"
    );
    await queryRunner.query(
      "ALTER TABLE `rule_entity` DROP FOREIGN KEY `FK_ca615e5563e916198ac01fec780`"
    );
    await queryRunner.query(
      "ALTER TABLE `product_option` DROP FOREIGN KEY `FK_9f53e0e9868b4d64b048bff8701`"
    );
    await queryRunner.query(
      "ALTER TABLE `product_option` DROP FOREIGN KEY `FK_e634fca34f6b594b87fdbee95f6`"
    );
    await queryRunner.query(
      "ALTER TABLE `events` DROP FOREIGN KEY `FK_d682e6004909b59ceec39aa3d34`"
    );
    await queryRunner.query(
      "ALTER TABLE `events` DROP FOREIGN KEY `FK_8557ec49101496ab87be666d633`"
    );
    await queryRunner.query(
      "ALTER TABLE `events` DROP FOREIGN KEY `FK_cca2d7a421ac4b1b24b9996d101`"
    );
    await queryRunner.query(
      "ALTER TABLE `event_subscription` DROP FOREIGN KEY `FK_fd4ad0642e788a5bd72e2039b72`"
    );
    await queryRunner.query(
      "ALTER TABLE `event_subscription` DROP FOREIGN KEY `FK_c0e9fb56654aa775d1cc951f3c1`"
    );
    await queryRunner.query(
      "ALTER TABLE `event_subscription` DROP FOREIGN KEY `FK_0461ce0a325bdf442e4f56fac9d`"
    );
    await queryRunner.query(
      "ALTER TABLE `entity_extend` DROP FOREIGN KEY `FK_8a7689112e2c676cbec1e756ea0`"
    );
    await queryRunner.query(
      "ALTER TABLE `entity_extend_fields` DROP FOREIGN KEY `FK_6c1bad23672c78cda9365cf8343`"
    );
    await queryRunner.query(
      "ALTER TABLE `category` DROP FOREIGN KEY `FK_d5456fd7e4c4866fec8ada1fa10`"
    );
    await queryRunner.query(
      "ALTER TABLE `category` DROP FOREIGN KEY `FK_ddd03d18d0e3c52e5c7c6a19866`"
    );
    await queryRunner.query(
      "ALTER TABLE `product_category` DROP FOREIGN KEY `FK_2df1f83329c00e6eadde0493e16`"
    );
    await queryRunner.query(
      "ALTER TABLE `product_category` DROP FOREIGN KEY `FK_0374879a971928bc3f57eed0a59`"
    );
    await queryRunner.query(
      "ALTER TABLE `product` DROP FOREIGN KEY `FK_856d7e7672c2a22652daf70e1e7`"
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant` DROP FOREIGN KEY `FK_ca67dd080aac5ecf99609960cd2`"
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_value` DROP FOREIGN KEY `FK_7f84424c3d7d24f384eb47ca49e`"
    );
    await queryRunner.query(
      "ALTER TABLE `product_variant_value` DROP FOREIGN KEY `FK_d5797bca28269d9c17f8acfded1`"
    );
    await queryRunner.query(
      "ALTER TABLE `option_value` DROP FOREIGN KEY `FK_fd5bfb13a905b965a5103b65163`"
    );
    await queryRunner.query(
      "ALTER TABLE `catalog_usage` DROP FOREIGN KEY `FK_d5d581922bbe9bcb2a0982429da`"
    );
    await queryRunner.query(
      "ALTER TABLE `catalog_usage` DROP FOREIGN KEY `FK_221bd7d3f026e7121b990c11168`"
    );
    await queryRunner.query(
      "ALTER TABLE `catalog` DROP FOREIGN KEY `FK_7264a80c370a502036f9577cac3`"
    );
    await queryRunner.query(
      "ALTER TABLE `audience_member` DROP FOREIGN KEY `FK_42e3c7f4f5d906dc5f05a3bebf7`"
    );
    await queryRunner.query(
      "ALTER TABLE `audience_member` DROP FOREIGN KEY `FK_0a1751eb55c7a28a104cea18857`"
    );
    await queryRunner.query(
      "ALTER TABLE `global_control` DROP FOREIGN KEY `FK_4d6d79a027802ede338c87e85dc`"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign_control` DROP FOREIGN KEY `FK_7c817fb5eedf92c60489bd3cf7c`"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign_control` DROP FOREIGN KEY `FK_c3ff286dbb0b6ff3b81178741ff`"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign_control` DROP FOREIGN KEY `FK_c4354a7e9be05fd5737bc8d4c42`"
    );
    await queryRunner.query(
      "ALTER TABLE `customer` DROP FOREIGN KEY `FK_009f5197ebf5eea0f815cdec07e`"
    );
    await queryRunner.query(
      "ALTER TABLE `customer` DROP FOREIGN KEY `FK_f59a476121c4fe9ea136699a95d`"
    );
    await queryRunner.query(
      "ALTER TABLE `customer_device` DROP FOREIGN KEY `FK_6b39c096ab23ae90db8795d98d2`"
    );
    await queryRunner.query(
      "ALTER TABLE `audience` DROP FOREIGN KEY `FK_a0d9c257e4e5c8ad393ebd0ff48`"
    );
    await queryRunner.query(
      "ALTER TABLE `audience` DROP FOREIGN KEY `FK_0ed458a52aca357de502ae9ca20`"
    );
    await queryRunner.query(
      "ALTER TABLE `audience` DROP FOREIGN KEY `FK_20ba4b7743f36afb67beccb30ff`"
    );
    await queryRunner.query(
      "ALTER TABLE `audience` DROP FOREIGN KEY `FK_fcd16b3cf7dc88ea69d8101ae60`"
    );
    await queryRunner.query(
      "ALTER TABLE `segment` DROP FOREIGN KEY `FK_7f85834d4bad4979280f938d7e0`"
    );
    await queryRunner.query(
      "ALTER TABLE `segment` DROP FOREIGN KEY `FK_af89ecbd81bad529fad041440ff`"
    );
    await queryRunner.query(
      "ALTER TABLE `segment` DROP FOREIGN KEY `FK_afd3b8b976f0d4529f4ba950e57`"
    );
    await queryRunner.query(
      "ALTER TABLE `action` DROP FOREIGN KEY `FK_cd282cee5d1c9e4e7d7b4c4df70`"
    );
    await queryRunner.query(
      "ALTER TABLE `action` DROP FOREIGN KEY `FK_e60f38865de4c5255fdef557955`"
    );
    await queryRunner.query(
      "ALTER TABLE `action` DROP FOREIGN KEY `FK_9068aa368b8e6dd44f054054431`"
    );
    await queryRunner.query(
      "ALTER TABLE `application` DROP FOREIGN KEY `FK_88e675c3f80602005b728979e4a`"
    );
    await queryRunner.query(
      "ALTER TABLE `api_key` DROP FOREIGN KEY `FK_13ae2648860cf5bba4c36d9b4b9`"
    );
    await queryRunner.query(
      "ALTER TABLE `api_key` DROP FOREIGN KEY `FK_c4a5095066c00dccb60c862489e`"
    );
    await queryRunner.query(
      "ALTER TABLE `user` DROP FOREIGN KEY `FK_dfda472c0af7812401e592b6a61`"
    );
    await queryRunner.query(
      "ALTER TABLE `member` DROP FOREIGN KEY `FK_08897b166dee565859b7fb2fcc8`"
    );
    await queryRunner.query(
      "ALTER TABLE `member` DROP FOREIGN KEY `FK_74b6b9924cdfdc39bfab5330d40`"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign` DROP FOREIGN KEY `FK_8e2fbfe1fc6dc632c4631a1224b`"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign` DROP FOREIGN KEY `FK_f20e1f5cb5bb6cdb95fb0f6c5b2`"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign` DROP FOREIGN KEY `FK_b5c4c0412080b0f4e1bc14f06bd`"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign` DROP FOREIGN KEY `FK_470ffd2c3c3fa8e2269af93924d`"
    );
    await queryRunner.query(
      "ALTER TABLE `campaign` DROP FOREIGN KEY `FK_1193a9f2460ee9a9705a96a8d8e`"
    );
    await queryRunner.query(
      "ALTER TABLE `rule` DROP FOREIGN KEY `FK_c10c6407af89cbb2de449670e6b`"
    );
    await queryRunner.query(
      "ALTER TABLE `organization` DROP FOREIGN KEY `FK_8ea4792a1052c8b8b1aba8a6c6c`"
    );
    await queryRunner.query(
      "ALTER TABLE `organization` DROP FOREIGN KEY `FK_da6c3ae56a0c3fc3ce81b0e90a6`"
    );
    await queryRunner.query(
      "ALTER TABLE `action_definition` DROP FOREIGN KEY `FK_8c22e041093b11f3287b982330e`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_295761650ecf9c371e4b5e78b4` ON `feedback_category_closure`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_e42b4ec5af683f4f9ffb5a0528` ON `feedback_category_closure`"
    );
    await queryRunner.query("DROP TABLE `feedback_category_closure`");
    await queryRunner.query(
      "DROP INDEX `IDX_6a22002acac4976977b1efd114` ON `category_closure`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_4aa1348fc4b7da9bef0fae8ff4` ON `category_closure`"
    );
    await queryRunner.query("DROP TABLE `category_closure`");
    await queryRunner.query(
      "DROP INDEX `IDX_f51963aac115d526960ac74cf2` ON `organization_closure`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_ea74b7c4a55b7887af4470ea46` ON `organization_closure`"
    );
    await queryRunner.query("DROP TABLE `organization_closure`");
    await queryRunner.query(
      "DROP INDEX `IDX_5b9b9e52ab00fb7cbf27965fb1` ON `FeedbackCategoryOrganizationRel`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_de7e665a5b2d0635cc7b56dbdf` ON `FeedbackCategoryOrganizationRel`"
    );
    await queryRunner.query("DROP TABLE `FeedbackCategoryOrganizationRel`");
    await queryRunner.query(
      "DROP INDEX `IDX_c5700a15e6de5ab30dcfa9928a` ON `metric_filters_metric_filter`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_45c4ebe98367f7da3122abf266` ON `metric_filters_metric_filter`"
    );
    await queryRunner.query("DROP TABLE `metric_filters_metric_filter`");
    await queryRunner.query(
      "DROP INDEX `IDX_71f23548b2ea751cda772bcbdb` ON `api_key_roles_role`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_0cad0c0339988fd6a3f78f89c3` ON `api_key_roles_role`"
    );
    await queryRunner.query("DROP TABLE `api_key_roles_role`");
    await queryRunner.query(
      "DROP INDEX `IDX_e7d4d602e498d9684443f6ba13` ON `role_policies_policy`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_77a05aab87336e865f79c05874` ON `role_policies_policy`"
    );
    await queryRunner.query("DROP TABLE `role_policies_policy`");
    await queryRunner.query(
      "DROP INDEX `IDX_4be2f7adf862634f5f803d246b` ON `user_roles_role`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_5f9286e6c25594c6b88c108db7` ON `user_roles_role`"
    );
    await queryRunner.query("DROP TABLE `user_roles_role`");
    await queryRunner.query(
      "DROP INDEX `IDX_4fa276e89d5488ec1cb626a7ad` ON `walkin_product_org`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_f3fa5ba86050feff9785ee9790` ON `walkin_product_org`"
    );
    await queryRunner.query("DROP TABLE `walkin_product_org`");
    await queryRunner.query(
      "DROP INDEX `REL_14103cfd243785c9e87357b531` ON `customer_feedback_configs`"
    );
    await queryRunner.query("DROP TABLE `customer_feedback_configs`");
    await queryRunner.query(
      "DROP INDEX `REL_6241ad4637d5f8c1c8e557322f` ON `customer_feedback`"
    );
    await queryRunner.query("DROP TABLE `customer_feedback`");
    await queryRunner.query(
      "DROP INDEX `REL_6c973ea4d22982b5464036f5f6` ON `feedback_form`"
    );
    await queryRunner.query(
      "DROP INDEX `REL_ad6eef848f72a331779a201c95` ON `feedback_form`"
    );
    await queryRunner.query("DROP TABLE `feedback_form`");
    await queryRunner.query("DROP TABLE `question`");
    await queryRunner.query("DROP TABLE `feedback_category`");
    await queryRunner.query("DROP TABLE `feedback_handler`");
    await queryRunner.query("DROP TABLE `choice`");
    await queryRunner.query("DROP TABLE `response`");
    await queryRunner.query("DROP TABLE `customer_offer_redemption`");
    await queryRunner.query(
      "DROP INDEX `IDX_75af98fc8fbae69cf49e6df639` ON `coupon`"
    );
    await queryRunner.query("DROP TABLE `coupon`");
    await queryRunner.query("DROP TABLE `campaign_offers`");
    await queryRunner.query(
      "DROP INDEX `REL_8cb3c188dbac3513ce1c532fb6` ON `offer`"
    );
    await queryRunner.query(
      "DROP INDEX `REL_72cb605dad1c0ed4c79e35b358` ON `offer`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_282b296ca0d156c123cc0b38c0` ON `offer`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_93f350ef80008e9c1aad98cbf6` ON `offer`"
    );
    await queryRunner.query("DROP TABLE `offer`");
    await queryRunner.query("DROP TABLE `workflow_route`");
    await queryRunner.query(
      "DROP INDEX `IDX_ffcf58ae9128ab7509e15b2f49` ON `message_template_variable`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_e066811dd4a31d4aaa1011b533` ON `message_template_variable`"
    );
    await queryRunner.query("DROP TABLE `message_template_variable`");
    await queryRunner.query(
      "DROP INDEX `IDX_332cce35545f88fa6a69a56d18` ON `message_template`"
    );
    await queryRunner.query("DROP TABLE `message_template`");
    await queryRunner.query(
      "DROP INDEX `IDX_54e5ac9404e6102f0c661a5bf0` ON `metric`"
    );
    await queryRunner.query("DROP TABLE `metric`");
    await queryRunner.query(
      "DROP INDEX `IDX_1192c0fd503a6cf0728a903864` ON `metric_filter`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_99ee6eca594b7fd47ec208385e` ON `metric_filter`"
    );
    await queryRunner.query("DROP TABLE `metric_filter`");
    await queryRunner.query("DROP TABLE `workflow_entity_transition_history`");
    await queryRunner.query("DROP TABLE `workflow_entity_transition`");
    await queryRunner.query(
      "DROP INDEX `IDX_9a9ab3ca5323d398b127340acb` ON `workflow_process_transition`"
    );
    await queryRunner.query("DROP TABLE `workflow_process_transition`");
    await queryRunner.query(
      "DROP INDEX `IDX_554a1e68bf7d4cfddb48ecc6e5` ON `workflow_state`"
    );
    await queryRunner.query("DROP TABLE `workflow_state`");
    await queryRunner.query(
      "DROP INDEX `IDX_7756b0d84326656e38d1480afb` ON `workflow_process`"
    );
    await queryRunner.query("DROP TABLE `workflow_process`");
    await queryRunner.query("DROP TABLE `workflow_entity`");
    await queryRunner.query(
      "DROP INDEX `IDX_8ec5afd3566bb368910c59f441` ON `workflow`"
    );
    await queryRunner.query("DROP TABLE `workflow`");
    await queryRunner.query(
      "DROP INDEX `IDX_f4d2864a39b5a79ccd7104d33c` ON `webhook_event_type`"
    );
    await queryRunner.query("DROP TABLE `webhook_event_type`");
    await queryRunner.query("DROP TABLE `webhook_data`");
    await queryRunner.query("DROP TABLE `webhook`");
    await queryRunner.query("DROP TABLE `session`");
    await queryRunner.query("DROP TABLE `rule_attribute`");
    await queryRunner.query("DROP TABLE `rule_entity`");
    await queryRunner.query("DROP TABLE `product_option`");
    await queryRunner.query("DROP TABLE `events`");
    await queryRunner.query(
      "DROP INDEX `IDX_31b205e1c93e3a0b623f28b777` ON `event_subscription`"
    );
    await queryRunner.query("DROP TABLE `event_subscription`");
    await queryRunner.query(
      "DROP INDEX `IDX_f66937d15b24437e3bb5fbcf76` ON `event_type`"
    );
    await queryRunner.query("DROP TABLE `event_type`");
    await queryRunner.query("DROP TABLE `entity_extend`");
    await queryRunner.query("DROP TABLE `entity_extend_fields`");
    await queryRunner.query("DROP TABLE `category`");
    await queryRunner.query("DROP TABLE `product_category`");
    await queryRunner.query(
      "DROP INDEX `IDX_22cc43e9a74d7498546e9a63e7` ON `product`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_99c39b067cfa73c783f0fc49a6` ON `product`"
    );
    await queryRunner.query("DROP TABLE `product`");
    await queryRunner.query(
      "DROP INDEX `IDX_f4dc2c0888b66d547c175f090e` ON `product_variant`"
    );
    await queryRunner.query("DROP TABLE `product_variant`");
    await queryRunner.query("DROP TABLE `product_variant_value`");
    await queryRunner.query(
      "DROP INDEX `IDX_489f2d087b47aff8d3e31b6aaa` ON `option_value`"
    );
    await queryRunner.query("DROP TABLE `option_value`");
    await queryRunner.query(
      "DROP INDEX `IDX_5e47276c1d6a3fb881283fdbf1` ON `option`"
    );
    await queryRunner.query("DROP TABLE `option`");
    await queryRunner.query(
      "DROP INDEX `REL_221bd7d3f026e7121b990c1116` ON `catalog_usage`"
    );
    await queryRunner.query("DROP TABLE `catalog_usage`");
    await queryRunner.query(
      "DROP INDEX `IDX_408ad15a08984a8e9b0619ee3e` ON `catalog`"
    );
    await queryRunner.query("DROP TABLE `catalog`");
    await queryRunner.query(
      "DROP INDEX `REL_42e3c7f4f5d906dc5f05a3bebf` ON `audience_member`"
    );
    await queryRunner.query(
      "DROP INDEX `REL_0a1751eb55c7a28a104cea1885` ON `audience_member`"
    );
    await queryRunner.query("DROP TABLE `audience_member`");
    await queryRunner.query("DROP TABLE `global_control`");
    await queryRunner.query("DROP TABLE `campaign_control`");
    await queryRunner.query("DROP TABLE `customer`");
    await queryRunner.query("DROP TABLE `customer_device`");
    await queryRunner.query("DROP TABLE `audience`");
    await queryRunner.query(
      "DROP INDEX `IDX_9e0406598d248857fe96f5e929` ON `segment`"
    );
    await queryRunner.query("DROP TABLE `segment`");
    await queryRunner.query("DROP TABLE `business_rule_detail`");
    await queryRunner.query("DROP TABLE `business_rule`");
    await queryRunner.query("DROP TABLE `action`");
    await queryRunner.query("DROP TABLE `application`");
    await queryRunner.query("DROP TABLE `api_key`");
    await queryRunner.query("DROP TABLE `role`");
    await queryRunner.query(
      "DROP INDEX `IDX_e12875dfb3b1d92d7d7c5377e2` ON `user`"
    );
    await queryRunner.query("DROP TABLE `user`");
    await queryRunner.query("DROP TABLE `member`");
    await queryRunner.query("DROP TABLE `campaign`");
    await queryRunner.query(
      "DROP INDEX `IDX_e272edd8cbd400c7c29462142f` ON `rule`"
    );
    await queryRunner.query("DROP TABLE `rule`");
    await queryRunner.query(
      "DROP INDEX `REL_8ea4792a1052c8b8b1aba8a6c6` ON `organization`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_aa6e74e96ed2dddfcf09782110` ON `organization`"
    );
    await queryRunner.query("DROP TABLE `organization`");
    await queryRunner.query(
      "DROP INDEX `IDX_28256ca7df87c37aee1484c5d9` ON `walkin_product`"
    );
    await queryRunner.query("DROP TABLE `walkin_product`");
    await queryRunner.query("DROP TABLE `store`");
    await queryRunner.query("DROP TABLE `policy`");
    await queryRunner.query(
      "DROP INDEX `REL_8c22e041093b11f3287b982330` ON `action_definition`"
    );
    await queryRunner.query(
      "DROP INDEX `IDX_daa94d74b9a6f8f02582609857` ON `action_definition`"
    );
    await queryRunner.query("DROP TABLE `action_definition`");
    await queryRunner.query(
      "DROP INDEX `IDX_83bf9742fcac88a00c4507ea2e` ON `action_type`"
    );
    await queryRunner.query("DROP TABLE `action_type`");
  }
}
