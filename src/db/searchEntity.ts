import { dbQuery } from ".";
import { TableItemType } from "../types";
export const searchEntity = async (
  searchTerm: string,
  searchTableName: string,
  entityIdName: string
) => {
  const searchKey = searchTerm.replace(/'/g, "''");
  const query = `
    SELECT ${entityIdName} as id, name
    FROM public.${searchTableName}
    WHERE textsearchable_index_col @@ to_tsquery('english', '${searchKey}:*');
  `;

  const result = await dbQuery(query);
  return result.rows as TableItemType[];
};
