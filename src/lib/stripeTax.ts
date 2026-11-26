import Stripe from 'stripe'

export const US_STATE_TO_CODE: Record<string, string> = {
  alabama: 'AL',
  alaska: 'AK',
  arizona: 'AZ',
  arkansas: 'AR',
  california: 'CA',
  colorado: 'CO',
  connecticut: 'CT',
  delaware: 'DE',
  'district of columbia': 'DC',
  florida: 'FL',
  georgia: 'GA',
  hawaii: 'HI',
  idaho: 'ID',
  illinois: 'IL',
  indiana: 'IN',
  iowa: 'IA',
  kansas: 'KS',
  kentucky: 'KY',
  louisiana: 'LA',
  maine: 'ME',
  maryland: 'MD',
  massachusetts: 'MA',
  michigan: 'MI',
  minnesota: 'MN',
  mississippi: 'MS',
  missouri: 'MO',
  montana: 'MT',
  nebraska: 'NE',
  nevada: 'NV',
  'new hampshire': 'NH',
  'new jersey': 'NJ',
  'new mexico': 'NM',
  'new york': 'NY',
  'north carolina': 'NC',
  'north dakota': 'ND',
  ohio: 'OH',
  oklahoma: 'OK',
  oregon: 'OR',
  pennsylvania: 'PA',
  'rhode island': 'RI',
  'south carolina': 'SC',
  'south dakota': 'SD',
  tennessee: 'TN',
  texas: 'TX',
  utah: 'UT',
  vermont: 'VT',
  virginia: 'VA',
  washington: 'WA',
  'west virginia': 'WV',
  wisconsin: 'WI',
  wyoming: 'WY',
}

export function normalizeUsStateCode(region?: string): string | undefined {
  if (!region) return undefined
  const trimmed = region.trim()
  if (/^[A-Za-z]{2}$/.test(trimmed)) return trimmed.toUpperCase()
  return US_STATE_TO_CODE[trimmed.toLowerCase()]
}

export function round2(n: number): number {
  return Math.round((Number(n) || 0) * 100) / 100
}

export interface TaxCalculationInput {
  items: Array<{ id?: string; title?: string; sku?: string; price?: number; quantity?: number }>
  shippingCost: number
  discountAmount: number
  shippingAddress: {
    address?: string
    address2?: string
    city?: string
    region?: string
    postCode?: string
    country?: string
  }
}

export interface TaxCalculationResult {
  calculationId: string
  subtotal: number
  shipping: number
  discount: number
  taxAmount: number
  total: number
  amountInCents: number
  taxBreakdown: Array<{ amount: number; rate: string; jurisdiction: string }>
}

export async function calculateStripeAutomaticTax(
  stripe: Stripe,
  input: TaxCalculationInput
): Promise<TaxCalculationResult> {
  const rawSubtotal = round2(
    input.items.reduce((acc, it) => {
      const unit = round2(Number(it.price) || 0)
      const qty = Math.max(1, Number(it.quantity) || 1)
      return acc + round2(unit * qty)
    }, 0)
  )

  const shipping = Math.max(0, round2(Number(input.shippingCost) || 0))
  const discount = Math.min(
    Math.max(0, round2(Number(input.discountAmount) || 0)),
    round2(rawSubtotal + shipping)
  )

  // Apply product discount proportionally across line items so Stripe Tax calculates tax on net discounted price
  const productDiscount = Math.min(discount, rawSubtotal)
  const discountRatio = rawSubtotal > 0 ? (rawSubtotal - productDiscount) / rawSubtotal : 1

  const lineItems: Stripe.Tax.CalculationCreateParams.LineItem[] = input.items.map((it, idx) => {
    const unit = round2(Number(it.price) || 0)
    const qty = Math.max(1, Number(it.quantity) || 1)
    const lineCents = Math.max(1, Math.round(round2(unit * qty) * discountRatio * 100))
    return {
      amount: lineCents,
      quantity: 1,
      reference: String(it.sku || it.id || `item-${idx + 1}`).slice(0, 100),
      tax_behavior: 'exclusive',
    }
  })

  const remainingShippingDiscount = Math.max(0, discount - productDiscount)
  const netShipping = Math.max(0, round2(shipping - remainingShippingDiscount))
  const shippingCents = Math.round(netShipping * 100)

  const stateCode = normalizeUsStateCode(input.shippingAddress?.region)
  const postalCode = (input.shippingAddress?.postCode || '').trim()

  const calculation = await stripe.tax.calculations.create({
    currency: 'usd',
    line_items: lineItems,
    ...(shippingCents > 0
      ? {
          shipping_cost: {
            amount: shippingCents,
            tax_behavior: 'exclusive',
          },
        }
      : {}),
    customer_details: {
      address: {
        line1: (input.shippingAddress?.address || '').trim() || undefined,
        line2: (input.shippingAddress?.address2 || '').trim() || undefined,
        city: (input.shippingAddress?.city || '').trim() || undefined,
        state: stateCode,
        postal_code: postalCode,
        country: 'US',
      },
      address_source: 'shipping',
    },
  })

  const taxAmount = round2((calculation.tax_amount_exclusive || 0) / 100)
  const total = round2((calculation.amount_total || 0) / 100)

  const taxBreakdown = (calculation.tax_breakdown || []).map((tb) => {
    const details = tb.tax_rate_details
    const jurisdictionLabel =
      [details?.state, details?.tax_type?.replace(/_/g, ' ')].filter(Boolean).join(' ') ||
      details?.country ||
      'Sales Tax'
    return {
      amount: round2((tb.amount || 0) / 100),
      rate: String(details?.percentage_decimal || '0'),
      jurisdiction: jurisdictionLabel,
    }
  })

  return {
    calculationId: calculation.id || '',
    subtotal: rawSubtotal,
    shipping,
    discount,
    taxAmount,
    total,
    amountInCents: calculation.amount_total,
    taxBreakdown,
  }
}
