import fs from 'fs'
import path from 'path'
import os from 'os'

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'orders.json')
const tmpFilePath = path.join(os.tmpdir(), 'alpha_orders.json')

const g = globalThis as unknown as {
  __alpha_orders?: any[]
}

export function getOrdersFromDisk(): any[] {
  if (g.__alpha_orders !== undefined && Array.isArray(g.__alpha_orders)) {
    return g.__alpha_orders
  }

  for (const filePath of [dataFilePath, tmpFilePath]) {
    try {
      if (fs.existsSync(filePath)) {
        const parsed = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
        if (Array.isArray(parsed)) {
          g.__alpha_orders = parsed
          return parsed
        }
      }
    } catch (e) {}
  }

  g.__alpha_orders = []
  return []
}

export function saveOrdersToDisk(orders: any[]): void {
  g.__alpha_orders = orders

  try {
    const dir = path.dirname(dataFilePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dataFilePath, JSON.stringify(orders, null, 2), 'utf-8')
  } catch (e) {}

  try {
    fs.writeFileSync(tmpFilePath, JSON.stringify(orders, null, 2), 'utf-8')
  } catch (e) {}
}
