export const TableDataEnum = [
  {
    tableName: "brands",
    filePath: "src/jobs/data/brands-v2.xlsx",
    searchTableName: "brands_search",
    entityIdName: "brand_id",
    syncFuncName: "sync_brands_search",
    triggerName: "sync_brands_search_trigger",
  },
  {
    tableName: "cities",
    filePath: "src/jobs/data/cities-v2.xlsx",
    searchTableName: "cities_search",
    entityIdName: "city_id",
    syncFuncName: "sync_cities_search",
    triggerName: "sync_cities_search_trigger",
  },
  {
    tableName: "diets",
    filePath: "src/jobs/data/diets-v2.xlsx",
    searchTableName: "diets_search",
    entityIdName: "diet_id",
    syncFuncName: "sync_diets_search",
    triggerName: "sync_diets_search_trigger",
  },
  {
    tableName: "dish_types",
    filePath: "src/jobs/data/dish-types-v2.xlsx",
    searchTableName: "dish_types_search",
    entityIdName: "dish_types_id",
    syncFuncName: "sync_dish_types_search",
    triggerName: "sync_dish_types_search_trigger",
  },
];

export const TableTypeDict: Record<string, string> = {
  brands: "brand",
  cities: "city",
  diets: "diet",
  dish_types: "dishType",
};
