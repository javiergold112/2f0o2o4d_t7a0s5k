import { searchEntity } from "../db";
import { MatchItemDictType, CombinationType } from "../types";
import { TableDataEnum, TableTypeDict } from "../enums";

const stopWords = [
  "a",
  "the",
  "in",
  "on",
  "at",
  "of",
  "for",
  "to",
  "and",
  "or",
];

// Tokenize and remove stop words
const tokenize = (text: string) => {
  return text
    .toLowerCase()
    .split(" ")
    .filter((token) => !stopWords.includes(token));
};

const getMatches = async (tokens: string[]) => {
  const matches: MatchItemDictType = {};

  for await (const token of tokens) {
    matches[token] = [];

    for await (const tableData of TableDataEnum) {
      console.log("searchTerm >>>", token);
      console.log("tableData >>>", tableData.tableName);

      const result = await searchEntity(
        token,
        tableData.searchTableName,
        tableData.entityIdName
      );
      console.log(result);
      result.forEach((row) => {
        matches[token].push({
          type: TableTypeDict[tableData.tableName],
          id: row.id,
          name: row.name,
        });
      });
    }
  }

  return matches;
};

const generateCombinations = (matches: MatchItemDictType) => {
  console.log("mactches ??? ", matches);
  const keys = Object.keys(matches);
  const combinations: CombinationType[] = [];

  const recurse = (index: number, currentCombination: CombinationType) => {
    console.log(index);
    if (index === keys.length) {
      combinations.push(currentCombination);
      return;
    }

    const term = keys[index];
    for (const match of matches[term]) {
      const newCombination = { ...currentCombination };

      if (!newCombination[match.type]) {
        if (
          (match.type === "brand" &&
            Object.keys(newCombination).includes("dishType")) ||
          (match.type === "dishType" &&
            Object.keys(newCombination).includes("brand"))
        )
          continue;
        newCombination[match.type] = { id: match.id, name: match.name };
        recurse(index + 1, newCombination);
      }
    }
  };

  recurse(0, {});

  return combinations;
};

export const searchController = async (searchTerm: string) => {
  const tokens = tokenize(searchTerm);
  try {
    // Step 1: Query database for matches using materialized view
    const matches = await getMatches(tokens);

    // Step 2: Generate combinations
    const combinations = generateCombinations(matches);

    return combinations;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
