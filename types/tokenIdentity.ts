export interface TokenIdentity {
  name: string;
  ticker: string;
  chain: 'solana' | 'ethereum' | 'bsc' | 'base' | 'other';
  contractAddress: string;
  pairAddress?: string;
  launchTimestamp?: string; // ISO string or simple text approx
  initialLiquidity?: string;
  currentMc?: string;
  sourceDiscovery: string;
}

export const DEFAULT_IDENTITY: TokenIdentity = {
  name: '',
  ticker: '',
  chain: 'solana',
  contractAddress: '',
  sourceDiscovery: 'Unknown'
};
