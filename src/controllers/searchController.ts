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
  for await (const tableData of TableDataEnum) {
    matches[TableTypeDict[tableData.tableName]] = [];

    for await (const token of tokens) {
      const result = await searchEntity(
        token,
        tableData.searchTableName,
        tableData.entityIdName
      );
      console.log(result);
      result.forEach((row) => {
        matches[TableTypeDict[tableData.tableName]].push({
          id: row.id,
          name: row.name,
        });
      });
    }
  }

  return matches;
};

const generateCombinations = (matches: MatchItemDictType) => {
  const keys = Object.keys(matches);
  const combinations: CombinationType[] = [];

  const recurse = (index: number, currentCombination: CombinationType) => {
    if (index === keys.length) {
      combinations.push(currentCombination);
      return;
    }

    const type = keys[index];

    if (matches[type].length === 0) {
      recurse(index + 1, currentCombination);
      return;
    }

    for (const match of matches[type]) {
      const newCombination = { ...currentCombination };

      if (!newCombination[type]) {
        newCombination[type] = { id: match.id, name: match.name };
        if (
          Object.keys(newCombination).includes("brand") &&
          Object.keys(newCombination).includes("dishType")
        ) {
          const tmpNewCombination1 = { ...newCombination };
          delete tmpNewCombination1.brand;
          recurse(index + 1, tmpNewCombination1);

          const tmpNewCombination2 = { ...newCombination };
          delete tmpNewCombination2.dishType;
          recurse(index + 1, tmpNewCombination2);
        } else {
          recurse(index + 1, newCombination);
        }
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
