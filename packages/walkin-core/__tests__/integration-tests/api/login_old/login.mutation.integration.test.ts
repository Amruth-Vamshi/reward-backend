// import { link } from "@walkinserver/walkin-core/__tests__/utils/testUtils"
// import { execute, makePromise } from "apollo-link";
// import gql from "graphql-tag";
// let authemail;
// const authpassword = "password";
// let fetch;
// let uri;

// describe('customer feedback refineX', () => {

//     test('should create a questionnaire', async () => {
//         const operation = {
//             query: gql`
//                       mutation {
//                           login(input: { email: "${authemail}", password: "${authpassword}" }) {
//                               jwt
//                           }
//                       }
//                   `
//         };
//         // console.log(operation);
//         const data = await makePromise(execute(link, operation));
//         console.log(data.data);
//         const response = await fetch(uri, {
//             method: "POST",
//             body: JSON.stringify(operation),
//             headers: {
//                 "Content-Type": "application/json"
//             }
//         });
//         const {
//             data1,
//             errors
//         } = await response.json();
//         if (errors) {
//             return errors
//         }
//         return data1.login;
//     });
// });
