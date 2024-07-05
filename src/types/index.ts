export interface TableItemType {
  id: number;
  name: string;
}

export interface MatchItemType {
  id: number;
  name: string;
}

export type MatchItemDictType = Record<string, MatchItemType[]>;

export type CombinationType = Record<string, TableItemType>;
