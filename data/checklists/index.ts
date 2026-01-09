
export interface VerificationTool {
  name: string;
  urlTemplate: string; // e.g., "https://dexscreener.com/{chain}/{contract}"
}

export interface ChecklistVerification {
  howToCheck: string;
  tools: VerificationTool[];
}

// Extend base types dynamically or re-declare here for strictness
// For simplicity in this file-replace context, we assume ChecklistItem in config/risk is updated OR we cast.
// Let's UPDATE config/risk.ts first actually, but doing it all in one flow is cleaner if I can import.
// I will assume I need to update the definitions in this file structure effectively.

export const quickFilter = [
  {
    id: "qf_ca_verified",
    title: "Contract Verified on Explorer",
    description: "Is the contract source code verified?",
    weight: 10,
    severity: "CRITICAL",
    killSwitch: true,
    verification: {
      howToCheck: "Buka explorer → tab Contract → pastikan status Verified / Green Checkmark.",
      tools: [
        { name: "Explorer", urlTemplate: "https://{explorer_domain}/address/{contract}#code" }
      ]
    }
  },
  {
    id: "qf_liquidity_burned_locked",
    title: "Liquidity Burned or Locked > 30 Days",
    weight: 10,
    severity: "CRITICAL",
    killSwitch: true,
    verification: {
      howToCheck: "Cari burn tx (dead address) atau lock service (Team Finance/Unicrypt) di Holder list LP.",
      tools: [
        { name: "DexScreener", urlTemplate: "https://dexscreener.com/{chain}/{contract}" },
        { name: "TeamFinance", urlTemplate: "https://www.team.finance" }
      ]
    }
  },
  {
    id: "qf_honeypot_check",
    title: "Passed Honeypot Check",
    weight: 10,
    severity: "CRITICAL",
    killSwitch: true,
    verification: {
      howToCheck: "Test sell kecil atau gunakan honeypot checker automatic.",
      tools: [
         { name: "Honeypot.is", urlTemplate: "https://honeypot.is/?address={contract}" }
      ]
    }
  }
];

export const liquidity = [
  {
    id: "liq_mc_liq_ratio",
    title: "Liq/MC Ratio > 10%",
    weight: 8,
    severity: "WARNING",
    verification: {
      howToCheck: "Bandingkan Liquidity vs Market Cap di DexScreener sidebar.",
      tools: [
        { name: "DexScreener", urlTemplate: "https://dexscreener.com/{chain}/{contract}" }
      ]
    }
  },
  {
    id: "liq_pool_size",
    title: "Pool Size > $5k (micro) / $50k (std)",
    weight: 5,
    severity: "WARNING",
    verification: {
      howToCheck: "Cek total liquidity (USD value) di pair info.",
      tools: [
        { name: "DexScreener", urlTemplate: "https://dexscreener.com/{chain}/{contract}" }
      ]
    }
  }
];

export const contract = [
  {
    id: "con_minter_renounced",
    title: "Mint Authority Renounced",
    weight: 8,
    severity: "CRITICAL",
    verification: {
      howToCheck: "Solana: Mint Authority = None. EVM: RenounceOwnership tx or owner = 0x0.",
      tools: [
        { name: "Explorer", urlTemplate: "https://{explorer_domain}/token/{contract}" }
      ]
    }
  },
  {
    id: "con_freeze_revoked",
    title: "Freeze Authority Revoked",
    weight: 8,
    severity: "CRITICAL",
    verification: {
      howToCheck: "Solana: Freeze Authority = None. EVM: Check blacklist function absence.",
      tools: [
        { name: "Explorer", urlTemplate: "https://{explorer_domain}/token/{contract}" }
      ]
    }
  },
  {
    id: "con_no_blacklist",
    title: "No Blacklist Function",
    weight: 5,
    severity: "WARNING",
    verification: {
      howToCheck: "Search code for 'blacklist' or 'bot' blocking logic.",
      tools: [
        { name: "Explorer Code", urlTemplate: "https://{explorer_domain}/address/{contract}#code" }
      ]
    }
  },
  {
    id: "con_tax_low",
    title: "Buy/Sell Tax < 5%",
    weight: 4,
    severity: "WARNING",
    verification: {
      howToCheck: "Check tax on DexScreener or Honeypot checker.",
      tools: [
        { name: "Honeypot.is", urlTemplate: "https://honeypot.is/?address={contract}" }
      ]
    }
  }
];

export const holders = [
  {
    id: "hld_top10_concentration",
    title: "Top 10 Holders < 15% (excluding LP/CEX)",
    weight: 9,
    severity: "CRITICAL",
    verification: {
      howToCheck: "Explorer -> Holders Tab. Exclude Raydium/Uniswap/Burn.",
      tools: [
         { name: "Explorer", urlTemplate: "https://{explorer_domain}/token/{contract}#holders" },
         { name: "BubbleMaps", urlTemplate: "https://app.bubblemaps.io/{chain}/token/{contract}" }
      ]
    }
  },
  {
    id: "hld_dev_wallet_sold",
    title: "Dev Wallet has NOT dumped",
    weight: 7,
    severity: "WARNING",
    verification: {
      howToCheck: "Check creator wallet tx history. Did they sell all?",
      tools: [
        { name: "Explorer", urlTemplate: "https://{explorer_domain}/token/{contract}" }
      ]
    }
  },
  {
    id: "hld_unique_count",
    title: "Unique Holders increasing",
    weight: 3,
    severity: "SAFE",
    verification: {
      howToCheck: "Check holder graph trend over time.",
      tools: [
        { name: "DexScreener", urlTemplate: "https://dexscreener.com/{chain}/{contract}" }
      ]
    }
  }
];

export const execution = [
  {
    id: "exe_website_pro",
    title: "Website Quality Professional",
    weight: 2,
    severity: "SAFE",
    verification: {
      howToCheck: "Visit website. Look for effort, animations, custom art (not AI gen generic).",
      tools: [
        { name: "Website", urlTemplate: "{website_url}" } // Website usually found in metadata
      ]
    }
  },
  {
    id: "exe_socials_active",
    title: "Socials Active & Organic Engagement",
    weight: 4,
    severity: "WARNING",
    verification: {
      howToCheck: "Check Twitter/Telegram. Real comments vs Bot spam?",
      tools: [
        { name: "Twitter Search", urlTemplate: "https://twitter.com/search?q={ticker}" }
      ]
    }
  }
];

export const psychology = [
  {
    id: "psy_fomo_check",
    title: "Am I FOMOing?",
    description: "Are you entering just because green candle?",
    weight: 5,
    severity: "WARNING",
    verification: {
      howToCheck: "Look at the 5m chart. Is it parabolic? Wait for pullback.",
      tools: []
    }
  },
  {
    id: "psy_thesis_clear",
    title: "Do I have a clear Thesis?",
    weight: 5,
    severity: "WARNING",
    verification: {
      howToCheck: "Write down: Why this? Why now? What is the invalidation point?",
      tools: []
    }
  }
];
