import { Injectable, Inject } from "@graphql-modules/di";
import { EntityManager, Transaction, JoinOptions } from "typeorm";
import { Action, ActionDefinition } from "../../entity";
import { STATUS } from "../common/constants/constants";
import { updateEntity } from "../common/utils/utils";
import { executeAction } from "./action.executor";

import { WCORE_ERRORS } from "../common/constants/errors";
import { WCoreError } from "../common/exceptions";

import { validateJSONDataUsingSchema } from "../common/validations/SchemaValidations";
import { addPaginateInfo } from "@walkinserver/walkin-core/src/modules/common/utils/utils";
import { PageOptions } from "@walkinserver/walkin-core/src/modules/common/constants";

@Injectable()
class ActionProvider {
  public async getActionDefinition(
    transactionalEntityManager: EntityManager,
    id: string,
    organizationId: any
  ): Promise<ActionDefinition> {
    return transactionalEntityManager.findOne(ActionDefinition, {
      where: {
        id,
        organization: organizationId
      },
      relations: ["organization"]
    });
  }

  public async getActionDefinitionById(
    transactionalEntityManager: EntityManager,
    id: string,
    organizationId: string
  ): Promise<ActionDefinition> {
    return transactionalEntityManager.findOne(ActionDefinition, {
      where: {
        id,
        organization: organizationId
      },
      relations: ["organization"]
    });
  }

  @addPaginateInfo
  public async getAllActionDefinitions(
    transactionalEntityManager: EntityManager,
    pageOptions: PageOptions,
    sortOptions,
    organizationId: any,
    name?: any,
    type?: string,
    status?: any
  ): Promise<any> {
    const whereList: any = { name, type, status };
    await Object.keys(whereList).forEach(key => {
      if (!whereList[key]) {
        delete whereList[key];
      }
    });
    if (organizationId) {
      whereList.organization = organizationId;
    }
    const options: any = {};
    options.order = {
      [sortOptions.sortBy]: sortOptions.sortOrder
    };
    options.skip = (pageOptions.page - 1) * pageOptions.pageSize;
    options.take = pageOptions.pageSize;

    return transactionalEntityManager.findAndCount(ActionDefinition, {
      where: whereList,
      relations: ["organization"],
      ...options
    });
  }

  public async getAction(
    transactionalEntityManager: EntityManager,
    id: string,
    organizationId: any
  ): Promise<Action> {
    const action = await transactionalEntityManager.findOne(Action, {
      where: {
        id,
        organization: organizationId
      },
      relations: ["actionDefinition", "organization"]
    });
    return action;
  }

  @addPaginateInfo
  public async getAllActions(
    transactionalEntityManager: EntityManager,
    pageOptions: PageOptions,
    sortOptions,
    organizationId: any,
    actionDefinitionName: any,
    status: any
  ): Promise<any> {
    const order = {
      [sortOptions.sortBy]: sortOptions.sortOrder
    };
    const queryBuilder = transactionalEntityManager
      .getRepository(Action)
      .createQueryBuilder("action")
      .leftJoinAndSelect("action.actionDefinition", "actionDefinition")
      .leftJoinAndSelect("action.organization", "organization")
      .where("action.status = :status", {
        organizationId,
        actionDefinitionName,
        status
      });
    if (organizationId) {
      queryBuilder.andWhere(" organization.id = :organizationId");
    }
    if (actionDefinitionName) {
      queryBuilder.andWhere(" actionDefinition.name =:actionDefinitionName");
    }

    return queryBuilder
      .skip((pageOptions.page - 1) * pageOptions.pageSize)
      .take(pageOptions.pageSize)
      .orderBy(order)
      .getManyAndCount();
  }

  public async createActionDefinition(
    transactionalEntityManager: EntityManager,
    name: string,
    type: any,
    organization: any,
    configuration: any,
    code: any,
    inputSchema: any,
    outputSchema: any,
    status: string
  ): Promise<ActionDefinition> {
    const actionDefinationSchema: any = {
      name,
      type,
      organization,
      configuration,
      code,
      inputSchema,
      outputSchema,
      status
    };
    let e = transactionalEntityManager.create(
      ActionDefinition,
      actionDefinationSchema
    );
    e = await transactionalEntityManager.save(e);
    const x = await transactionalEntityManager.findOne(ActionDefinition, {
      where: {
        id: e.id
      },
      relations: ["organization"]
    });
    return x;
  }

  public async updateActionDefinition(
    transactionalEntityManager: EntityManager,
    input: any,
    foundOrganization: any
  ): Promise<ActionDefinition> {
    const actionDefinition: any = {
      name: input.name,
      type: input.type,
      organization: foundOrganization,
      configuration: input.configuration,
      code: input.code,
      inputSchema: input.inputSchema,
      outputSchema: input.outputSchema,
      status: input.status
    };
    const actionDefinitionToUpdate = await transactionalEntityManager.findOneOrFail(
      ActionDefinition,
      {
        where: {
          id: input.id
        }
      }
    );
    updateEntity(actionDefinitionToUpdate, actionDefinition);
    return transactionalEntityManager.save(actionDefinitionToUpdate);
  }

  public async disableActionDefinition(
    transactionalEntityManager: EntityManager,
    id: string,
    organizationId: any
  ): Promise<ActionDefinition> {
    const actionDefinitionToDisable = await transactionalEntityManager.findOneOrFail(
      ActionDefinition,
      {
        where: {
          id,
          organization: organizationId
        },
        relations: ["organization"]
      }
    );

    actionDefinitionToDisable.status = STATUS.INACTIVE;
    return transactionalEntityManager.save(actionDefinitionToDisable);
  }

  public async executeAction(
    transactionalEntityManager: EntityManager,
    actionDefinitionName: string,
    request: any,
    organizationId: any
  ) {
    const actionDefinitionToExecute = await transactionalEntityManager.findOne(
      ActionDefinition,
      {
        where: {
          name: actionDefinitionName,
          organization: organizationId
        },
        relations: ["organization"]
      }
    );
    if (!actionDefinitionToExecute) {
      throw new WCoreError(WCORE_ERRORS.ACTION_DEFINITION_NOT_FOUND);
    }

    const status = actionDefinitionToExecute.status;
    if (status && status.toUpperCase() !== "ACTIVE") {
      throw new WCoreError(WCORE_ERRORS.ACTION_DEFINITION_NOT_ACTIVE);
    }

    const inputSchema = actionDefinitionToExecute.inputSchema;
    if (inputSchema) {
      const result = validateJSONDataUsingSchema(inputSchema, request);
      if (!result.valid) {
        throw new WCoreError(WCORE_ERRORS.INPUT_SCHEMA_VALIDATION_FAILED);
      }
    }
    // execute action and store response
    const response = await executeAction(actionDefinitionToExecute, request);
    console.log("Execute Action Response:", response);
    const outputSchema = actionDefinitionToExecute.outputSchema;
    if (outputSchema) {
      const result = validateJSONDataUsingSchema(outputSchema, response);
      if (!result.valid) {
        if (!result.dataNotJsonFormat) {
          throw new WCoreError(WCORE_ERRORS.INPUT_SCHEMA_VALIDATION_FAILED);
        }
      }
    }

    const action: any = {
      actionDefinition: actionDefinitionToExecute,
      organization: actionDefinitionToExecute.organization,
      status: "ACTIVE",
      request: JSON.stringify(request),
      response
    };

    const actionToSave = transactionalEntityManager.create(Action, action);

    return transactionalEntityManager.save(actionToSave);
  }
}

export { ActionProvider as Action };
