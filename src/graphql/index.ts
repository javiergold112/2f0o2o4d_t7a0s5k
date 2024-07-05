import { ApolloServer } from "apollo-server-express";
import { queryTypeDefs, queryResolvers } from "./queries";

const typeDefs = [...queryTypeDefs]; //[...queryTypeDefs, ...mutationTypeDefs];
const resolvers = {
  Query: queryResolvers,
  // Mutation: mutationResolvers,
};

export const graqhQLSever = new ApolloServer({
  typeDefs,
  resolvers,
});
