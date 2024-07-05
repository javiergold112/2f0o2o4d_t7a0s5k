import { dbQuery } from ".";

export const initializeEntitySearchTable = async (
  tableName: string,
  searchTableName: string,
  entityIdName: string,
  syncFuncName: string,
  triggerName: string
) => {
  const creatingTableQuery = `
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = '${searchTableName}') THEN
        CREATE TABLE ${searchTableName} (
          ${entityIdName} INT PRIMARY KEY,
          name TEXT,
          textsearchable_index_col TSVECTOR
        );
      END IF;
    END $$;
  `;
  const initalizeTableQuery = `
    INSERT INTO public.${searchTableName} (${entityIdName}, name, textsearchable_index_col)
    SELECT id, name, to_tsvector('english', name) FROM public.${tableName}
    ON CONFLICT (${entityIdName}) DO UPDATE
    SET name = EXCLUDED.name,
    textsearchable_index_col = EXCLUDED.textsearchable_index_col;
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = 'textsearch_idx' AND n.nspname = 'public'
      ) THEN
        CREATE INDEX textsearch_idx ON public.${searchTableName} USING GIN (textsearchable_index_col);
      END IF;
    END $$;
  `;
  const dataSyncQuery = `
    CREATE OR REPLACE FUNCTION ${syncFuncName}() RETURNS trigger AS $$
    BEGIN
      IF TG_OP = 'DELETE' THEN
        DELETE FROM public.${searchTableName} WHERE ${entityIdName} = OLD.id;
        RETURN OLD;
      ELSE
        INSERT INTO public.${searchTableName} (${entityIdName}, name, textsearchable_index_col)
        VALUES (NEW.id, NEW.name, to_tsvector('english', NEW.name))
        ON CONFLICT (${entityIdName}) DO UPDATE
        SET name = EXCLUDED.name,
            textsearchable_index_col = EXCLUDED.textsearchable_index_col;
        RETURN NEW;
      END IF;
    END;
    $$ LANGUAGE plpgsql;

    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = '${triggerName}'
      ) THEN
        CREATE TRIGGER ${triggerName}
          AFTER INSERT OR UPDATE OR DELETE ON public.${tableName}
          FOR EACH ROW EXECUTE FUNCTION ${syncFuncName}();
      END IF;
    END $$;
  `;

  await dbQuery(creatingTableQuery);
  await dbQuery(initalizeTableQuery);
  await dbQuery(dataSyncQuery);
};
