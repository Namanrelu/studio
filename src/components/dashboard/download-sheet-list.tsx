'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type SheetDownload = {
  label: string;
  filename: string;
  csvContent: string;
  description?: string;
};

type DownloadSheetListProps = {
  title: string;
  items: SheetDownload[];
};

export function DownloadSheetList({ title, items }: DownloadSheetListProps) {
  const handleDownload = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(item => (
          <div key={item.label} className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              {item.description && (
                <p className="text-xs text-muted-foreground">{item.description}</p>
              )}
            </div>
            <Button onClick={() => handleDownload(item.csvContent, item.filename)}>
              Download CSV
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
