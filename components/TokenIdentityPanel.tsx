import { Card, CardContent, CardHeader, CardTitle, Input, Label } from "@/components/ui/primitives";
import { TokenIdentity } from '@/types/tokenIdentity';
import { TokenIdentityGuidance } from './TokenIdentityGuidance';

interface TokenIdentityPanelProps {
  identity: TokenIdentity;
  onChange: (newIdentity: TokenIdentity) => void;
}

export function TokenIdentityPanel({ identity, onChange }: TokenIdentityPanelProps) {

  const handleChange = (key: keyof TokenIdentity, value: string) => {
    onChange({ ...identity, [key]: value });
  };

  return (
    <Card className="mb-6 border-l-4 border-l-blue-600">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Token Identity Context</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">

        {/* ROW 1: Name, Ticker, Chain */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Token Name</Label>
            <Input
              value={identity.name}
              onChange={e => handleChange('name', e.target.value)}
              placeholder="e.g. Pepe"
            />
            <TokenIdentityGuidance fieldKey="name" />
          </div>
          <div>
            <Label>Ticker Symbol</Label>
            <Input
              value={identity.ticker}
              onChange={e => handleChange('ticker', e.target.value)}
              placeholder="e.g. PEPE"
              className="font-mono uppercase font-bold"
            />
            <TokenIdentityGuidance fieldKey="ticker" />
          </div>
          <div>
            <Label>Chain</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={identity.chain}
              onChange={e => handleChange('chain', e.target.value as any)}
            >
              <option value="solana">Solana</option>
              <option value="ethereum">Ethereum</option>
              <option value="bsc">BSC</option>
              <option value="base">Base</option>
              <option value="other">Other</option>
            </select>
            <TokenIdentityGuidance fieldKey="chain" />
          </div>
        </div>

        {/* ROW 2: Contract, Paid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Contract Address (CA)</Label>
            <Input
              value={identity.contractAddress}
              onChange={e => handleChange('contractAddress', e.target.value)}
              placeholder="0x... or solana address"
              className="font-mono text-xs"
            />
            <TokenIdentityGuidance fieldKey="contractAddress" />
          </div>
          <div>
            <Label>Source Discovery</Label>
             <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={identity.sourceDiscovery}
              onChange={e => handleChange('sourceDiscovery', e.target.value)}
            >
              <option value="Unknown">Unknown</option>
              <option value="DexScreener">DexScreener (New Pairs)</option>
              <option value="Telegram Call">Telegram Call / Alpha Group</option>
              <option value="Twitter">Twitter / X Influencer</option>
              <option value="Friend">Word of Mouth / Friend</option>
              <option value="Other">Other</option>
            </select>
            <TokenIdentityGuidance fieldKey="sourceDiscovery" />
          </div>
        </div>

        {/* ROW 3: Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div>
            <Label>Launch Time (Approx)</Label>
            <Input
              value={identity.launchTimestamp || ''}
              onChange={e => handleChange('launchTimestamp', e.target.value)}
              placeholder="e.g. 10 mins ago"
            />
            <TokenIdentityGuidance fieldKey="launchTimestamp" />
          </div>
          <div>
            <Label>Initial Liquidity</Label>
            <Input
              value={identity.initialLiquidity || ''}
              onChange={e => handleChange('initialLiquidity', e.target.value)}
              placeholder="e.g. $2,000"
            />
            <TokenIdentityGuidance fieldKey="initialLiquidity" />
          </div>
          <div>
            <Label>Current Market Cap</Label>
            <Input
              value={identity.currentMc || ''}
              onChange={e => handleChange('currentMc', e.target.value)}
              placeholder="e.g. $150k"
            />
            <TokenIdentityGuidance fieldKey="currentMc" />
          </div>
        </div>

      </CardContent>
    </Card>
  );
}
