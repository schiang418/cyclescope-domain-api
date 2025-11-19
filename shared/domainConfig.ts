/**
 * Domain Configuration
 * 
 * Defines all 6 domains and their indicators with chart URLs
 * Total: 19 indicators across 6 domains
 */

export interface IndicatorConfig {
  id: string;
  name: string;
  symbol: string;
  role: string;
  longTermChartUrl: string | null;  // null for indicators without long-term charts (e.g., VIX)
  shortTermChartUrl: string;
}

export interface DomainConfig {
  code: string;
  name: string;
  description: string;
  indicators: IndicatorConfig[];
}

/**
 * Domain 1: MACRO (4 indicators)
 */
const MACRO_DOMAIN: DomainConfig = {
  code: 'macro',
  name: 'Macro',
  description: 'Analyzes macroeconomic indicators including equities, commodities, currencies, and interest rates',
  indicators: [
    {
      id: 'spx',
      name: 'S&P 500',
      symbol: 'SPX',
      role: 'Equity benchmark',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/01_SPX_Secular_Trend.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/15_SPX.png',
    },
    {
      id: 'usd',
      name: 'US Dollar Index',
      symbol: 'USD/DXY',
      role: 'Global financial conditions',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/03_US_Dollar_Index.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/14_USD.png',
    },
    {
      id: 'tnx',
      name: '10-Year Treasury Yields',
      symbol: 'TNX',
      role: 'Risk-free rate',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/04_Treasury_10Y_Yields.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/19_TNX.png',
    },
    {
      id: 'copper_gold',
      name: 'Copper/Gold Ratio',
      symbol: 'COPPER:GOLD',
      role: 'Growth proxy',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/02_Copper_Gold_Ratio.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/16_COPPER_GOLD.png',
    },
  ],
};

/**
 * Domain 2: LEADERSHIP (4 indicators)
 */
const LEADERSHIP_DOMAIN: DomainConfig = {
  code: 'leadership',
  name: 'Leadership',
  description: 'Analyzes market leadership patterns across sectors and styles',
  indicators: [
    {
      id: 'xly_xlp',
      name: 'Consumer Discretionary vs Staples',
      symbol: 'XLY:XLP',
      role: 'Risk appetite indicator',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/08_XLY_XLP_Ratio.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/12_XLY_XLP.png',
    },
    {
      id: 'xlk_xlp',
      name: 'Technology vs Staples',
      symbol: 'XLK:XLP',
      role: 'Growth vs defensive',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/11_XLK_XLP_Ratio.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/18_XLK_XLP.png',
    },
    {
      id: 'smh_spy',
      name: 'Semiconductors vs S&P 500',
      symbol: 'SMH:SPY',
      role: 'Tech leadership',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/12_SMH_SPY_Ratio.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/10_SMH_SPY.png',
    },
    {
      id: 'iwf_iwd',
      name: 'Growth vs Value',
      symbol: 'IWF:IWD',
      role: 'Style rotation',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/09_IWF_IWD_Ratio.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/13_IWFIWDV.png',
    },
  ],
};

/**
 * Domain 3: BREADTH (4 indicators)
 */
const BREADTH_DOMAIN: DomainConfig = {
  code: 'breadth',
  name: 'Breadth',
  description: 'Analyzes market participation and internal strength',
  indicators: [
    {
      id: 'rsp_spy',
      name: 'Equal Weight vs Market Cap',
      symbol: 'RSP:SPY',
      role: 'Broad participation',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/10_RSP_SPY_Ratio.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/09_RSP_SPY.png',
    },
    {
      id: 'spxa50r',
      name: 'S&P 500 % Above 50-day MA',
      symbol: 'SPXA50R',
      role: 'Short-term breadth',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/13_SPXA50R.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/01_SPXA50R.png',
    },
    {
      id: 'spxa150r',
      name: 'S&P 500 % Above 150-day MA',
      symbol: 'SPXA150R',
      role: 'Intermediate breadth',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/14_SPXA150R.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/02_SPXA150R.png',
    },
    {
      id: 'spxa200r',
      name: 'S&P 500 % Above 200-day MA',
      symbol: 'SPXA200R',
      role: 'Long-term breadth',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/15_SPXA200R.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/03_SPXA200R.png',
    },
  ],
};

/**
 * Domain 4: LIQUIDITY (3 indicators)
 */
const LIQUIDITY_DOMAIN: DomainConfig = {
  code: 'liquidity',
  name: 'Liquidity',
  description: 'Analyzes credit conditions and financial market liquidity',
  indicators: [
    {
      id: 'hyg_ief',
      name: 'High Yield vs Treasury',
      symbol: 'HYG:IEF',
      role: 'Credit risk appetite',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/05_HYG_IEF_Ratio.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/04_HYG_IEF.png',
    },
    {
      id: 'jnk_ief',
      name: 'Junk Bond vs Treasury',
      symbol: 'JNK:IEF',
      role: 'High yield credit',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/06_JNK_IEF_Ratio.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/17_JNK_IEF.png',
    },
    {
      id: 'lqd_ief',
      name: 'Investment Grade vs Treasury',
      symbol: 'LQD:IEF',
      role: 'Investment grade credit',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/07_LQD_IEF_Ratio.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/05_LQD_IEF.png',
    },
  ],
};

/**
 * Domain 5: VOLATILITY (3 indicators)
 * Note: VIX (indicator 18) only has short-term chart
 */
const VOLATILITY_DOMAIN: DomainConfig = {
  code: 'volatility',
  name: 'Volatility',
  description: 'Analyzes market volatility and risk sentiment',
  indicators: [
    {
      id: 'vix_vxv',
      name: 'VIX Term Structure',
      symbol: 'VIX:VXV',
      role: 'Volatility term structure',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/17_VIX_VXV_Ratio.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/06_VIX_VXV.png',
    },
    {
      id: 'vvix',
      name: 'Volatility of VIX',
      symbol: 'VVIX',
      role: 'Volatility of volatility',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/18_VVIX.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/07_VVIX.png',
    },
    {
      id: 'vix',
      name: 'VIX (Volatility Index)',
      symbol: 'VIX',
      role: 'Market fear gauge',
      longTermChartUrl: null,  // No long-term chart available
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/08_VIX.png',
    },
  ],
};

/**
 * Domain 6: SENTIMENT (1 indicator)
 */
const SENTIMENT_DOMAIN: DomainConfig = {
  code: 'sentiment',
  name: 'Sentiment',
  description: 'Analyzes market sentiment and positioning',
  indicators: [
    {
      id: 'cpce',
      name: 'Put/Call Ratio',
      symbol: 'CPCE',
      role: 'Options sentiment',
      longTermChartUrl: 'https://cyclescope-dashboard-production.up.railway.app/charts/16_CPCE_Put_Call.png',
      shortTermChartUrl: 'https://cyclescope-delta-dashboard-production.up.railway.app/charts/11_CPCE.png',
    },
  ],
};

/**
 * All domain configurations
 */
export const ALL_DOMAINS: DomainConfig[] = [
  MACRO_DOMAIN,
  LEADERSHIP_DOMAIN,
  BREADTH_DOMAIN,
  LIQUIDITY_DOMAIN,
  VOLATILITY_DOMAIN,
  SENTIMENT_DOMAIN,
];

/**
 * Domain codes for validation
 */
export const VALID_DOMAIN_CODES = ALL_DOMAINS.map(d => d.code);

/**
 * Get domain configuration by code
 */
export function getDomainConfig(code: string): DomainConfig | undefined {
  return ALL_DOMAINS.find(d => d.code === code.toLowerCase());
}

/**
 * Get all domain configurations
 */
export function getAllDomainConfigs(): DomainConfig[] {
  return ALL_DOMAINS;
}

/**
 * Validate domain code
 */
export function isValidDomainCode(code: string): boolean {
  return VALID_DOMAIN_CODES.includes(code);
}

/**
 * Get indicator configuration
 */
export function getIndicatorConfig(
  domainCode: string,
  indicatorId: string
): IndicatorConfig | undefined {
  const domain = getDomainConfig(domainCode);
  return domain?.indicators.find(i => i.id === indicatorId);
}

/**
 * Get all indicators across all domains
 */
export function getAllIndicators(): IndicatorConfig[] {
  return ALL_DOMAINS.flatMap(d => d.indicators);
}

/**
 * Get total indicator count
 */
export function getTotalIndicatorCount(): number {
  return ALL_DOMAINS.reduce((sum, d) => sum + d.indicators.length, 0);
}

/**
 * Summary statistics
 */
export const DOMAIN_STATS = {
  totalDomains: ALL_DOMAINS.length,
  totalIndicators: getTotalIndicatorCount(),
  indicatorsByDomain: ALL_DOMAINS.map(d => ({
    domain: d.name,
    code: d.code,
    count: d.indicators.length,
  })),
};

