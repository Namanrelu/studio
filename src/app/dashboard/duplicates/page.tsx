import { getGoogleSheetRawData } from '@/lib/google-sheets';
import { buildDuplicateRows, SHEET_LABELS } from '@/lib/project-utils';
import { createCsv } from '@/lib/csv';
import { sheetCsvConfigs } from '@/lib/sheet-csv';
import { DownloadSheetList } from '@/components/dashboard/download-sheet-list';

export const dynamic = 'force-dynamic';

export default async function DuplicateRowsPage() {
  const rawData = await getGoogleSheetRawData();
  const duplicates = buildDuplicateRows(rawData);

  const items = (Object.keys(duplicates) as Array<keyof typeof duplicates>).map(key => {
    const config = sheetCsvConfigs[key];
    const rows = duplicates[key].map(config.mapRow);
    const csvContent = createCsv(config.headers, rows);
    return {
      label: SHEET_LABELS[key],
      filename: `${key}-duplicates.csv`,
      csvContent,
      description: `${rows.length} duplicate row${rows.length === 1 ? '' : 's'}`,
    };
  });

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <DownloadSheetList
        title="Download Duplicate Rows"
        items={items}
      />
    </main>
  );
}
