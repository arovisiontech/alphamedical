/**
 * Client-side high-quality image compressor
 * Resizes large photos (phone/camera uploads) to crisp, web-optimized images (max 800px, ~50-80KB)
 * Prevents LocalStorage QuotaExceededError and eliminates 413 Payload Too Large on serverless.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.85
): Promise<{ dataUrl: string; file: File }> {
  return new Promise((resolve) => {
    // If not an image or SVG, return as is
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || ''
        resolve({ dataUrl, file })
      }
      reader.readAsDataURL(file)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      const img = new Image()
      img.onload = () => {
        let width = img.width
        let height = img.height

        // Calculate aspect-ratio preserved dimensions
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width)
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height)
            height = maxHeight
          }
        }

        const canvas = document.createElement('canvas')
        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        if (!ctx) {
          resolve({ dataUrl: e.target?.result as string, file })
          return
        }

        // Draw image on canvas
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, width, height)
        ctx.drawImage(img, 0, 0, width, height)

        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)

        // Also convert back to a lightweight File object for API uploads
        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                type: 'image/jpeg',
                lastModified: Date.now(),
              })
              resolve({ dataUrl: compressedDataUrl, file: compressedFile })
            } else {
              resolve({ dataUrl: compressedDataUrl, file })
            }
          },
          'image/jpeg',
          quality
        )
      }

      img.onerror = () => {
        resolve({ dataUrl: e.target?.result as string, file })
      }

      img.src = e.target?.result as string
    }

    reader.onerror = () => {
      resolve({ dataUrl: '', file })
    }

    reader.readAsDataURL(file)
  })
}
