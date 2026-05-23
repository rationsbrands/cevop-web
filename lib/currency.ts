// Supported currencies
export type SupportedCurrency = 'NGN' | 'GBP' | 'USD' | 'Africa';

export const CURRENCY_CONFIG: Record<SupportedCurrency, { symbol: string; locale: string; label: string }> = {
  NGN: { symbol: '₦', locale: 'en-NG', label: 'NGN — Nigerian Naira' },
  GBP: { symbol: '£', locale: 'en-GB', label: 'GBP — British Pound' },
  USD: { symbol: '$', locale: 'en-US', label: 'USD — US Dollar' },
  Africa: { symbol: '$', locale: 'en-US', label: 'Africa — USD equivalent' },
};

// Map country codes to currencies
// UK → GBP. Everything else defaults to NGN (our primary market is West Africa)
const COUNTRY_CURRENCY_MAP: Record<string, SupportedCurrency> = {
  GB: 'GBP',
  IE: 'GBP', // Ireland — close enough for our purposes
};

export function getCurrencyFromCountry(countryCode: string | null | undefined): SupportedCurrency {
  if (!countryCode) return 'NGN';
  return COUNTRY_CURRENCY_MAP[countryCode.toUpperCase()] ?? 'NGN';
}

export function formatPrice(value: number | null, currency: SupportedCurrency): string {
  if (value === null) return 'Custom';
  if (value === 0) return 'Free';
  const config = CURRENCY_CONFIG[currency];
  return `${config.symbol}${value.toLocaleString(config.locale)}`;
}

export function formatPriceWithPeriod(value: number | null, currency: SupportedCurrency): string {
  if (value === null) return 'Custom pricing';
  if (value === 0) return 'Free forever';
  return `${formatPrice(value, currency)}/month`;
}
