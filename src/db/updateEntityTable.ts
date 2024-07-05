import { dbQuery } from ".";
import { TableItemType } from "../types";

export const updateEntityTable = async (
  data: TableItemType[],
  tableName: string
) => {
  const values = data
    .map(({ id, name }) => `(${id}, '${name.replace(/'/g, "''")}')`)
    .join(", ");
  const query = `INSERT INTO public.${tableName} (id, name) VALUES ${values} ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name;`;
  try {
    const res = await dbQuery(query);
    console.log("Insert successful:", res.rowCount);
  } catch (error) {
    console.error("Error inserting data:", error);
    throw error;
  }
};
