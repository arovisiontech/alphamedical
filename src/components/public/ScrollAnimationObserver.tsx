'use client'

import React, { useEffect } from 'react'

export default function ScrollAnimationObserver() {
  useEffect(() => {
    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-visible')
          // Once animated, unobserve to save performance
          observer.unobserve(entry.target)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12,
    })

    const attachElements = () => {
      const elements = document.querySelectorAll(
        '.reveal-on-scroll, .reveal-scale, .reveal-left, .reveal-right'
      )
      elements.forEach((el) => {
        if (!el.classList.contains('reveal-visible')) {
          observer.observe(el)
        }
      })
    }

    attachElements()

    // Re-check after minor delay in case of dynamic component mount
    const timer = setTimeout(attachElements, 400)
    const timer2 = setTimeout(attachElements, 1200)

    return () => {
      clearTimeout(timer)
      clearTimeout(timer2)
      observer.disconnect()
    }
  }, [])

  return null
}
