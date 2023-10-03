import gql from "graphql-tag";
import {
  ACTION_RESULT,
  ACTION_TYPE,
  ENTITY_TYPE,
  EXPRESSION_TYPE,
  RULE_TYPE,
  SCHEMA_FORMAT,
  STATUS,
  VALUE_TYPE,
  CONDITION_TYPE,
  RULE_EFFECT_TYPE
} from "../../constants";

export const graphqlCustomEnums = gql`
    enum STATUS{
		  ${[...Object.values(STATUS)]}
    }
    
    enum ENTITY_TYPE{
		  ${[...Object.values(ENTITY_TYPE)]}
    }
    
    enum VALUE_TYPE{
		  ${[...Object.values(VALUE_TYPE)]}
    }

    enum ENTITY_TYPE{
		  ${[...Object.values(ACTION_TYPE)]}
    }

    enum ENTITY_TYPE{
      ${[...Object.values(SCHEMA_FORMAT)]}
    } 

    enum ENTITY_TYPE{
      ${[...Object.values(ACTION_RESULT)]}
    }
    
    enum EXPRESSION_TYPE{
		  ${[...Object.values(EXPRESSION_TYPE)]}
	  }

    enum RULE_TYPE{
		  ${[...Object.values(RULE_TYPE)]}
    }

    enum CONDITION_TYPE{
		  ${[...Object.values(CONDITION_TYPE)]}
    }

    enum RULE_EFFECT_TYPE{
		  ${[...Object.values(RULE_EFFECT_TYPE)]}
    }
`;
