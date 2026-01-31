'use client';

import { useMemo, useState } from 'react';
import { DatabaseRow } from '@/lib/project-utils';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type ProjectSearchProps = {
  rows: DatabaseRow[];
};

type StageKey = Exclude<keyof DatabaseRow, 'projectId'>;

const sections: Array<{
  key: StageKey;
  title: string;
  fields: Array<[string, string]>;
}> = [
  {
    key: 'newProject',
    title: 'New Project Submission',
    fields: [
      ['timestamp', 'Timestamp'],
      ['projectName', 'Project Name'],
      ['clientName', 'Client Name'],
      ['emailAddress', 'Email'],
      ['companyName', 'Company Name'],
      ['companyType', 'Company Type'],
      ['projectDescription', 'Project Description'],
      ['clientMessage', 'Client Message'],
      ['clientCountry', 'Client Country'],
      ['clientTimezone', 'Client Timezone'],
      ['communicationPlatforms', 'Communication Platforms'],
      ['businessManager', 'Business Manager'],
      ['internalInstructions', 'Internal Instructions'],
      ['attachments', 'Attachments'],
      ['gdriveFolderLink', 'GDrive Folder Link'],
    ],
  },
  {
    key: 'versionUpgrade',
    title: 'Version Upgrade Submission',
    fields: [
      ['timestamp', 'Timestamp'],
      ['version', 'Version'],
      ['newRequirements', 'New Requirements'],
    ],
  },
  {
    key: 'estimation',
    title: 'Project Estimation',
    fields: [
      ['timestamp', 'Timestamp'],
      ['estimatedHours', 'Estimated Hours'],
      ['estimatedCost', 'Estimated Cost'],
    ],
  },
  {
    key: 'approval',
    title: 'Project Approval',
    fields: [
      ['timestamp', 'Timestamp'],
      ['approvedBy', 'Approved By'],
      ['approvalDate', 'Approval Date'],
      ['expectedDeliveryDate', 'Expected Delivery Date'],
      ['deliveryMethod', 'Delivery Method'],
    ],
  },
  {
    key: 'delivery',
    title: 'Project Delivery',
    fields: [
      ['timestamp', 'Timestamp'],
      ['deliveryDate', 'Delivery Date'],
      ['deliveredBy', 'Delivered By'],
      ['notes', 'Notes'],
    ],
  },
  {
    key: 'feedback',
    title: 'Project Feedback',
    fields: [
      ['timestamp', 'Timestamp'],
      ['satisfactionScore', 'Satisfaction Score'],
      ['feedback', 'Feedback'],
      ['clientContact', 'Client Contact'],
    ],
  },
];

export function ProjectSearch({ rows }: ProjectSearchProps) {
  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return [];
    return rows.filter(row => {
      const name = row.newProject?.projectName || '';
      return (
        row.projectId.toLowerCase().includes(normalizedQuery) ||
        name.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [rows, query]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Search Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Search by project name or project ID..."
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
        </CardContent>
      </Card>

      {query && results.length === 0 && (
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            No projects matched your search.
          </CardContent>
        </Card>
      )}

      {results.map(row => (
        <Card key={row.projectId}>
          <CardHeader>
            <CardTitle className="font-headline">{row.projectId}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {sections.map(section => {
              const data = row[section.key];
              return (
                <div key={section.key} className="space-y-2">
                  <h3 className="text-sm font-semibold text-muted-foreground">
                    {section.title}
                  </h3>
                  {data ? (
                    <dl className="grid gap-2 md:grid-cols-2">
                      {section.fields.map(([field, label]) => (
                        <div key={field} className="space-y-1">
                          <dt className="text-xs uppercase text-muted-foreground">{label}</dt>
                          <dd className="text-sm">{String(data[field as keyof typeof data] ?? 'N/A')}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : (
                    <p className="text-sm text-muted-foreground">No entry for this stage.</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
