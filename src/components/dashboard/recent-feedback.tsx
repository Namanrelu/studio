import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Star } from 'lucide-react';
import type { CombinedProjectData } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

type RecentFeedbackProps = {
  data: CombinedProjectData[];
};

function Rating({ score }: { score: number }) {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < score ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground'
          }`}
        />
      ))}
    </div>
  );
}

export function RecentFeedback({ data }: RecentFeedbackProps) {
  const feedbackData = data
    .filter(p => p.feedback)
    .sort((a, b) => (b.actualDelivery?.getTime() || 0) - (a.actualDelivery?.getTime() || 0))
    .slice(0, 5);

  const feedbackAvatars = [
    PlaceHolderImages.find(img => img.id === 'feedback-avatar-1'),
    PlaceHolderImages.find(img => img.id === 'feedback-avatar-2')
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Recent Feedback</CardTitle>
        <CardDescription>Latest feedback from clients.</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px]">
          <div className="space-y-6">
            {feedbackData.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                <Avatar>
                  {feedbackAvatars[index % 2] && (
                    <AvatarImage src={feedbackAvatars[index % 2]?.imageUrl} alt="Client Avatar" data-ai-hint={feedbackAvatars[index % 2]?.imageHint}/>
                  )}
                  <AvatarFallback>{item.client.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{item.name}</p>
                    <Rating score={item.satisfaction || 0} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    "{item.feedback}"
                  </p>
                </div>
              </div>
            ))}
             {feedbackData.length === 0 && (
              <div className="text-center text-muted-foreground pt-10">
                No recent feedback available.
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
