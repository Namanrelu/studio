'use client';
import { useState } from 'react';
import { identifyProjectTrends } from '@/ai/flows/identify-project-trends';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Loader2, Sparkles } from 'lucide-react';
import type { AllSubmissions } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

type AITrendsProps = {
  data: AllSubmissions;
};

export function AITrends({ data }: AITrendsProps) {
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState('');
  const { toast } = useToast();

  const handleAnalyze = async () => {
    setLoading(true);
    setTrends('');
    try {
      const result = await identifyProjectTrends({
        newProjectSubmissions: JSON.stringify(data.newProjectSubmissions),
        versionUpgradeSubmissions: JSON.stringify(data.versionUpgradeSubmissions),
        projectEstimationSubmissions: JSON.stringify(data.projectEstimationSubmissions),
        projectApprovalSubmissions: JSON.stringify(data.projectApprovalSubmissions),
        projectDeliverySubmissions: JSON.stringify(data.projectDeliverySubmissions),
        projectFeedbackSubmissions: JSON.stringify(data.projectFeedbackSubmissions),
      });
      setTrends(result.trends);
    } catch (error) {
      console.error('Error analyzing trends:', error);
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: 'Could not generate AI insights. Please try again later.',
      });
    }
    setLoading(false);
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="font-headline flex items-center gap-2">
          <Sparkles className="text-primary" />
          <span>AI-Powered Insights</span>
        </CardTitle>
        <CardDescription>
          Use AI to identify trends and patterns in your project data.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p>Analyzing project data...</p>
            </div>
          </div>
        ) : trends ? (
          <div className="prose prose-sm max-w-none text-sm text-foreground whitespace-pre-wrap">{trends}</div>
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-muted-foreground">
              <p className="mb-4">Click the button to generate insights.</p>
              <Button onClick={handleAnalyze} disabled={loading}>
                {loading ? <Loader2 className="animate-spin" /> : <Sparkles />}
                <span>Analyze Trends</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter>
          <Alert>
              <Sparkles className="h-4 w-4" />
              <AlertTitle>Disclaimer</AlertTitle>
              <AlertDescription>
                This tool does not guarantee results. AI-generated insights are for informational purposes and may not be fully accurate.
              </AlertDescription>
          </Alert>
      </CardFooter>
    </Card>
  );
}
