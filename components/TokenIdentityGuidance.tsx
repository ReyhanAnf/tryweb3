import { IDENTITY_GUIDANCE } from '@/data/identityGuidance';
import { ExternalLink } from 'lucide-react';

interface TokenIdentityGuidanceProps {
  fieldKey: string;
}

export function TokenIdentityGuidance({ fieldKey }: TokenIdentityGuidanceProps) {
  const guidance = IDENTITY_GUIDANCE[fieldKey];

  if (!guidance) return null;

  return (
    <div className="mt-1 mb-3 text-xs text-muted-foreground bg-slate-100 dark:bg-slate-900 p-2 rounded border-l-2 border-primary/50">
      <p className="mb-1 font-medium">{guidance.text}</p>
      {guidance.tools.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {guidance.tools.map((tool) => (
            <a
              key={tool.name}
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-[10px] bg-white dark:bg-slate-800 border px-1.5 py-0.5 rounded hover:text-primary transition-colors"
            >
              <ExternalLink className="w-3 h-3 mr-1" />
              {tool.name}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
