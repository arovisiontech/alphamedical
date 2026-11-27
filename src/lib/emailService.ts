export interface OrderEmailPayload {
  orderRef: string
  customerName: string
  customerEmail: string
  items: Array<{
    title: string
    sku?: string
    size?: string
    quantity: number
    totalPrice: number
  }>
  subtotal?: number
  shipping?: number
  tax?: number
  total: number
  cancelReason?: string
  refundStatus?: string
  stripeRefundId?: string
}

async function sendEmailViaProvider(to: string, subject: string, html: string): Promise<{ sent: boolean; provider: string; error?: string }> {
  const fromEmail = (process.env.EMAIL_FROM || 'ALPHA Medical Supplies <orders@alpha-medicalsupplies.com>').trim()

  const resendKey = (process.env.RESEND_API_KEY || '').trim()
  if (resendKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject,
          html,
        }),
      })
      if (res.ok) {
        return { sent: true, provider: 'resend' }
      }
      const errData = await res.json().catch(() => ({}))
      return { sent: false, provider: 'resend', error: errData?.message || `Resend HTTP ${res.status}` }
    } catch (err: any) {
      return { sent: false, provider: 'resend', error: err?.message }
    }
  }

  const sendgridKey = (process.env.SENDGRID_API_KEY || '').trim()
  if (sendgridKey) {
    try {
      const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sendgridKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: fromEmail.includes('<') ? fromEmail.split('<')[1].replace('>', '').trim() : fromEmail, name: 'ALPHA Medical Supplies' },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      })
      if (res.ok) {
        return { sent: true, provider: 'sendgrid' }
      }
      return { sent: false, provider: 'sendgrid', error: `SendGrid HTTP ${res.status}` }
    } catch (err: any) {
      return { sent: false, provider: 'sendgrid', error: err?.message }
    }
  }

  console.info(`[EmailService] Email queued (configure RESEND_API_KEY or SENDGRID_API_KEY to deliver): To=${to} | Subject=${subject}`)
  return { sent: false, provider: 'none', error: 'No email provider key (RESEND_API_KEY / SENDGRID_API_KEY) configured.' }
}

function renderItemsRows(items: OrderEmailPayload['items']): string {
  return (items || [])
    .map(
      (it) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;color:#0f172a;">
          <strong>${it.title}</strong><br/>
          <span style="font-size:11px;color:#64748b;">SKU: ${it.sku || 'N/A'} • Size: ${it.size || 'Standard'}</span>
        </td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:center;color:#0f172a;">${it.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-size:13px;text-align:right;font-weight:bold;color:#0f172a;">$${Number(it.totalPrice || 0).toFixed(2)}</td>
      </tr>`
    )
    .join('')
}

export async function sendOrderConfirmationEmail(payload: OrderEmailPayload) {
  if (!payload.customerEmail) return { sent: false, provider: 'none', error: 'No customer email' }

  const subject = `Order Confirmed — ${payload.orderRef} | ALPHA Medical Supplies`
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <div style="background:#96161B;color:#fff;padding:20px 24px;">
        <h2 style="margin:0;font-size:20px;">Order Confirmed — ${payload.orderRef}</h2>
        <p style="margin:4px 0 0;font-size:13px;opacity:0.9;">ALPHA Wholesale Medical Supplies LLC</p>
      </div>
      <div style="padding:24px;background:#ffffff;color:#334155;font-size:14px;line-height:1.5;">
        <p>Dear <strong>${payload.customerName || 'Valued Customer'}</strong>,</p>
        <p>Thank you for your order! Your payment has been authorized and your instruments are being prepared for dispatch from our Easley, SC facility.</p>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;">Product</th>
              <th style="padding:8px 12px;text-align:center;font-size:11px;color:#64748b;text-transform:uppercase;">Qty</th>
              <th style="padding:8px 12px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;">Total</th>
            </tr>
          </thead>
          <tbody>${renderItemsRows(payload.items)}</tbody>
        </table>
        <p style="text-align:right;font-size:15px;"><strong>Total Paid: $${Number(payload.total || 0).toFixed(2)} USD</strong></p>
        <p style="font-size:12px;color:#64748b;margin-top:20px;">Track or manage your order anytime at: <a href="https://alpha-medicalsupplies.com/track-order?ref=${encodeURIComponent(payload.orderRef)}">Track / Cancel Order</a></p>
      </div>
    </div>`

  return sendEmailViaProvider(payload.customerEmail, subject, html)
}

export async function sendOrderCancellationEmail(payload: OrderEmailPayload) {
  if (!payload.customerEmail) return { sent: false, provider: 'none', error: 'No customer email' }

  const subject = `Order Cancellation & Refund Confirmation — ${payload.orderRef} | ALPHA Medical Supplies`
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
      <div style="background:#991b1b;color:#fff;padding:20px 24px;">
        <h2 style="margin:0;font-size:20px;">Order Cancelled — ${payload.orderRef}</h2>
        <p style="margin:4px 0 0;font-size:13px;opacity:0.9;">ALPHA Wholesale Medical Supplies LLC</p>
      </div>
      <div style="padding:24px;background:#ffffff;color:#334155;font-size:14px;line-height:1.5;">
        <p>Dear <strong>${payload.customerName || 'Valued Customer'}</strong>,</p>
        <p>Your order <strong>${payload.orderRef}</strong> has been cancelled as requested.</p>
        <div style="background:#fef2f2;border:1px solid #fecaca;border-radius:8px;padding:12px 16px;margin:14px 0;font-size:13px;">
          <div><strong>Order ID:</strong> ${payload.orderRef}</div>
          <div><strong>Refund Status:</strong> ${payload.refundStatus || 'Refund Initiated via Stripe'}</div>
          ${payload.stripeRefundId ? `<div><strong>Stripe Refund ID:</strong> ${payload.stripeRefundId}</div>` : ''}
          ${payload.cancelReason ? `<div><strong>Reason:</strong> ${payload.cancelReason}</div>` : ''}
          <div><strong>Refund Amount:</strong> $${Number(payload.total || 0).toFixed(2)} USD</div>
        </div>
        <table style="width:100%;border-collapse:collapse;margin:16px 0;">
          <thead>
            <tr style="background:#f8fafc;">
              <th style="padding:8px 12px;text-align:left;font-size:11px;color:#64748b;text-transform:uppercase;">Cancelled Item</th>
              <th style="padding:8px 12px;text-align:center;font-size:11px;color:#64748b;text-transform:uppercase;">Qty</th>
              <th style="padding:8px 12px;text-align:right;font-size:11px;color:#64748b;text-transform:uppercase;">Amount</th>
            </tr>
          </thead>
          <tbody>${renderItemsRows(payload.items)}</tbody>
        </table>
        <p style="font-size:12px;color:#64748b;">Please allow 5–10 business days for the refunded amount to appear on your bank card statement. For assistance, contact Sohail@alpha-medicalsupplies.com or +1 (561) 528 9764.</p>
      </div>
    </div>`

  return sendEmailViaProvider(payload.customerEmail, subject, html)
}
