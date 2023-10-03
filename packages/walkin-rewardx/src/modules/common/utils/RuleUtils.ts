import { EntityManager } from "typeorm";
import { WCORE_ERRORS } from "@walkinserver/walkin-core/src/modules/common/constants/errors";
import {
  RuleProvider,
  RuleSetProvider,
  RuleConditionProvider,
  RuleEffectProvider
} from "@walkinserver/walkin-core/src/modules/rule/providers";
import { Injector } from "@graphql-modules/di";
import { Rule, RuleSet } from "@walkinserver/walkin-core/src/entity";
import { WCoreError } from "@walkinserver/walkin-core/src/modules/common/exceptions";
import {
  CONDITION_TYPE,
  ENTITY_NAME,
  MATHEMATICAL_EXPRESSIONS,
  RULE_EFFECT_TYPE
} from "@walkinserver/walkin-core/src/modules/common/constants";
import jexl from "jexl";
import { ORDER_CHANNEL, ORDER_TYPE, RULE_TYPE} from "../constants/constant";

import { includes, isEmpty, find, isEqual } from "lodash";

import { detectMaliciousCode } from '@walkinserver/walkin-core/src/modules/common/utils/utils';



export async function evaluateRuleSet(
  entityManager: EntityManager,
  injector: Injector,
  ruleSetId: Number,
  additionalInput: any
) {
  let ruleSet: RuleSet = await injector
    .get(RuleSetProvider)
    .getRuleSetById(entityManager, { id: ruleSetId });
  let results = [];
  if (ruleSet)
    for (let i = 0; i < ruleSet.rules.length; i++) {
      let rule: Rule = await injector
        .get(RuleProvider)
        .rule(entityManager, `${ruleSet.rules[i]}`);
      if (rule && rule.conditions && rule.conditions.length)
        for (let k = 0; k < rule.conditions.length; k++) {
          let condition = rule.conditions[k];

          let expression;
          if (condition.type != CONDITION_TYPE.CUSTOM_EXPRESSION)
            expression = conditionToJexl(condition);
          else expression = condition.value;

          const transforms = condition.transforms;
                                       
          const result = await evaluateJexl(expression, additionalInput, transforms);
          
          if (!result) {
            return {
              status: false,
              message: `${condition.name} is not satisfied.`
            };
          }
        }
      for (let k = 0; k < rule.effects.length; k++) {
        let effect = rule.effects[k];
        if (effect.type == RULE_EFFECT_TYPE.CUSTOM_EXPRESSION) {
          let expression = effect.value;
          
          const transforms = effect.transforms;
                                       
          const res = await evaluateJexl(expression, additionalInput, transforms);
         
          results.push(res);
        }
      }
    }
  else {
    throw new WCoreError({
      HTTP_CODE: 404,
      MESSAGE: "Rule Set Not Found.",
      CODE: "RSNF"
    });
  }
  if (results.length) {
    return {
      status: true,
      results: results
    };
  }
  return null;
}

export function conditionToJexl(condition) {
  let expression = MATHEMATICAL_EXPRESSIONS[condition.type];
  let attributeName = condition["ruleAttribute"].attributeName;
  let entityCode = condition["ruleEntity"].entityCode;
  return `${entityCode}.${attributeName}${expression}${condition.valueType == "STRING" ? `"${condition.value}"` : condition.value
    }`;
}


function checkDuplicateFunctionName(transforms, retrievedTransforms)
{
  for (const transformName in transforms)
  {
    
    if(retrievedTransforms.hasOwnProperty(transformName))
    {
      return true;
    }

  }
  return false;
}

export async function duplicateTransforms(inputObject, entityManager, injector)
{ 
  
  let result;

  if(inputObject.entityName == ENTITY_NAME.RULE_CONDITION)
  {
    result = await injector.get(RuleConditionProvider).getTransformsFromRuleCondition(entityManager, inputObject.id);
  }
  else if(inputObject.entityName ==  ENTITY_NAME.RULE_EFFECT){
    result = await injector.get(RuleEffectProvider).getTransformsFromRuleEffect(entityManager, inputObject.id);
  }
    
  let parsedTransforms = {};

  if(result[0]?.transforms)
  {
    try{
      parsedTransforms=JSON.parse(result[0].transforms);
    }
    catch(err){
      throw new WCoreError(WCORE_ERRORS.INVALID_TRANSFORM_ERROR);
    }
    
    if(checkDuplicateFunctionName(inputObject.transforms, parsedTransforms))
    {
      throw new WCoreError(WCORE_ERRORS.DUPLICATE_TRANSFORM_ERROR);
    }
  }
   
  return {
    hasDuplicates:false,
    retrievedTransforms:parsedTransforms
  };
    
}

export function validateTransforms(transforms) {

  for( const transformString in transforms ) {
    // we are going to validate each transform function here
    const transformFunctionString = transforms[transformString].trim();

    // checking whether the length of the string is zero and checking whether the string contains malicious code
    const hasMaliciousCode = detectMaliciousCode(transformFunctionString);
    if (hasMaliciousCode) {
      throw new WCoreError(WCORE_ERRORS.INVALID_TRANSFORM_ERROR);
    }

    parseJexlTransform(transformFunctionString);
  }
  return;
}

export function parseJexlTransform(transformFunctionString) {
  try {
    const parsedFunction = new Function(`return ${transformFunctionString}`)();
    if (typeof parsedFunction !== 'function') {
      throw new WCoreError(WCORE_ERRORS.INVALID_TRANSFORM_ERROR);
    }
   
    return parsedFunction;
  } catch (err) {
    throw new WCoreError(WCORE_ERRORS.INVALID_TRANSFORM_ERROR);
  }
}


export async function evaluateJexl(expression, input, transforms?) {
  
  jexl.addTransform("toUpperCase", val => val.toUpperCase());
  jexl.addTransform("toLowerCase", val => val.toLowerCase());
  jexl.addTransform("trim", val => val.trim());
  jexl.addTransform("split", val => val.split(","));
  jexl.addTransform("replace", val => val.replace(/\s+/g, ' '));
  jexl.addTransform("floor", async val => Math.floor(val));
  jexl.addTransform("length", val => val.length);
  jexl.addTransform("isEmpty",val => isEmpty(val));
  jexl.addTransform("find",(source,target)=> find(source,target));
  jexl.addTransform("isEqual",(value,other)=> isEqual(value,other));

  jexl.addTransform("countWords",  (comment)=>{
    // Step 1: Remove unwanted spaces
    const cleanedString = comment.replace(/\s+/g, ' ').trim();
    // Step 2: Count the number of words
    const wordsArray = cleanedString.split(' ');
    const numberOfWords = wordsArray.length;

    return numberOfWords;
  });
  jexl.addTransform("filter", async (children, expression) => {
    const filteredChildren = [];
    for (const child of children) {
      await jexl.eval(expression, child).then(res => {
        if (res === true) {
          filteredChildren.push(child);
        }
      });
    }
    return filteredChildren;
  });
  jexl.addTransform("total", async (children, expression) => {
    let total = 0;
    for (const child of children) {
      const i = await jexl.eval(expression, child);
      total += i;
    }
    return total;
  });

  if(transforms)
  {
   
    for (const transformName in transforms)
    {
      const transformFuncDefinition = parseJexlTransform(transforms[transformName]);
      jexl.addTransform(transformName,  transformFuncDefinition);
     
    }
  }
 

  const evaluationResult = await jexl.eval(expression, input);
 
  return evaluationResult;
}

export async function checkBurnBusinessRules(
  orderData,
  businessRules,
  burnAmount
) {
  if (orderData) {
    let transactionOrderChannel =
      businessRules[ORDER_CHANNEL.LOYALTY_TRANSACTION_BURN_ORDER_CHANNEL];
    let transactionOrderType =
      businessRules[ORDER_TYPE.LOYALTY_TRANSACTION_BURN_ORDER_TYPE];
    let transactionOrderChannels = transactionOrderChannel
      ? JSON.parse(transactionOrderChannel.ruleDefaultValue)
      : null;
    let transactionOrderTypes = transactionOrderType
      ? JSON.parse(transactionOrderType.ruleDefaultValue)
      : null;
    if (
      (transactionOrderChannel && !orderData?.orderChannel) ||
      !includes(
        transactionOrderChannels,
        orderData?.orderChannel.toUpperCase()
      ) ||
      ((transactionOrderType && !orderData?.orderType) ||
        !includes(
          transactionOrderTypes,
          orderData?.orderType.toUpperCase()
        ))
    ) {
      return 0;
    }
    let burnBusinessRule =
      businessRules[RULE_TYPE.LOYALTY_TRANSACTION_BURN_LIMIT];
    if (burnBusinessRule) {
      let maxBurnedAmount = burnBusinessRule.ruleDefaultValue;
      burnAmount = Math.min(burnAmount, maxBurnedAmount);
    }
  }
  return burnAmount;
}

export async function checkEarnBusinessRules(
  orderData,
  businessRules,
  earnAmount
) {
  if (orderData) {
    let transactionOrderChannel =
      businessRules[ORDER_CHANNEL.LOYALTY_TRANSACTION_EARN_ORDER_CHANNEL];
    let transactionOrderType =
      businessRules[ORDER_TYPE.LOYALTY_TRANSACTION_EARN_ORDER_TYPE];
    let transactionOrderChannels = transactionOrderChannel
      ? JSON.parse(transactionOrderChannel.ruleDefaultValue)
      : null;
    let transactionOrderTypes = transactionOrderType
      ? JSON.parse(transactionOrderType.ruleDefaultValue)
      : null;
    if (
      (transactionOrderChannel && !orderData?.orderChannel) ||
      !includes(
        transactionOrderChannels,
        orderData?.orderChannel.toUpperCase()
      ) ||
      ((transactionOrderType && !orderData?.orderType) ||
        !includes(
          transactionOrderTypes,
          orderData?.orderType.toUpperCase()
        ))
    ) {
      return 0;
    }
    let earnBusinessRule =
      businessRules[RULE_TYPE.LOYALTY_TRANSACTION_EARN_LIMIT];
    if (earnBusinessRule) {
      let maxEarnableAmount = earnBusinessRule.ruleDefaultValue;
      earnAmount = Math.min(earnAmount, maxEarnableAmount);
    }
  }
  return earnAmount;
}

export async function validateRules(entityManager, injector, rules, organizationId) {
  const result = await injector.get(RuleProvider).getRulesFromList(entityManager, rules, organizationId);

  if(result.length != rules.length)
  {
    throw new WCoreError(WCORE_ERRORS.INVALID_RULES);
  }
  return true;
}

export async function validateRulesFromRuleset(entityManager, injector, rules, ruleSetId) {        
  const result:any = await injector.get(RuleSetProvider).getRulesFromRuleSet(entityManager, ruleSetId);          
  
  const isRulesExists = rules.every(rule => result[0].rules.includes(rule));
  if(!isRulesExists)
  {
    throw new WCoreError(WCORE_ERRORS.INVALID_RULES);
  }
  return true;
}