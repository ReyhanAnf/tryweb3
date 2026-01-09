import { Card, CardContent, CardHeader, CardTitle, Checkbox } from "@/components/ui/primitives";
import { Badge } from "@/components/ui/secondary-primitives";
import { ChecklistItem } from '@/config/risk';
import { TokenIdentity } from '@/types/tokenIdentity';
import { ChecklistGuidance } from './ChecklistGuidance';

interface ChecklistTableProps {
  title: string;
  items: ChecklistItem[];
  assessments: { [id: string]: boolean };
  onToggle: (id: string, value: boolean) => void;
  identity: TokenIdentity;
}

export function ChecklistTable({ title, items, assessments, onToggle, identity }: ChecklistTableProps) {
  return (
    <Card className="mb-4">
      <CardHeader className="py-3">
        <CardTitle className="text-lg font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        {items.map((item) => {
          const isChecked = !!assessments[item.id];
          return (
            <div key={item.id} className="flex items-start space-x-3 p-2 border-b last:border-0 hover:bg-muted/50 transition-colors">
              <Checkbox
                id={item.id}
                checked={isChecked}
                onChange={(e) => onToggle(item.id, e.target.checked)}
                className="mt-1"
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor={item.id} className="text-sm font-medium leading-none cursor-pointer">
                    {item.title}
                  </label>
                  <Badge variant={item.severity === 'CRITICAL' ? 'destructive' : item.severity === 'WARNING' ? 'warning' : 'success'} className="ml-2 uppercase text-[10px]">
                    {item.severity}
                  </Badge>
                </div>
                {item.description && (
                  <p className="text-xs text-muted-foreground">
                    {item.description}
                  </p>
                )}
                {item.killSwitch && (
                  <p className="text-xs font-bold text-red-500">
                    ⚠️ KILL SWITCH ENABLED
                  </p>
                )}

                {/* GUIDANCE SECTION */}
                {item.verification && (
                  <ChecklistGuidance guidance={item.verification} identity={identity} />
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
