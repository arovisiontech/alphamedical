/**
 * Client-side high-quality image compressor
 * Resizes large photos (phone/camera uploads) to crisp, web-optimized images (max 800px, ~50-80KB)
 * Prevents LocalStorage QuotaExceededError and eliminates 413 Payload Too Large on serverless.
 */
export async function compressImageFile(
  file: File,
  maxWidth = 500,
  maxHeight = 500,
  quality = 0.70
): Promise<{ dataUrl: string; file: File }> {
  return new Promise((resolve) => {
    // Safety timeout: never hang the browser
    const timer = setTimeout(() => {
      resolve({ dataUrl: '', file })
    }, 4000)

    const finish = (result: { dataUrl: string; file: File }) => {
      clearTimeout(timer)
      resolve(result)
    }

    // If not an image or SVG, return as is
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml') {
      const reader = new FileReader()
      reader.onload = (e) => {
        const dataUrl = (e.target?.result as string) || ''
        finish({ dataUrl, file })
      }
      reader.onerror = () => finish({ dataUrl: '', file })
      reader.readAsDataURL(file)
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const img = new Image()
        img.onload = () => {
          try {
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
            canvas.width = Math.max(1, width)
            canvas.height = Math.max(1, height)

            const ctx = canvas.getContext('2d')
            if (!ctx) {
              finish({ dataUrl: (e.target?.result as string) || '', file })
              return
            }

            // Draw image on canvas with white background
            ctx.fillStyle = '#FFFFFF'
            ctx.fillRect(0, 0, canvas.width, canvas.height)
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)

            // Try creating lightweight file object safely (safari-compatible)
            try {
              if (typeof canvas.toBlob === 'function') {
                canvas.toBlob(
                  (blob) => {
                    if (blob) {
                      try {
                        const compressedFile = new File([blob], file.name.replace(/\.[^/.]+$/, '.jpg'), {
                          type: 'image/jpeg',
                          lastModified: Date.now(),
                        })
                        finish({ dataUrl: compressedDataUrl, file: compressedFile })
                        return
                      } catch (fErr) {}
                    }
                    finish({ dataUrl: compressedDataUrl, file })
                  },
                  'image/jpeg',
                  quality
                )
                return
              }
            } catch (blobErr) {}

            finish({ dataUrl: compressedDataUrl, file })
          } catch (innerErr) {
            finish({ dataUrl: (e.target?.result as string) || '', file })
          }
        }

        img.onerror = () => {
          finish({ dataUrl: (e.target?.result as string) || '', file })
        }

        img.src = e.target?.result as string
      } catch (loadErr) {
        finish({ dataUrl: (e.target?.result as string) || '', file })
      }
    }

    reader.onerror = () => {
      finish({ dataUrl: '', file })
    }

    reader.readAsDataURL(file)
  })
}
