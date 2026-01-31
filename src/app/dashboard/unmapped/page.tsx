import { getGoogleSheetRawData } from '@/lib/google-sheets';
import { buildUnmappedRows, SHEET_LABELS } from '@/lib/project-utils';
import { createCsv } from '@/lib/csv';
import { sheetCsvConfigs } from '@/lib/sheet-csv';
import { DownloadSheetList } from '@/components/dashboard/download-sheet-list';

export default async function UnmappedRowsPage() {
  const rawData = await getGoogleSheetRawData();
  const unmapped = buildUnmappedRows(rawData);

  const items = (Object.keys(unmapped) as Array<keyof typeof unmapped>).map(key => {
    const config = sheetCsvConfigs[key];
    const rows = unmapped[key].map(config.mapRow);
    const csvContent = createCsv(config.headers, rows);
    return {
      label: SHEET_LABELS[key],
      filename: `${key}-unmapped.csv`,
      csvContent,
      description: `${rows.length} row${rows.length === 1 ? '' : 's'} missing earlier mapping`,
    };
  });

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <DownloadSheetList
        title="Download Unmapped Rows"
        items={items}
      />
    </main>
  );
}
