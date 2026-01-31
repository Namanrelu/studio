export function createCsv(headers: string[], rows: Array<Record<string, unknown>>) {
  const escapeValue = (value: unknown) => {
    if (value === null || value === undefined) return '';
    const stringValue = String(value);
    if (/[",\n]/.test(stringValue)) {
      return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
  };

  const headerRow = headers.map(escapeValue).join(',');
  const dataRows = rows.map(row => headers.map(header => escapeValue(row[header])).join(','));

  return [headerRow, ...dataRows].join('\n');
}
