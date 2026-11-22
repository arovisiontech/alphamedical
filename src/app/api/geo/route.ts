import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  // Check common reverse proxy / CDN country headers
  const countryHeader =
    req.headers.get('cf-ipcountry') ||
    req.headers.get('x-vercel-ip-country') ||
    req.headers.get('x-country-code') ||
    req.headers.get('geoip-country-code') ||
    req.headers.get('x-geo-country') ||
    ''

  return NextResponse.json({
    country: countryHeader ? countryHeader.toUpperCase() : null,
  })
}
