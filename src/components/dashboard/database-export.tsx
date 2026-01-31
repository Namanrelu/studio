'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

type DatabaseExportProps = {
  csvContent: string;
  filename: string;
};

export function DatabaseExport({ csvContent, filename }: DatabaseExportProps) {
  const [copied, setCopied] = useState(false);

  const handleDownload = () => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(csvContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy CSV', error);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <Button onClick={handleDownload}>Download CSV</Button>
      <Button variant="outline" onClick={handleCopy}>
        {copied ? 'Copied!' : 'Copy CSV'}
      </Button>
    </div>
  );
}
