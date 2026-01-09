export interface GuidanceItem {
  text: string;
  tools: { name: string; url: string }[];
}

export const IDENTITY_GUIDANCE: Record<string, GuidanceItem> = {
  name: {
    text: "Gunakan nama token yang tampil di pair DexScreener atau di explorer. Jangan ambil dari Telegram.",
    tools: [
      { name: "DexScreener", url: "https://dexscreener.com" }
    ]
  },
  ticker: {
    text: "Symbol sering dipalsukan. Pastikan cocok dengan contract address di explorer.",
    tools: [
      { name: "DexScreener", url: "https://dexscreener.com" }
    ]
  },
  chain: {
    text: "Chain dapat dikenali dari URL DexScreener atau domain explorer.",
    tools: [
      { name: "Solscan", url: "https://solscan.io" },
      { name: "Etherscan", url: "https://etherscan.io" },
      { name: "BscScan", url: "https://bscscan.com" }
    ]
  },
  contractAddress: {
    text: "Selalu copy contract address dari explorer, bukan dari chat atau pinned message.",
    tools: [
      { name: "Explorer", url: "https://google.com/search?q=blockchain+explorer" }
    ]
  },
  pair: {
    text: "Gunakan pair dengan likuiditas terbesar. Pair exotic meningkatkan exit risk.",
    tools: [
      { name: "DexScreener (Liq)", url: "https://dexscreener.com" }
    ]
  },
  launchTimestamp: {
    text: "Gunakan waktu ‘Pair Created’ di DexScreener atau transaksi pertama di explorer.",
    tools: [
      { name: "DexScreener", url: "https://dexscreener.com" }
    ]
  },
  initialLiquidity: {
    text: "Lihat liquidity saat awal launch di chart DexScreener atau transaksi add LP.",
    tools: [
      { name: "DexScreener", url: "https://dexscreener.com" }
    ]
  },
  currentMc: {
    text: "Market cap awal sering tidak akurat. Gunakan sebagai estimasi, bukan kebenaran.",
    tools: [
      { name: "DexScreener", url: "https://dexscreener.com" }
    ]
  },
  sourceDiscovery: {
    text: "Field ini dipakai AI untuk mendeteksi bias psikologis (FOMO / herd behavior). Isi dengan jujur.",
    tools: []
  }
};
