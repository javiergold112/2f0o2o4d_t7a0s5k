import ExcelJS from "exceljs";

import { updateEntityTable } from "../../db";
import { TableDataEnum } from "../../enums";
import { TableItemType } from "../../types";

const completeFileExtracting = (tableName: string) => {
  return (processedRows: number) => {
    console.log(`Final processed items of ${tableName}:`, processedRows);
  };
};

const handleProcessedChunk = (tableName: string) => {
  return async (chunk: TableItemType[]) => {
    await updateEntityTable(chunk, tableName);
  };
};

// Function to read and process XLSX file in chunks
const processXlsxFileInChunks = async (
  filePath: string,
  chunkSize: number,
  onChunkProcessed: (chunk: TableItemType[]) => Promise<void>,
  onComplete: (processedRows: number) => void
) => {
  try {
    const workbookReader = new ExcelJS.stream.xlsx.WorkbookReader(filePath, {});
    let chunk = [];
    let processedRows = 0;
    let isFirstRow = true;

    for await (const worksheetReader of workbookReader) {
      for await (const row of worksheetReader) {
        if (isFirstRow) {
          isFirstRow = false;
          continue; // Skip the header row
        }

        const id = row.getCell("A").value;
        const name = row.getCell("B").value;

        if (!id) {
          break;
        }

        chunk.push({
          id: id as number,
          name: name as string,
        });

        processedRows++;

        if (chunk.length === chunkSize) {
          console.log("Process chunk:", chunk);
          await onChunkProcessed(chunk);

          chunk = []; // Reset chunk
        }
      }
    }

    // Process any remaining rows in the last chunk
    if (chunk.length > 0) {
      // Process final chunk here
      await onChunkProcessed(chunk);
      onComplete(processedRows);
    }
  } catch (error) {
    console.error("Failed to read Excel file:", error);
  }
};

export const ETL = async () => {
  const chunkSize = 1000;
  for await (const tableData of TableDataEnum) {
    await processXlsxFileInChunks(
      tableData.filePath,
      chunkSize,
      handleProcessedChunk(tableData.tableName),
      completeFileExtracting(tableData.tableName)
    );
  }
};
