import { inistializeEntityTable, initializeEntitySearchTable } from "../../db";
import { TableDataEnum } from "../../enums";

export const initializeDBTables = async () => {
  for await (const tableData of TableDataEnum) {
    console.log(`creating ${tableData.tableName} table`);
    await inistializeEntityTable(tableData.tableName);

    console.log(`Initializing of search table for ${tableData.tableName}`);
    await initializeEntitySearchTable(
      tableData.tableName,
      tableData.searchTableName,
      tableData.entityIdName,
      tableData.syncFuncName,
      tableData.triggerName
    );
  }
};
