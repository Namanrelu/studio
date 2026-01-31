import { getGoogleSheetData } from '@/lib/google-sheets';
import { buildDatabaseRows } from '@/lib/project-utils';
import { ProjectSearch } from '@/components/dashboard/project-search';

export const dynamic = 'force-dynamic';

export default async function SearchPage() {
  const googleSheetData = await getGoogleSheetData();
  const databaseRows = buildDatabaseRows(googleSheetData);

  return (
    <main className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <ProjectSearch rows={databaseRows} />
    </main>
  );
}
