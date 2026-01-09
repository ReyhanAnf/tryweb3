import { VerificationInfo } from '@/config/risk';
import { TokenIdentity } from '@/types/tokenIdentity';
import { ExternalLink, Info } from 'lucide-react';
import { useState } from 'react';

interface ChecklistGuidanceProps {
  guidance: VerificationInfo;
  identity: TokenIdentity;
}

export function ChecklistGuidance({ guidance, identity }: ChecklistGuidanceProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to replace placeholders
  const getToolUrl = (template: string) => {
    let url = template;

    // Replace standard placeholders
    url = url.replace('{contract}', identity.contractAddress || '');
    url = url.replace('{chain}', identity.chain || 'solana');
    url = url.replace('{ticker}', identity.ticker || '');

    // Domain logic
    let domain = 'etherscan.io';
    if (identity.chain === 'solana') domain = 'solscan.io';
    if (identity.chain === 'bsc') domain = 'bscscan.com';
    if (identity.chain === 'base') domain = 'basescan.org';
    url = url.replace('{explorer_domain}', domain);

    return url;
  };

  return (
    <div className="mt-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs text-blue-600 hover:text-blue-800 flex items-center focus:outline-none"
      >
        <Info className="w-3 h-3 mr-1" />
        {isOpen ? "Hide Verification Steps" : "How to Check"}
      </button>

      {isOpen && (
        <div className="mt-2 p-3 bg-blue-50/50 rounded text-xs border border-blue-100 animate-in fade-in slide-in-from-top-1">
          <p className="font-semibold text-blue-900 mb-1">Verify: {guidance.howToCheck}</p>

          <div className="flex flex-wrap gap-2 mt-2">
             {guidance.tools.map(tool => {
               const finalUrl = getToolUrl(tool.urlTemplate);
               const isMissingContract = tool.urlTemplate.includes('{contract}') && !identity.contractAddress;

               if (isMissingContract) {
                 return (
                   <span key={tool.name} className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-400 rounded cursor-not-allowed border">
                      Needs Contract Address
                   </span>
                 );
               }

               return (
                 <a
                   key={tool.name}
                   href={finalUrl}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="inline-flex items-center px-2 py-1 bg-white border border-blue-200 text-blue-700 rounded hover:bg-blue-50 transition-colors"
                 >
                   <ExternalLink className="w-3 h-3 mr-1" />
                   {tool.name}
                 </a>
               );
             })}
          </div>
        </div>
      )}
    </div>
  );
}
