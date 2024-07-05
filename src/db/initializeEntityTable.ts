import { dbQuery } from ".";

export const inistializeEntityTable = async (tableName: string) => {
  const query = `
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '${tableName}') THEN
        CREATE TABLE ${tableName} (
          id SERIAL PRIMARY KEY,
          name TEXT
        );
      END IF;
    END $$;
  `;

  await dbQuery(query);
};
