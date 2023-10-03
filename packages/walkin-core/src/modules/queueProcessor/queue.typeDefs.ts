import gql from "graphql-tag";
import { ADDITIONAL_JOBS, WALKIN_QUEUES } from "../common/constants";
const typeDefs = gql`
scalar JSON

enum QUEUES {
    ${[...Object.values(WALKIN_QUEUES), ...Object.values(ADDITIONAL_JOBS)]}
}

enum ADDITIONAL_JOBS {
    ${[...Object.values(ADDITIONAL_JOBS)]}
}

input getJobByIdInput {
    queueName: QUEUES
    id: String
}

input createJobInput {
    queueName: ADDITIONAL_JOBS
    cronExpression: String
}

type Query {
    job(input: getJobByIdInput): JSON @auth
}

type Mutation {
    failJob(queueName: String, id: ID, reason: String): JSON @auth
    createJob(input: createJobInput): JSON @auth
    removeJob(queueName: String, id: ID) : JSON @auth
}
`;
export default typeDefs;
