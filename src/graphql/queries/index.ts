//import query Types
import { searchQueryTypeDefs } from "./search/searchQueryType";

//import query Resolvers
import { searchQueryResolver } from "./search/searchQueryResolver";

export const queryTypeDefs = [
  searchQueryTypeDefs,
  //Add other query types
];

export const queryResolvers = {
  ...searchQueryResolver,
  //Add other query resolvers
};
