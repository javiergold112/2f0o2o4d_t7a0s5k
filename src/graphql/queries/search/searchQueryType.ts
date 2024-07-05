import { gql } from "apollo-server-express";

export const searchQueryTypeDefs = gql`
  type ReturnItemType {
    id: ID!
    name: String!
  }

  type SearchResult {
    brand: ReturnItemType
    city: ReturnItemType
    diet: ReturnItemType
    dishType: ReturnItemType
  }

  type Query {
    search(search: String!): [SearchResult]
  }
`;
