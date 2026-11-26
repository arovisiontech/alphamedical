import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      orderRef,
      customerName,
      customerWhatsApp,
      itemsDescription,
      total,
      origin,
    } = body

    const rawDigits = String(customerWhatsApp || '').replace(/\D/g, '')
    if (!rawDigits || rawDigits.length < 7) {
      return NextResponse.json(
        { error: 'Valid WhatsApp number is required.' },
        { status: 400 }
      )
    }

    const baseUrl = origin || 'https://alphasurgical.brandiedesign.agency'
    const manageUrl = `${baseUrl}/track-order?ref=${encodeURIComponent(orderRef || '')}`
    const safeName = (customerName || 'Valued Customer').trim()
    const safeItems = (itemsDescription || 'Medical Surgical Instruments').trim()
    const safeTotal = Number(total || 0).toFixed(2)

    const messageText =
      `Hello ${safeName},\n\n` +
      `Thank you for your order with *ALPHA Medical Supplies*!\n` +
      `*Order Reference:* ${orderRef}\n` +
      `*Products:* ${safeItems}\n` +
      `*Total Paid:* $${safeTotal} USD\n\n` +
      `Would you like us to *proceed with processing* your order, or would you like to *cancel* it?\n` +
      `Manage / Confirm / Cancel your order here:\n${manageUrl}`

    const waMeUrl = `https://wa.me/${rawDigits}?text=${encodeURIComponent(messageText)}`

    const cloudToken = (process.env.WHATSAPP_CLOUD_API_TOKEN || '').trim()
    const phoneNumberId = (process.env.WHATSAPP_PHONE_NUMBER_ID || '').trim()

    if (cloudToken && phoneNumberId) {
      try {
        const metaRes = await fetch(
          `https://graph.facebook.com/v20.0/${phoneNumberId}/messages`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${cloudToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messaging_product: 'whatsapp',
              to: rawDigits,
              type: 'text',
              text: { body: messageText },
            }),
          }
        )

        const metaData = await metaRes.json()
        if (metaRes.ok && metaData?.messages?.[0]?.id) {
          return NextResponse.json({
            sent: true,
            mode: 'cloud_api',
            whatsappStatus: 'Auto-Sent via ALPHA Medical Supplies WhatsApp',
            messageId: metaData.messages[0].id,
            waMeUrl,
            messageText,
          })
        }
      } catch (apiErr) {
        console.warn('WhatsApp Cloud API fallback:', apiErr)
      }
    }

    return NextResponse.json({
      sent: false,
      mode: 'wa_me_ready',
      whatsappStatus: 'Ready (Click-to-Send from ALPHA Medical Supplies)',
      waMeUrl,
      messageText,
    })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Failed to prepare WhatsApp notification.' },
      { status: 500 }
    )
  }
}
