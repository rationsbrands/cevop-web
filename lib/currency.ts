export type SupportedCurrency = 'NGN' | 'GBP' | 'EUR' | 'USD' | 'Africa'; 

export const CURRENCY_CONFIG: Record<
  SupportedCurrency, 
  { symbol: string; locale: string; label: string } 
> = { 
  NGN:    { symbol: '₦', locale: 'en-NG', label: 'NGN — Nigerian Naira'   }, 
  GBP:    { symbol: '£', locale: 'en-GB', label: 'GBP — British Pound'    }, 
  EUR:    { symbol: '€', locale: 'de-DE', label: 'EUR — Euro'              }, 
  USD:    { symbol: '$', locale: 'en-US', label: 'USD — US Dollar'         }, 
  Africa: { symbol: '$', locale: 'en-US', label: 'Africa'                  }, 
}; 
 
 // Eurozone countries → EUR 
const EUR_COUNTRIES = new Set([ 
  'DE','FR','IT','ES','NL','BE','AT','PT','FI','GR', 
  'LU','MT','CY','SK','SI','EE','LV','LT','IE', 
]); 
 
// African countries (excluding Nigeria) → Africa tier 
const AFRICA_COUNTRIES = new Set([ 
  'GH','KE','ZA','RW','UG','TZ','CI','SN','ET','EG', 
  'MA','DZ','TN','LY','SD','AO','MZ','MG','CM','SZ', 
  'BF','ML','GN','ZM','ZW','MW','BJ','NE','TG','SL', 
  'MR','LR','ER','DJ','SO','SS','CF','CD','CG','GA', 
  'GQ','ST','CV','GM','GW','BI','RW','KM','SC','MU', 
  'LS','NA','BW','TD','LR', 
]); 
 
export function getCurrencyFromCountry( 
  countryCode: string | null | undefined 
): SupportedCurrency { 
  if (!countryCode) return 'NGN'; 
  const code = countryCode.toUpperCase(); 
  if (code === 'NG') return 'NGN'; 
  if (code === 'GB') return 'GBP'; 
  if (EUR_COUNTRIES.has(code)) return 'EUR'; 
  if (AFRICA_COUNTRIES.has(code)) return 'Africa'; 
  return 'USD'; 
} 
 
export function formatPrice( 
  value: number | null, 
  currency: SupportedCurrency 
): string { 
  if (value === null) return 'Custom'; 
  if (value === 0) return 'Free'; 
  const config = CURRENCY_CONFIG[currency]; 
  return `${config.symbol}${value.toLocaleString(config.locale)}`; 
} 
 
export function formatPriceWithPeriod( 
  value: number | null, 
  currency: SupportedCurrency 
): string { 
  if (value === null) return 'Custom pricing'; 
  if (value === 0) return 'Free forever'; 
  return `${formatPrice(value, currency)}/month`; 
} 
