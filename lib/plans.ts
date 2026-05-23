import { getSupabaseClient } from '@/lib/supabase';
import { CURRENCY_CONFIG, SupportedCurrency } from './currency';

export interface Plan {
  id: string;
  name: string;
  description: string;
  prices: Record<SupportedCurrency, { monthly: number | null; annual: number | null }>;
  features: string[];
  cta: string;
  highlighted: boolean;
  roiLine?: string;
}

export async function fetchPlans(): Promise<Plan[]> {
  try {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('pricing_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order');

    if (error || !data || data.length === 0) {
      return getDefaultPlans();
    }

    // Map Supabase row shape to Plan interface
    // Handles both column naming conventions the admin CMS may use
    return data.map((row: any): Plan => ({
      id: row.id ?? String(row.name).toLowerCase(),
      name: row.name,
      description: row.tagline ?? row.description ?? '',
      prices: {
        NGN: {
          monthly: row.price_ngn ?? null,
          annual: row.price_ngn_annual ?? (row.price_ngn ? Math.round(row.price_ngn * 11) : null),
        },
        GBP: {
          monthly: row.price_gbp ?? null,
          annual: row.price_gbp_annual ?? (row.price_gbp ? Math.round(row.price_gbp * 11) : null),
        },
        USD: {
          monthly: row.price_usd ?? null,
          annual: row.price_usd_annual ?? (row.price_usd ? Math.round(row.price_usd * 11) : null),
        },
        Africa: {
          monthly: row.price_africa ?? null,
          annual: row.price_africa_annual ?? (row.price_africa ? Math.round(row.price_africa * 11) : null),
        },
      },
      features: Array.isArray(row.features)
        ? row.features.map((f: any) => (typeof f === 'string' ? f : f?.text ?? ''))
        : [],
      cta: row.cta_text ?? (String(row.name).toLowerCase() === 'enterprise' ? 'Contact Us' : 'Get Started'),
      highlighted: row.is_popular ?? row.is_highlighted ?? false,
      roiLine: row.roi_line ?? undefined,
    }));
  } catch {
    return getDefaultPlans();
  }
}

// Fallback — used if Supabase is unreachable
// These are the authoritative prices — keep in sync with pricing_plans table
function getDefaultPlans(): Plan[] {
  return [
    {
      id: 'free',
      name: 'Free',
      description: 'Start exploring with no commitment.',
      prices: {
        NGN: { monthly: 0, annual: 0 },
        GBP: { monthly: 0, annual: 0 },
        USD: { monthly: 0, annual: 0 },
        Africa: { monthly: 0, annual: 0 },
      },
      features: [
        '1 branch',
        'Up to 5 tables',
        'Up to 3 staff accounts',
        'QR menus & service display',
        'Waiter calls & service requests',
        'Live item availability updates',
        'Basic order flow (RECEIVED to SERVED)',
        '7-day analytics',
        'No credit card required',
      ],
      cta: 'Start Free',
      highlighted: false,
    },
    {
      id: 'starter',
      name: 'Starter',
      description: 'Everything a single location needs.',
      prices: {
        NGN: { monthly: 18000, annual: 16500 },
        GBP: { monthly: 29, annual: 27 },
        USD: { monthly: 39, annual: 36 },
        Africa: { monthly: 15, annual: 14 },
      },
      roiLine: 'A 25-table restaurant typically pays this in 2 rounds of missed orders.',
      features: [
        '1 branch',
        'Up to 25 tables',
        'Up to 10 staff accounts',
        'QR menus & service display',
        'Waiter calls, service requests & bill requests',
        'Floor sections & auto-assignment',
        '30-day analytics',
        'Cancel anytime',
      ],
      cta: 'Get Started',
      highlighted: false,
    },
    {
      id: 'growth',
      name: 'Growth',
      description: 'For restaurants expanding to multiple sites.',
      prices: {
        NGN: { monthly: 45000, annual: 41250 },
        GBP: { monthly: 79, annual: 72 },
        USD: { monthly: 99, annual: 91 },
        Africa: { monthly: 35, annual: 32 },
      },
      features: [
        'Up to 5 branches',
        'Up to 100 tables across all branches',
        'Unlimited staff accounts',
        'Everything in Starter',
        'Staff rotation & section shuffling',
        'Multi-branch dashboard',
        '1-year analytics',
        'Custom branding',
        'Priority support',
        'Cancel anytime',
      ],
      cta: 'Get Started',
      highlighted: true,
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Custom deployment for large groups.',
      prices: {
        NGN: { monthly: null, annual: null },
        GBP: { monthly: null, annual: null },
        USD: { monthly: null, annual: null },
        Africa: { monthly: null, annual: null },
      },
      features: [
        'Unlimited branches and tables',
        'Unlimited staff accounts',
        'Everything in Growth',
        'API access and integrations',
        'Custom onboarding and SLA',
        'Dedicated account manager',
        'Annual contract',
      ],
      cta: 'Contact Us',
      highlighted: false,
    },
  ];
}

export function formatPlanPrice(value: number | null, currency: SupportedCurrency): string {
  if (value === null) return 'Custom';
  if (value === 0) return 'Free';
  const config = CURRENCY_CONFIG[currency];
  return `${config.symbol}${value.toLocaleString(config.locale)}`;
}
