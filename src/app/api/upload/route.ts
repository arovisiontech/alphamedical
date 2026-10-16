import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

// Enable file uploads for PDFs, images, etc.
export async function POST(req: NextRequest) {
  try {
    const contentType = req.headers.get('content-type') || ''

    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData()
      const file = formData.get('file') as File | null
      const uploadType = (formData.get('type') as string) || 'general' // 'catalogue' | 'product' | 'category' | 'general'

      if (!file) {
        return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Sanitize filename
      const originalName = file.name || 'uploaded-file'
      const ext = path.extname(originalName) || (uploadType === 'catalogue' ? '.pdf' : '.png')
      const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
      const uniqueName = `${baseName}_${Date.now()}${ext}`

      // Determine destination folder
      let targetFolder = path.join(process.cwd(), 'public', 'uploads')
      let publicUrlPrefix = '/uploads'

      if (uploadType === 'catalogue' || ext.toLowerCase() === '.pdf') {
        targetFolder = path.join(process.cwd(), 'public', 'catalogues')
        publicUrlPrefix = '/catalogues'
      } else if (uploadType === 'product') {
        targetFolder = path.join(process.cwd(), 'public', 'images', 'products')
        publicUrlPrefix = '/images/products'
      } else if (uploadType === 'category') {
        targetFolder = path.join(process.cwd(), 'public', 'images', 'categories')
        publicUrlPrefix = '/images/categories'
      }

      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true })
      }

      const fullPath = path.join(targetFolder, uniqueName)
      fs.writeFileSync(fullPath, buffer)

      const fileUrl = `${publicUrlPrefix}/${uniqueName}`
      const fileSizeMb = (buffer.length / (1024 * 1024)).toFixed(2) + ' MB'

      return NextResponse.json({
        success: true,
        url: fileUrl,
        filename: uniqueName,
        size: fileSizeMb,
        type: file.type,
      })
    }

    // Support base64 upload as fallback
    const body = await req.json()
    if (body.data && body.filename) {
      const uploadType = body.type || 'general'
      const originalName = body.filename
      const ext = path.extname(originalName) || (uploadType === 'catalogue' ? '.pdf' : '.png')
      const baseName = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
      const uniqueName = `${baseName}_${Date.now()}${ext}`

      let targetFolder = path.join(process.cwd(), 'public', 'uploads')
      let publicUrlPrefix = '/uploads'

      if (uploadType === 'catalogue' || ext.toLowerCase() === '.pdf') {
        targetFolder = path.join(process.cwd(), 'public', 'catalogues')
        publicUrlPrefix = '/catalogues'
      } else if (uploadType === 'product') {
        targetFolder = path.join(process.cwd(), 'public', 'images', 'products')
        publicUrlPrefix = '/images/products'
      }

      if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder, { recursive: true })
      }

      // Strip data:image/...;base64, or data:application/pdf;base64,
      const base64Data = body.data.replace(/^data:.*?;base64,/, '')
      const buffer = Buffer.from(base64Data, 'base64')
      const fullPath = path.join(targetFolder, uniqueName)
      fs.writeFileSync(fullPath, buffer)

      const fileUrl = `${publicUrlPrefix}/${uniqueName}`
      const fileSizeMb = (buffer.length / (1024 * 1024)).toFixed(2) + ' MB'

      return NextResponse.json({
        success: true,
        url: fileUrl,
        filename: uniqueName,
        size: fileSizeMb,
      })
    }

    return NextResponse.json({ success: false, error: 'Invalid upload request' }, { status: 400 })
  } catch (error: any) {
    console.error('API Upload Error:', error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
